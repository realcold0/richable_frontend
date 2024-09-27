<template>
  <div class="container">
    <!-- 월간 네비게이션 -->
    <div class="month-navigation text-center">
      <!-- 이전 달 버튼 -->
      <button @click="previousMonth" class="btn custom-btn-left"></button>
      <h2>{{ months[currentMonthIndex] }}</h2>
      <!-- 다음 달 버튼 -->
      <button @click="nextMonth" class="btn custom-btn-right"></button>
    </div>

    <!-- 상단 소비 정보 -->
    <div class="text-center mb-4 saved-info">
      <h2>이번 달에 아낄 수 있었던 비용이에요</h2>
      <h1 class="saved-amount">{{ totalSaved.toLocaleString() }}원</h1>
    </div>

    <!-- 카테고리 선택 및 비교 -->
    <div class="text-left mb-4 category-comparison">
      <h4>대한민국 평균 소비금액을 기준으로 비교해요</h4>
      <h5>나는 평균 대비 얼마나 지출할까요?</h5>
    </div>

    <div class="text-center">
      <p>
        나의 이번 달 <select v-model="category" class="form-select custom-inline-select">
          <option v-for="option in categories" :key="option" :value="option">{{ option }}</option>
        </select>
        소비는 평균보다
        <strong :class="diffAmount > 0 ? 'text-success' : 'text-danger'">
          {{ Math.abs(diffAmount).toLocaleString() }}원
        </strong>
        <span v-if="diffAmount > 0" class="text-success">적습니다</span>
        <span v-else class="text-danger">많습니다</span>.
      </p>
      <canvas id="myChart"></canvas>
    </div>

    <!-- 6개월 절약 시뮬레이션 -->
    <div class="savings-summary-container">
      <div class="summary-header">
        <h4>6개월 간 소비를 절약했을 때</h4>
      </div>
      <p>
        이번 달 소비 중 줄일 수 있는 소비는
        <strong class="highlight">{{ currentSavings.toLocaleString() }}원</strong>이에요.
        <br />6개월 동안
        <strong class="highlight">{{ totalSavings.toLocaleString() }}원</strong> 절약이 가능해요!
      </p>
      <canvas id="savingChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import axios from 'axios'
import { useRoute } from 'vue-router'

// 차트.js 등록
Chart.register(...registerables)

// 달별 네비게이션
const months = [
  '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월',
]
const currentMonthIndex = ref(8)
const previousMonth = () => {
  if (currentMonthIndex.value > 0) currentMonthIndex.value -= 1
}
const nextMonth = () => {
  if (currentMonthIndex.value < 11) currentMonthIndex.value += 1
}

// 소비 정보
const totalSaved = ref(12100000)
const categories = ref([
  '식료품',
  '유흥',
  '쇼핑',
  '공과금',
  '생활용품',
  '의료비',
  '교통비',
  '통신비',
  '문화',
  '교육비',
  '외식/숙박',
  '기타',
])
const category = ref('식료품')
const userSpending = ref(0)
const averageSpending = ref(50000)
const diffAmount = computed(() => userSpending.value - averageSpending)

// 6개월 저축 시뮬레이션
const currentSavings = ref(120000)
const totalSavings = ref(600000)

// 라우터에서 uid 가져오기
const route = useRoute()
const uid = route.params.uid

// 소비 데이터 가져오기
const fetchConsumes = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/consume/user/${uid}`)
    consumptionData.value = response.data

    // 카테고리에 따른 소비 데이터 필터링
    userSpending.value = consumptionData.value
      .filter((item) => item.category === category.value)
      .reduce((sum, item) => sum + item.amount, 0)
  } catch (error) {
    console.error('Error fetching consume data:', error)
  }
}

// 차트 초기화
let myChart = null
let savingChart = null

const createCharts = () => {
  const ctx1 = document.getElementById('myChart').getContext('2d')
  const ctx2 = document.getElementById('savingChart').getContext('2d')

  if (myChart) myChart.destroy() // 이전 차트 삭제
  if (savingChart) savingChart.destroy()

  // 막대 그래프 설정 - 둥근 모서리, 두드러진 색상
  myChart = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: ['평균 소비', '나의 소비'],
      datasets: [
        {
          label: '소비 비교',
          data: [averageSpending.value, userSpending.value],
          backgroundColor: ['#d3d3d3', '#ff6384'],
          borderWidth: 1,
          borderRadius: 10,  // 둥근 모서리 설정
          barThickness: 50,  // 막대 두께 조정
        },
      ],
    },
    options: {
      responsive: true,
      scales: { 
        y: { 
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value.toLocaleString() + '원';  // y축 값에 '원' 단위 추가
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false,  // 범례 비활성화
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              return tooltipItem.raw.toLocaleString() + '원';  // 툴팁에 '원' 추가
            },
          },
        },
      },
    },
  })

  savingChart = new Chart(ctx2, {
    type: 'line',
    data: {
      labels: ['2024.10', '2024.11', '2024.12', '2025.01', '2025.02'],
      datasets: [
        {
          label: '절약했을 때 저축',
          data: [120000, 240000, 360000, 480000, 600000],
          borderColor: '#ff6384',
          fill: false,
          borderWidth: 2,
        },
        {
          label: '평소 저축',
          data: [60000, 120000, 180000, 240000, 300000],
          borderColor: '#d3d3d3',
          fill: false,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } },
      plugins: {
        legend: {
          position: 'top',
        },
      },
    },
  })
}

// 데이터 가져온 후 차트 생성
onMounted(() => {
  fetchConsumes().then(() => {
    createCharts()
  })
})

// 카테고리 변경 시 차트 업데이트
watch(category, () => {
  if (consumptionData.value.length > 0) {
    userSpending.value = consumptionData.value
      .filter((item) => item.category === category.value)
      .reduce((sum, item) => sum + item.amount, 0)
    createCharts()
  }
})
</script>

<style scoped>
/* 월 네비게이션 */
.month-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0px;
}

.month-navigation h2 {
  margin: 0 20px;
  font-size: 24px;
}

.custom-btn-left,
.custom-btn-right {
  width: 0;
  height: 0;
  border: 10px solid transparent;
  background: none;
  padding: 0;
  margin: 10px;
}

.custom-btn-left {
  border-right-color: #c0c0c0;
}

.custom-btn-right {
  border-left-color: #c0c0c0;
}

/* 상단 소비 정보 */
.saved-info h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

.saved-amount {
  font-size: 36px;
  font-weight: bold;
  color: #ff6384;
}

/* 카테고리 비교 */
.category-comparison h4 {
  font-size: 18px;
  margin-bottom: 10px;
}

.category-comparison h5 {
  font-size: 16px;
  margin-bottom: 20px;
}

.custom-inline-select {
  display: inline-block;
  width: auto; /* select 박스 크기를 자동으로 맞춤 */
  margin-left: 5px; /* 약간의 여백 추가 */
  margin-right: 5px;
}


/* 6개월 절약 시뮬레이션 */
.savings-summary-container {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.savings-summary-container h4 {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: left;
}

.savings-summary-container p {
  font-size: 16px;
  color: #666;
}

.highlight {
  color: #ff6384;
  font-weight: bold;
  font-size: 18px;
}

/* 차트 스타일 */
canvas {
  max-width: 100%;
  margin: 0 auto;
  display: block;
}
</style>
