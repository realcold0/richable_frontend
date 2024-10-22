<template>
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
import { ref, watch, onMounted, nextTick } from 'vue';
import { Chart, BarController, RadarController, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, RadialLinearScale } from 'chart.js';

// Register Chart.js components
Chart.register(
  BarController,
  RadarController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define props
const props = defineProps({
  nickname: String,
  peerAverageAsset: Number,
  currentAsset: Number,
  assetDifference: Number,
  assetList: Array,
});

// Local state
const assetDifferenceText = ref('');
const isDataReady = ref(false);

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
        scales: {
          r: {
            beginAtZero: true,
          }
        }
      }
    });
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
});
</script>

<style scoped>
.asset-graph-container {
  margin-top: 40px;
  width: 100%;
}

.graphs-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.graph-container {
  flex: 1;
  min-width: 450px;
  max-width: 600px;
  height: 400px;
}

.graph-container-title {
  font-size: 18px;
  padding: 30px;
  background-color: #f9f9f9;
  border: 1px solid #e4ebf0;
  color: #19181d;
  text-align: center;
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  border-radius: 20px;
}

.chart-size {
  margin-top: 8px;
  border: 1px solid #e4ebf0;
  border-radius: 20px;
  width: 100%;
  height: 300px;
}

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