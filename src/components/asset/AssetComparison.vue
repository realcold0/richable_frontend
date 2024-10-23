<template>
  <div class="asset-analysis-nav">
    <div class="tooltip-box">
  <button
    class="tool-btn"
    ref="tooltipButton"
    type="button"
    data-bs-toggle="tooltip"
    data-bs-placement="right"
    :title="tooltipMessage"
  >
    <font-awesome-icon icon="circle-question" style="color: #666;" />
  </button>
</div>
        <div class="asset-title">전체 자산 비교</div>
      </div>
  <div class="asset-graph-container" v-if="isDataReady">
    <div class="graphs-wrapper">
      <div class="graph-container">
        <div class="graph-container-title">
          {{ nickname }}님의 자산은 
          <strong :style="{ color: assetDifference > 0 ? '#ff0062' : '#2768FF' }">
            {{ assetDifferenceText }}
          </strong>
        </div>
        <canvas id="barChart" class="chart-size"></canvas>
      </div>
      <div class="graph-container">
        <div class="graph-container-title">{{ nickname }}님의 카테고리별 자산 비교</div>
        <canvas id="radarChart" class="chart-size"></canvas>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Loading charts...</p>
  </div>
</template>

<script setup>
import { Tooltip as BootstrapTooltip } from 'bootstrap';
import { ref, watch, onMounted,onUnmounted , nextTick } from 'vue';
import { Chart, BarController, RadarController, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, RadialLinearScale } from 'chart.js';

// Register Chart.js components
Chart.register(
  BarController, RadarController, CategoryScale, LinearScale, RadialLinearScale,
  PointElement, LineElement, BarElement, Title, Tooltip, Legend
);

// Define props
const props = defineProps({
  nickname: String, peerAverageAsset: Number, currentAsset: Number,
  assetDifference: Number, assetList: Array,
});

// Local state
const assetDifferenceText = ref('');
const isDataReady = ref(false);

const tooltipButton = ref(null) // 툴팁 버튼
const tooltipInstance = ref(null) // 툴팁 인스턴스
const tooltipMessage = ref('평균값은 KOSIS 산업별 가구당 월 [평균] 가계수지 입니다.')

// Helper function to update asset difference text
const updateAssetDifferenceText = (difference) => {
  if (difference === undefined || difference === null) return;
  
  try {
    assetDifferenceText.value = difference > 0
      ? `${Math.floor(difference).toLocaleString()}만원 많습니다.`
      : `${Math.abs(Math.floor(difference)).toLocaleString()}만원 적습니다.`;
  } catch (error) {
    console.error('Error updating asset difference text:', error);
    assetDifferenceText.value = '금액을 계산할 수 없습니다.';
  }
};

// Create charts when data is ready
const createCharts = () => {
  if (!isDataReady.value) return;

  try {
    const barCtx = document.getElementById('barChart')?.getContext('2d');
    const radarCtx = document.getElementById('radarChart')?.getContext('2d');

    if (!barCtx || !radarCtx) {
      console.warn('Chart contexts not found');
      return;
    }

    // Bar chart
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['20대 평균', '나의 자산'],
        datasets: [
          {
            label: '자산 비교',
            data: [props.peerAverageAsset, props.currentAsset],
            backgroundColor: ['#CCCCCC', '#FF0062'],
            borderColor: ['#CCCCCC', '#FF0062'],
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          bar: { borderRadius: 20, }
        },
        layout: { padding: 20 }
      }
    });

    // Radar chart
    new Chart(radarCtx, {
      type: 'radar',
      data: {
        labels: props.assetList.map(item => item.category),
        datasets: [
          {
            label: '나의 자산',
            data: props.assetList.map(item => item.myAsset),
            backgroundColor: 'rgba(255, 0, 98, 0.2)',
            borderColor: '#FF0062',
            pointBackgroundColor: '#FF0062',
          },
          {
            label: '평균 자산',
            data: props.assetList.map(item => item.averageAsset),
            backgroundColor: 'rgba(204, 204, 204, 0.2)',
            borderColor: '#CCCCCC',
            pointBackgroundColor: '#CCCCCC',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: 20
        },
        scales: {
          r: {
            beginAtZero: true,
            ticks: {
              stepSize: 10000000,
              callback: function(value) {
                return Math.floor(value / 10000000).toLocaleString() + '천만원';
              }
            },
            pointLabels: {
              font: {
                size: 12,
                family: 'Pretendard'
              },
              callback: function(value) {
                const labelMap = {
                  deposit: '예금',
                  saving: '적금',
                  stock: '주식',
                  coin: '코인',
                  cash: '현금',
                  withdrawal: '입출금',
                  subscription: '청약',
                  bond: '채권',
                };
                return labelMap[value] || value;
              }
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                family: 'Pretendard',
                size: 12
              },
              padding: 20
            }
          },
          tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // 툴팁 배경색
        titleFont: {
          size: 14,
          family: "'Pretendard', sans-serif",
        },
        bodyFont: {
          size: 12,
          family: "'Pretendard', sans-serif",
        },
        bodyColor: '#fff', // 툴팁 내용 글자색
        borderColor: '#333', // 툴팁 테두리 색상
        borderWidth: 1, // 툴팁 테두리 두께
      }
        }
      }
    })
  } catch (error) {
    console.error('Error creating charts:', error);
  }
};

