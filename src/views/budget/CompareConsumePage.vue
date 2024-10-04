<template>
  <div class="container">
    <!-- 월간 네비게이션 -->
    <div class="month-navigation text-center">
      <!-- 이전 달 버튼 -->
      <button @click="previousMonth" class="btn custom-btn-left"></button>
      <div>{{ months[currentMonthIndex] }}</div>
      <!-- 다음 달 버튼 -->
      <button @click="nextMonth" class="btn custom-btn-right"></button>
    </div>

<!-- 상단 소비 정보 -->
<div class="text-center mb-4 saved-info">
<div>이번 달에 아낄 수 있었던 비용이에요</div>

<!-- couldsaving 값이 0보다 작을 때 '잘 아껴 쓰셨네요!' 문구를 표시 -->
<div v-if="couldsaving <= 0" class="saved-amount">{{ Math.abs(couldsaving).toLocaleString() }}원</div>

<!-- couldsaving 값이 0보다 작을 때 '잘 아껴 쓰셨네요!' 문구를 표시 -->
<div v-else class="saved-amount">이번달은 잘 아껴 쓰셨네요!</div>
</div>



    <!-- 카테고리 선택 및 비교 -->
    <div class="text-left mb-4 category-comparison">
      <div>대한민국 평균 소비금액을 기준으로 비교해요</div>
      <h5>나는 평균 대비 얼마나 지출할까요?</h5>
    </div>

    <div class="text-center">
      <p>
          나의 이번 달 
          <select v-model="category" class="form-select custom-inline-select">
          <option v-for="option in categories" :key="option" :value="option">{{ option }}</option>
          </select>
          소비는 평균보다
          <strong :class="diffAmount > 0 ? 'text-success' : 'text-danger'">
          {{ Math.abs(diffAmount).toLocaleString() }}원
          </strong>
          <span v-if="diffAmount > 0" class="text-success">많습니다</span>
          <span v-else class="text-danger">적습니다</span>.
      </p>
      <canvas id="myChart"></canvas>
      </div>


    <!-- 6개월 절약 시뮬레이션 -->
    <div v-if="totalSavings < 0" class="savings-summary-container">
      <div class="summary-header">
        <h4>6개월 간 소비를 절약했을 때</h4>
      </div>
      <p>
        이번 달 소비 중 줄일 수 있는 소비는
        <strong class="highlight">{{ (currentSavings || 0).toLocaleString() }}원</strong>이에요.
        <br />6개월 동안
        <strong class="highlight">{{ (totalSavings || 0).toLocaleString() }}원</strong> 절약이 가능해요!
      </p>
      <canvas id="savingChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import axios from 'axios'

// 차트.js 등록
Chart.register(...registerables)

// 달별 네비게이션
const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
const currentMonthIndex = ref(8) // 현재 9월로 설정 (0부터 시작)
const category = ref('식료품') // 기본 카테고리를 '식료품'으로 설정
const categories = ref(['식료품', '유흥', '쇼핑', '공과금', '생활용품', '의료비', '교통비', '통신비', '문화', '교육비', '외식 · 숙박', '기타'])
const totalSaved = ref(12100000) // 기본값 설정
const currentSavings = ref(120000) // 기본값 설정
const totalSavings = ref(600000) // 기본값 설정
const userSpending = ref(0)
const couldsaving = ref(0)
const averageSpending = ref(0)
const diffAmount = computed(() =>  userSpending.value - averageSpending.value)

const wordMapping2 = {
'식료품': '식료품 · 비주류음료',
'유흥': '주류 · 담배',
'쇼핑': '의류 · 신발',
'공과금': '주거 · 수도 · 광열',
'생활용품': '가정용품 · 가사서비스',
'의료비': '보건',
'교통비': '교통',
'통신비': '통신',
'문화': '오락 · 문화',
'교육비': '교육',
'외식 · 숙박': '음식 · 숙박',
'기타': '기타상품 · 서비스'
};

