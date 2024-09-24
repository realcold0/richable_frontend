<template>
  <div class="container">
    <!-- 월간 네비게이션 -->
    <div class="month-navigation text-center">
      <button @click="previousMonth" class="btn btn-light custom-btn">
        <i class="fas fa-chevron-left"></i>
      </button>
      <h2>{{ months[currentMonthIndex] }}</h2>
      <button @click="nextMonth" class="btn btn-light custom-btn">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- 상단 소비 정보 -->
    <div class="text-center mb-4 saved-info">
      <h2>이번 달에 아낄 수 있었던 비용이에요 😏</h2>
      <h1 class="saved-amount">{{ totalSaved.toLocaleString() }}원</h1>
    </div>

    <!-- 카테고리 선택 및 비교 -->
    <div class="text-center mb-4 category-comparison">
      <h4>대한민국 평균 소비금액을 기준으로 비교해요</h4>
      <h5>나는 평균 대비 얼마나 지출할까요?</h5>
      <select v-model="category" class="form-select custom-select">
        <option v-for="option in categories" :key="option" :value="option">{{ option }}</option>
      </select>
      <p>
        나의 이번 달 <strong>{{ category }}</strong> 소비는 평균보다
        <strong :class="diffAmount > 0 ? 'text-success' : 'text-danger'"
          >{{ Math.abs(diffAmount).toLocaleString() }}원</strong
        >
        <span v-if="diffAmount > 0" class="text-success">적습니다</span>
        <span v-else class="text-danger">많습니다</span>.
      </p>
      <canvas id="myChart"></canvas>
    </div>

    <!-- 소비 데이터 표 -->
    <div class="table-responsive mt-4">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>날짜</th>
            <th>가격</th>
            <th>장소</th>
            <th>소비 분석</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedData" :key="index">
            <td>{{ item.date }}</td>
            <td>{{ item.price.toLocaleString() }}원</td>
            <td>{{ item.place }}</td>
            <td>{{ item.analysis }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지 네비게이션 -->
    <nav class="pagination-container">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
        </li>
      </ul>
    </nav>

    <!-- 6개월 절약 시뮬레이션 -->
    <div class="mt-5 text-center savings-simulation">
      <h4>6개월 간 소비를 절약했을 때</h4>
      <p>
        이번 달 소비를 줄일 수 있는 소비는
        <strong class="highlight">{{ currentSavings.toLocaleString() }}원</strong>입니다. 6개월 동안
        <strong class="highlight">{{ totalSavings.toLocaleString() }}원</strong> 절약이 가능해요!
      </p>
      <canvas id="savingChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'
// import apiClient from '@/services/api' // Axios 인스턴스 불러오기

// 차트.js 등록
Chart.register(...registerables)

// 달별 네비게이션
const months = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월'
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
  '기타'
])
const category = ref('식료품')
const userSpending = ref(700000)
const averageSpending = 50000
const diffAmount = computed(() => userSpending.value - averageSpending)

// 소비 데이터 및 페이지네이션
const consumptionData = ref([]) // 초기값을 빈 배열로 설정
const currentPage = ref(1)
const itemsPerPage = ref(5)
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return consumptionData.value.slice(start, start + itemsPerPage.value)
})
const totalPages = computed(() => Math.ceil(consumptionData.value.length / itemsPerPage.value))
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

// 6개월 저축 시뮬레이션
const currentSavings = ref(120000)
const totalSavings = ref(600000)

// 소비 데이터 가져오기
const fetchConsumes = async () => {
  try {
    const response = await apiClient.get('/all') // 백엔드에서 전체 소비 데이터를 가져옴
    consumptionData.value = response.data // 데이터를 consumptionData에 저장
  } catch (error) {
    console.error('Error fetching consume data:', error)
  }
}

// 차트 초기화
onMounted(() => {
  fetchConsumes() // 컴포넌트가 마운트될 때 소비 데이터를 가져옴

  const myChart = new Chart(document.getElementById('myChart').getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['평균 소비', '나의 소비'],
      datasets: [
        {
          label: '소비 비교',
          data: [averageSpending, userSpending.value],
          backgroundColor: ['#d3d3d3', '#ff6384'],
          borderWidth: 1 // 막대 두께 수정
        }
      ]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } },
      plugins: {
        legend: {
          position: 'bottom' // 범례 위치
        }
      }
    }
  })

  const savingChart = new Chart(document.getElementById('savingChart').getContext('2d'), {
    type: 'line',
    data: {
      labels: ['2024.10', '2024.11', '2024.12', '2025.01', '2025.02'],
      datasets: [
        {
          label: '절약했을 때 저축',
          data: [120000, 240000, 360000, 480000, 600000],
          borderColor: '#ff6384',
          fill: false,
          borderWidth: 2 // 선 두께 조정
        },
        {
          label: '평소 저축',
          data: [60000, 120000, 180000, 240000, 300000],
          borderColor: '#d3d3d3',
          fill: false,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } },
      plugins: {
        legend: {
          position: 'top' // 범례 위치 상단
        }
      }
    }
  })
})
</script>

<style scoped>
/* 월 네비게이션 */
.month-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.month-navigation h2 {
  margin: 0 20px;
  font-size: 24px;
}

/* 월 전환 버튼 */
.custom-btn {
  font-size: 24px;
  border-radius: 50%; /* 둥근 버튼 모양 */
  padding: 10px;
}

/* 상단 소비 정보 */
.saved-info h2 {
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 20px;
  margin-bottom: 10px;
}

.saved-amount {
  font-family: 'Noto Sans KR', sans-serif;
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

.custom-select {
  width: 300px;
  height: 40px;
  font-size: 16px;
  margin-bottom: 10px;
  border: 2px solid #d3d3d3; /* 선택 박스 모양 조정 */
}

/* 테이블 및 페이지네이션 */
.table th,
.table td {
  vertical-align: middle;
  text-align: center;
}

.pagination-container {
  margin-top: 20px;
}

.pagination .page-link {
  color: #ff6384;
}

.pagination .page-item.active .page-link {
  background-color: #ff6384;
  border-color: #ff6384;
}

/* 6개월 절약 시뮬레이션 */
.savings-simulation h4 {
  font-size: 18px;
  margin-bottom: 10px;
}

.savings-simulation p {
  font-size: 16px;
}

.savings-simulation .highlight {
  font-weight: bold;
  color: #ff6384;
}

/* 차트 스타일 */
canvas {
  max-width: 100%;
  margin: 0 auto;
  display: block;
}
</style>
