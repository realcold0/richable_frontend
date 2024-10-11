<template>
  <div class="wrapper">
    <div style="width: 1000px">
      <div class="text-left category-comparison">
        <div class="main-title">전달 소비 누계 비교</div>
      </div>

      <!-- 설명 문구 부분 -->
      <div class="consumeCompareTitle">
        저번 달보다
        <span
          :class="{ 'highlight-more': totalDifference > 0, 'highlight-less': totalDifference <= 0 }"
        >
          {{ differenceMessage }}원 {{ totalDifference > 0 ? ' 더' : ' 덜' }} 썼어요!
        </span>
      </div>

      <!-- 그래프 부분 -->
      <div class="graphWrapper">
        <div class="graph">
          <canvas ref="lineChart"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMonthStore } from '@/stores/consume/curMonth'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { nextTick, onMounted, ref, watch } from 'vue'
import axiosinstance from '@/AxiosInstance'

ChartJS.register(LineElement, PointElement, LineController, CategoryScale, LinearScale)

const month = useMonthStore()
const lineChart = ref(null)
let chartInstance = null

const curMonth = ref([])
const prevMonth = ref([])
const today = new Date()
const currentYear = today.getFullYear()
const currentMonth = today.getMonth() + 1
const currentDay = today.getDate()
const days = Array.from({ length: 31 }, (_, i) => i + 1)

const differenceMessage = ref('')
let totalDifference = 0

const renderLineChart = async () => {
  await nextTick()

  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = lineChart.value.getContext('2d')

  await axiosinstance
    .get(`/outcome/category/dailysum/${month.year}/${month.month}`)
    .then((response) => {
      if (month.year === currentYear && month.month === currentMonth) {
        curMonth.value = response.data.response.data.prices.slice(0, currentDay)
      } else {
        curMonth.value = response.data.response.data.prices
      }
    })
    .catch((error) => {
      console.log(error)
    })

  await axiosinstance
    .get(`/outcome/category/dailysum/${month.getPrevMonth.year}/${month.getPrevMonth.month}`)
    .then((response) => {
      prevMonth.value = response.data.response.data.prices
    })
    .catch((error) => {
      console.log(error)
    })

  const curValue = curMonth.value[currentDay - 1] || 0
  const prevValue = prevMonth.value[currentDay - 1] || 0

  totalDifference = curValue - prevValue

  differenceMessage.value = `${Math.abs(totalDifference).toLocaleString()}`

  chartInstance = new ChartJS(lineChart.value, {
    type: 'line',
    data: {
      labels: days,
      datasets: [
        {
          label: month.month + '월',
          data: curMonth.value,
          fill: false, // 현재 월은 채우지 않음
          borderColor: '#FF0062',
          borderWidth: 2,
          borderCapStyle: 'round',
          borderJoinStyle: 'round',
          tension: 0.4,
          pointRadius: days.map((day) => {
            if (month.year === currentYear && month.month === currentMonth && day === currentDay) {
              return 6
            }
            return 0
          }),
          pointBackgroundColor: '#FF0062'
        },
        {
          label: month.getPrevMonth.month + '월',
          data: prevMonth.value,
          fill: true, // 그라데이션 채우기
          borderColor: '#D1D6D9',
          borderWidth: 2,
          borderCapStyle: 'round',
          borderJoinStyle: 'round',
          tension: 0.4,
          pointRadius: 0,
          backgroundColor: function (context) {
            const chart = context.chart
            const { ctx, chartArea } = chart

            if (!chartArea) {
              return null
            }

            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
            gradient.addColorStop(0, 'rgba(209, 214, 217, 0)') // 아래쪽 투명
            gradient.addColorStop(1, 'rgba(209, 214, 217, 0.5)') // 위쪽 반투명
            return gradient
          }
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 20,
            padding: 20
          }
        }
      },
      elements: {
        line: {
          tension: 0.4
        },
        point: {
          radius: 0
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          display: false,
          grid: {
            display: false
          }
        }
      }
    }
  })
}

onMounted(() => {
  renderLineChart()
})

watch(
  () => month.month,
  () => {
    renderLineChart()
  }
)
</script>

<style scoped>
* {
  font-family: 'Pretendard', sans-serif;
  font-size: 18px;
}

.wrapper {
  width: 1000px;
  margin: 0 auto;
  padding: 20px;
}
/* 설명 문구 스타일 */
.consumeCompareTitle {
  margin-top: 8px;
  flex-shrink: 0;
  border-radius: 20px;
  background: #fafafb;
  display: flex;
  height: 120px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  border: 1px solid #f8f8f8;
}

/* 클래스 기반으로 색상 변경 */
.highlight-more {
  color: #ff0062;
  font-weight: 500;
}

.highlight-less {
  color: #0062ff;
  font-weight: 500;
}

.graphWrapper {
  margin-top: 8px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 15px;
  border: 1px solid #e0e0e0;
  display: flex; /* Flexbox 사용 */
  justify-content: center; /* 수평 가운데 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
}

.graph {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%; /* 부모 요소 기준으로 너비 설정 */
  height: 500px;
}

canvas {
  display: block;
  width: 100%; /* 전체 너비로 설정 */
  height: 100%; /* 부모 높이로 설정 */
}

.sub-title {
  color: var(--3, #414158);
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 27px */
  letter-spacing: -0.36px;
}

.main-title {
  margin-top: 8xp;
  color: var(--3, #414158);
  font-feature-settings: 'dlig' on;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 27px; /* 135% */
}
</style>
