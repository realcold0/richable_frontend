<template>
  <div class="saving-content">
    <div class="summary-header">
      <div class="main-title">6개월 간 소비를 절약했을 때</div>
    </div>

    <div v-if="possibleSaveAmount.length > 0">
      <div class="total-consume">
        <div class="consume-title">
          {{
            saveAmount - possibleSaveAmount > 0
              ? '이번 달 소비 중 줄일 수 있는 소비는 '
              : '이번달에 아낀 소비는 '
          }}
          <span style="font-size: 18px; font-weight: 500; color: #ff0062">
            {{ Math.abs(couldsaving).toLocaleString() }}
          </span>
          원 이에요 😲
        </div>

        <div class="consume-title">
          6개월 동안
          <span style="font-size: 18px; font-weight: 500; color: #ff0062">
            {{ Math.abs(couldsaving * 6).toLocaleString() }}
          </span>
          원 절약이 가능해요!
        </div>
      </div>

      <!-- 절약 차트 -->
      <div class="graph-container2">
        <div class="save-chart-container">
          <canvas style="margin-top: 20px" id="savingChart"></canvas>
        </div>
        <ToolTip2 />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, nextTick, watch } from 'vue'
import { Chart } from 'chart.js'
import ToolTip2 from './ToolTip2.vue'

let savingChart = null

const props = defineProps({
  months: {
    type: Array,
    required: true
  },
  saveAmount: {
    type: Array,
    required: true
  },
  possibleSaveAmount: {
    type: Array,
    required: true
  },
  couldsaving: {
    type: Number,
    required: true
  }
})

const createSavingChart = () => {
  const ctx2 = document.getElementById('savingChart')?.getContext('2d')

  if (!ctx2) {
    console.error('Cannot get context for savingChart')
    return
  }

  if (savingChart) savingChart.destroy()

  savingChart = new Chart(ctx2, {
    type: 'line',
    data: {
      labels: props.months,
      datasets: [
        {
          label: '절약했을 때 저축',
          data: props.possibleSaveAmount,
          borderColor: '#FF6384',
          fill: false,
          borderWidth: 2
        },
        {
          label: '평소 저축',
          data: props.saveAmount,
          borderColor: '#D3D3D3',
          fill: false,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      layout: {
        padding: {
          top: 20,
          bottom: 20,
          left: 20,
          right: 20
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return `${value.toLocaleString()}원`
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return `${tooltipItem.raw.toLocaleString()}원`
            }
          }
        }
      }
    }
  })
}

// 데이터가 로드된 후 차트를 생성하도록 설정
onMounted(() => {
  nextTick(createSavingChart) // DOM이 렌더링된 후 차트 생성
})

watch([() => props.months, () => props.saveAmount, () => props.possibleSaveAmount], () => {
  nextTick(createSavingChart) // 데이터가 업데이트된 후 차트 생성
})
</script>

<style scoped>
* {
  font-family: pretendard;
  color: #19181d;
  font-size: 20px;
}

.saving-content {
  margin-top: 100px;
}

.main-title {
  margin-top: 8px;
  color: var(--3, #414158);
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 700;
  line-height: 27px;
}

.total-consume {
  margin-top: 21px;
  border-radius: 20px;
  background: #fafafb;
  display: flex;
  height: 150px;
  padding: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #f8f8f8;
}

.consume-title {
  color: var(--black-default, #19181d);
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 400;
  line-height: 32px;
  letter-spacing: -0.8px;
}

.graph-container2 {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 432px;
  background: #fff;
}

.save-chart-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  justify-content: center;
}

#savingChart {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  border: 1px solid #e4ebf0;
}
</style>
