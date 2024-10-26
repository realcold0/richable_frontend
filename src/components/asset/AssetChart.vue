<template>
  <div class="asset-chart">
    <div class="list-title">총 {{ assetType }} 자산 분포</div>
    <div class="chart-box">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { 
  Chart,
  DoughnutController, 
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

// Chart.js 컴포넌트 등록
Chart.register(
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
)

const props = defineProps({
  assetType: {
    type: String,
    required: true
  },
  chartData: {
    type: Array,
    required: true
  },
  chartLabels: {
    type: Array,
    required: true
  }
})

const chartCanvas = ref(null)
let chartInstance = null

const renderChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: 'doughnut',
    data: {
      labels: props.chartLabels,
      datasets: [
        {
          data: props.chartData,
          backgroundColor: ['#C30044', '#dda0dd', '#c71585', '#FFF2F6', '#DA0052']
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 70,
            padding: 100,
            font: { size: 14, weight: 'bold' }
          }
        }
      },
      layout: { padding: { top: 10, bottom: 10 } }
    }
  })
}

watch(
  () => props.chartData,
  () => {
    renderChart()
  },
  { deep: true }
)

onMounted(() => {
  renderChart()
})
</script>

<style scoped>
.asset-chart {
  position: relative;
  margin-top: 44px;
  padding-bottom: 80px;
}

.list-title {
  margin: 24px auto;
  font-size: 20px;
  font-weight: bold;
}

.chart-box {
  max-width: 1704px;
  height: 620px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 100px;
  padding-bottom: 42.5px;
}
</style>