// 매핑 함수
function mapColumnToKeyword2(keyword) {
return wordMapping2[keyword] || '매핑되지 않은 컬럼';
}

// 차트 초기화 변수
let myChart = null

// 이전/다음 달 버튼 클릭 시
const previousMonth = () => {
if (currentMonthIndex.value > 0) currentMonthIndex.value -= 1
fetchComparisonData() // 월 변경 시 데이터 가져오기
}
const nextMonth = () => {
if (currentMonthIndex.value < 11) currentMonthIndex.value += 1
fetchComparisonData() // 월 변경 시 데이터 가져오기
}

// 카테고리 변경 시 데이터 가져오기
watch(category, () => {
fetchComparisonData();
});

watch(currentMonthIndex, () => {
fetchComparisonData()
fetchCouldSaving()
})
// 소비 비교 데이터를 API에서 가져와 차트에 반영
const fetchComparisonData = async () => {
const cntYear = 2024; // 고정된 연도 값
const cntMonth = currentMonthIndex.value + 1; // currentMonthIndex는 0부터 시작하므로 1을 더함
try {
  const tempCategory = mapColumnToKeyword2(category.value); // category의 매핑된 값을 가져옴
  const encodedCategory = encodeURIComponent(tempCategory); // 카테고리를 URL 인코딩
  const response = await axios.get(`http://localhost:8080/outcome/compare/${cntYear}/${cntMonth}/${encodedCategory}`);
  
  const data = response.data.response.data;
  userSpending.value = data.mySum;
  averageSpending.value = data.averageSum;
  console.log(userSpending.value, averageSpending.value);
  
  createComparisonChart(); // 데이터를 받아온 후 차트 생성
} catch (error) {
  console.error('Error fetching comparison data:', error);
}
};

// 6개월 절약 시뮬레이션 데이터 가져오기
const fetchCouldSaving = async () => {
const cntYear = 2024; // 고정된 연도 값
const cntMonth = currentMonthIndex.value + 1; // currentMonthIndex는 0부터 시작하므로 1을 더함
try {
  const response = await axios.get(`http://localhost:8080/outcome/review/sum/${cntYear}/${cntMonth}`);
  const data = response.data.response.data;
  couldsaving.value = data.possibleSaveAmount;
} catch (error) {
  console.error('Error fetching couldSave data:', error);
}
};

const fetchSimulationData = async () => {
  const cntYear = 2024; // 고정된 연도 값
  const cntMonth = 10; // 10월로 설정
  
    const response = await axios.get(`http://localhost:8080/outcome/simulation/${cntYear}/${cntMonth}`);
    const data = response.data.response.data;

    // 데이터가 정상적으로 들어오는지 확인하는 로그
    console.log(data);

    // 불러온 데이터의 months, saveAmount, possibleSaveAmount 사용
    const months = data.months;
    const saveAmount = data.saveAmount;
    const possibleSaveAmount = data.possibleSaveAmount;
};

// 막대 그래프 생성
const createComparisonChart = () => {
  const ctx1 = document.getElementById('myChart').getContext('2d')

  if (myChart) myChart.destroy() // 이전 차트 삭제

  // 카테고리 비교 차트
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
          borderRadius: 10,
          barThickness: 50,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return value.toLocaleString() + '원' // y축에 '원' 추가
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false, // 범례 비활성화
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.raw.toLocaleString() + '원' // 툴팁에 '원' 추가
            },
          },
        },
      },
    },
  })
}

// 페이지 로드 시 데이터 가져오기
onMounted(() => {
  fetchComparisonData(), // 초기 로드 시 데이터 가져오기
  fetchCouldSaving()
})
</script>

<style scoped>
* {
  font-size: 20px;
}
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
  width: 800px;
  height: 400px;
  margin: 0 auto;
  display: block;
}
</style>