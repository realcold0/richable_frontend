<template>
  <div class="graph-container">
    <div class="chart-container">
      <canvas ref="myChartCanvas" style="margin-top: 20px"></canvas>
      <ToolTip1 />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps } from 'vue'
import ToolTip1 from './ToolTip1.vue'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

const props = defineProps({
  averageSpending: {
    type: Number,
    required: true
  },
  userSpending: {
    type: Number,
    required: true
  }
})

const myChartCanvas = ref(null) // canvas 요소에 접근하기 위한 ref
let myChart = null

const createComparisonChart = () => {
  if (myChart) myChart.destroy() // 이전 차트 삭제

  if (!myChartCanvas.value) {
    console.error('Cannot find the canvas element')
    return
  }

  const ctx1 = myChartCanvas.value.getContext('2d')
  myChart = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: ['평균 소비', '나의 소비'],
      datasets: [
        {
          label: '소비 비교',
          data: [props.averageSpending, props.userSpending],
          backgroundColor: ['#d3d3d3', '#ff6384'],
          borderWidth: 1,
          borderRadius: 10,
          barThickness: 50
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
          grid: { display: false },
          beginAtZero: true,
          ticks: {
            callback: (value) => `${value.toLocaleString()}원`
          }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#767676' }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => `${tooltipItem.raw.toLocaleString()}원`
          }
        }
      }
    }
  })
}

onMounted(createComparisonChart)
watch([() => props.averageSpending, () => props.userSpending], createComparisonChart)
</script>

<style scoped>
.graph-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 432px;
  background: #fff;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 800px;
  height: auto;
  border-radius: 20px;
  border: 1px solid #e4ebf0;
}
</style>