// Watch for props changes
watch(
  () => props.assetDifference,
  (newValue) => {
    if (newValue !== undefined) {
      updateAssetDifferenceText(newValue);
    }
  },
  { immediate: true }
);

watch(
  [() => props.peerAverageAsset, () => props.currentAsset, () => props.assetList],
  async ([newPeerAvg, newCurrentAsset, newAssetList]) => {
    if (newPeerAvg && newCurrentAsset && newAssetList?.length > 0) {
      isDataReady.value = true;
      await nextTick();
      createCharts();
    }
  },
  { immediate: true }
);

// Initialize on mount
onMounted(() => {
  if (props.assetDifference !== undefined) {
    updateAssetDifferenceText(props.assetDifference);
  }
  // Tooltip 초기화
  nextTick(() => {
    if (tooltipButton.value) {
      tooltipInstance.value = new BootstrapTooltip(tooltipButton.value, {
        trigger: 'hover', // 마우스 오버시 작동
        placement: 'right',
        html: true
      });
    }
  });
});
onUnmounted(() => {
  if (tooltipInstance.value) {
    tooltipInstance.value.dispose();
  }});
</script>

<style scoped>
/* Layout */
.asset-analysis-nav {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.asset-title {
  font-size: 20px;
  font-weight: 500;
  margin-top: 10px;
}

.asset-graph-container {
  margin-top: 40px;
  width: 100%;
}

/* Graph Layout */
.graphs-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 130px;
  flex-wrap: wrap;
}

.graph-container {
  flex: 1;
  min-width: 450px;
  max-width: 600px;
  height: 400px;
}

/* Common Styles */
.common-box {
  border: 1px solid #e4ebf0;
  border-radius: 20px;
}

.graph-container-title {
  font-size: 18px;
  padding: 30px;
  background-color: #f9f9f9;
  color: #19181d;
  text-align: center;
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
}

.chart-size {
  margin-top: 8px;
  width: 100%;
  height: 300px;
}

/* Tooltip Styles */
.tooltip-box {
  position: absolute;
  right: 0;
  top: 30px;
  z-index: 10;
}

.tool-btn {
  border: none;
  background: none;
  padding: 8px;
  cursor: pointer;
  transition: opacity 0.3s;
  outline: none;
}

.tool-btn .fa-circle-question {
  font-size: 24px;
  color: #666;
}

:deep(.tooltip) {
  --tooltip-bg-color: rgba(0, 0, 0, 0.8);
  --tooltip-text-color: white;
  --tooltip-font: 'Pretendard', sans-serif;
  
  font-family: var(--tooltip-font);
  opacity: 1 !important;
}

:deep(.tooltip-inner) {
  background-color: var(--tooltip-bg-color);
  color: var(--tooltip-text-color);
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  max-width: 400px;
  line-height: 1.5;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  white-space: normal;
}

:deep(.tooltip .tooltip-arrow::before) {
  border-right-color: var(--tooltip-bg-color);
}

/* Responsive */
@media (max-width: 968px) {
  .graphs-wrapper {
    flex-direction: column;
    align-items: center;
  }

  .graph-container {
    width: 100%;
    max-width: 450px;
  }
}
</style>