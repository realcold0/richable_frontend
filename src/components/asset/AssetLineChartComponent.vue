<template>
  
  <div class="asset-analysis-container">
    <div class="asset-analysis-nav">
      <div class="asset-analysis-title">
        나의 자산 한 눈에 보기
      </div>
    </div>

    <div class="graph-container-wrapper">
      <div class="graph-container">
        <div class="graph-title">저축률</div>
        <div class="graph-sum">{{ returnIncomeSum }}%</div>
        <canvas class="graph" ref="lineChart3"></canvas>
      </div>

      <div class="graph-container">
        <div class="graph-title">주식 수익률</div>
        <div class="graph-sum">{{ returnStockSum }}%</div>
        <canvas class="graph" ref="lineChart4"></canvas>
      </div>

      <div class="graph-container">
        <div class="graph-title">코인 수익률</div>
        <div class="graph-sum">{{ returnCoinSum }}%</div>
        <canvas class="graph" ref="lineChart1"></canvas>
      </div>

      <div class="graph-container">
        <div class="graph-title">채권 수익률</div>
        <div class="graph-sum">{{ returnBondSum }}%</div>
        <canvas class="graph" ref="lineChart2"></canvas>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  Chart,
  LineController,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js'
import instance from '@/AxiosInstance.js'

// 불필요한 ArcElement와 Legend를 제거하고 필요한 요소만 등록합니다.
Chart.register(
  CategoryScale,
  LinearScale,
  LineController,
  PointElement,
  LineElement,
  Tooltip
)


const returnBond = ref([])
const returnCoin = ref([])
const returnStock = ref([])
const returnIncome = ref([])
const returnBondSum = ref(0)
const returnCoinSum = ref(0)
const returnStockSum = ref(0)
const returnIncomeSum = ref(0)

const lineChart1 = ref(null)
const lineChart2 = ref(null)
const lineChart3 = ref(null)
const lineChart4 = ref(null)

let lineChartInstance1 = null
let lineChartInstance2 = null
let lineChartInstance3 = null
let lineChartInstance4 = null

// 데이터 처리 함수
const processSums = (returnBond, returnCoin, returnStock, returnIncome) => {
  returnBondSum.value = returnBond.find(item => item.month === 1)?.earningRate || 0
  returnCoinSum.value = returnCoin.find(item => item.month === 1)?.earningRate || 0
  returnStockSum.value = returnStock.find(item => item.month === 1)?.earningRate || 0
  returnIncomeSum.value = (returnIncome.find(item => item.month === "2024-10")?.balalnceRate || 0).toFixed(1)
}

const fetchData = async () => {
  try {
    const [incomeReturnData, bondReturnData, coinReturnData, stockReturnData] = await Promise.all([
      instance.get('/finance/return/income').catch((err) => ({ error: true, err })),
      instance.get('/finance/return/bond').catch((err) => ({ error: true, err })),
      instance.get('/finance/return/coin').catch((err) => ({ error: true, err })),
      instance.get('/finance/return/stock').catch((err) => ({ error: true, err }))
    ])

    // 값이 제대로 반환되지 않았을 경우 빈 배열로 처리
    returnIncome.value = incomeReturnData?.data?.response?.data || []
    returnCoin.value = coinReturnData?.data?.response?.data || []
    returnStock.value = stockReturnData?.data?.response?.data || []
    returnBond.value = bondReturnData?.data?.response?.data || []

    // returnBond가 배열인지 확인하고 처리
    processSums(
      Array.isArray(returnBond.value) ? returnBond.value : [],
      Array.isArray(returnCoin.value) ? returnCoin.value : [],
      Array.isArray(returnStock.value) ? returnStock.value : [],
      Array.isArray(returnIncome.value) ? returnIncome.value : []
    )

    const bondLabels = Array.isArray(returnBond.value)
      ? returnBond.value.map(item => mapMonthToLabel(item.month))
      : []
    const coinLabels = Array.isArray(returnCoin.value)
      ? returnCoin.value.map(item => mapMonthToLabel(item.month))
      : []
    const incomeLabels = Array.isArray(returnIncome.value)
      ? returnIncome.value.map(item => mapMonthToLabel(item.month)).reverse()
      : []
    const stockLabels = Array.isArray(returnStock.value)
      ? returnStock.value.map(item => mapMonthToLabel(item.month))
      : []

    renderAllLineCharts(
      bondLabels, bondLabels.length > 0 ? returnBond.value.map(item => item.earningRate) : [],
      coinLabels, coinLabels.length > 0 ? returnCoin.value.map(item => item.earningRate) : [],
      incomeLabels, incomeLabels.length > 0 ? returnIncome.value.map(item => item.balalnceRate) : [],
      stockLabels, stockLabels.length > 0 ? returnStock.value.map(item => item.earningRate) : []
    )
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error)
  }
}


const mapMonthToLabel = (month) => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // 현재 월 (1월은 1, 2월은 2...)

  // 문자열인 경우 (YYYY-MM 형식)
  if (typeof month === 'string') {
    const [year, monthString] = month.split("-");
    const targetYear = parseInt(year, 10);
    const targetMonth = parseInt(monthString, 10);

    // 현재 연도와 비교
    const currentYear = today.getFullYear();

    if (currentYear === targetYear && targetMonth === currentMonth) {
      return '이번달';
    }else {
      return `${targetMonth}월`;
    }
  }

  // 숫자 형식인 경우 (1 ~ 12)
  if (typeof month === 'number') {


    const today = new Date()
  const currentMonth = today.getMonth() // 현재 월 (0부터 시작, 1월은 0)

  // 현재 달에서 month 값을 빼서 라벨을 결정
  const calculatedMonth = currentMonth + 2 - month // month 값이 1부터 시작하므로 +1
  const targetMonth = calculatedMonth > 0 ? calculatedMonth : 12 + calculatedMonth

  // month가 1일 경우 "이번달", 2일 경우 "9월" 이런 식으로 처리
  if (month === 1 || month==="2024-10") {
    return '이번달'
  }

  return `${targetMonth}월` // 나머지 경우에 대한 월 반환
  }

  return ''; // 해당되지 않을 경우 빈 문자열 반환
};

// 모든 라인 차트 렌더링 함수
const renderAllLineCharts = (bondLabels, bondData, coinLabels, coinData, incomeLabels, incomeData, stockLabels, stockData) => {
  renderLineChart(lineChart1, lineChartInstance1, coinLabels, coinData)
  renderLineChart(lineChart2, lineChartInstance2, bondLabels, bondData)
  renderLineChart(lineChart3, lineChartInstance3, incomeLabels, incomeData.reverse()) // income 데이터 역순으로 받기
  renderLineChart(lineChart4, lineChartInstance4, stockLabels, stockData)
}

// 라인 차트 렌더링 함수 (라벨 정렬 수정)
const renderLineChart = (chartRef, chartInstance, labels, data, isCurrency = false) => {
  if (!chartRef.value) return

  if (chartInstance) chartInstance.destroy()

  // 데이터를 오늘을 기준으로 역순에서 정상 순서로 변경
  const reversedLabels = labels.reverse()
  const reversedData = data.reverse()

  // 데이터의 최소값과 최대값을 계산하여 Y축 범위를 설정
  const minValue = Math.min(...reversedData)
  const maxValue = Math.max(...reversedData)

  chartInstance = new Chart(chartRef.value, {
    type: 'line',
    data: {
      labels: reversedLabels, // 정렬된 라벨 사용
      datasets: [
        {
          data: data, // 정렬된 데이터 사용
          backgroundColor: 'rgba(250, 158, 190, 1)',
          borderColor: 'rgba(250, 158, 190, 1)',
          pointRadius: 3,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: false,
          suggestedMin: minValue - 10,
          suggestedMax: maxValue + 10,
          ticks: {
            callback: function (value) {
              if (isCurrency) {
                return value.toLocaleString() + '%';
              } else {
                return value + '%'
              }
            }
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      }
    }
  })
}



// 컴포넌트가 마운트될 때 데이터 가져오기
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.asset-analysis-title{
    font-size: 22px;
  font-weight: 500;
  line-height: 150%;
  color: var(--black-default, #19181d);
  letter-spacing: -0.4px;
  text-align: center;
  margin-top: 36px;
}

.asset-analysis-nav {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.asset-analysis-container {
  background-color: #fff;
  padding: 50px;
  border: 1px solid #e4ebf0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.graph-container-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  width: 946px;
  height: 930px;
  padding: 30px;
}

.graph-container {
  width: 500px;
  height: 350px;
  font-family: pretendard;
}

.graph-title {
  font-size: 16px;
  font-weight: 400;
}

.graph-sum {
  font-size: 18px;
  font-weight: 700;
  line-height: 40px;
}

.graph-container canvas {
  width: 100%;
  height: 100%;
}
</style>
