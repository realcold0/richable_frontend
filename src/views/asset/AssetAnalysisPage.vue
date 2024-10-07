<template>
  <div>
    <div class="content-container">
      <div class="total-asset">
        <div class="asset-title">김리치님의 총 자산 현황 😎</div>
        <div class="asset-amount">{{ formatCurrency(displayAsset) }}원</div>
      </div>

      <!-- 나의 단계 -->
      <div class="asset-level-container">
        <div class="asset-level-title">김리치님은 <strong>씨앗 단계</strong>예요</div>
        <div class="asset-level-sub">0원 ~ 1천만원 이하의 유저입니다.</div>
        <div class="asset-level-img"></div>
      </div>

      <!-- 자산 분석 섹션 -->
      <div class="asset-analysis-container">
        <div class="asset-analysis-nav">
          <div class="asset-analysis-title">나의 자산</div>
          <div class="asset-analysis-btn">
            <!-- 체크박스 클릭 이벤트를 통해 값을 업데이트 -->
            <input type="checkbox" v-model="includePhysicalAssets" @change="resetCharts">
            <p>현물자산 포함</p>
          </div>
        </div>

        <!-- 자산 분석 내용 -->
        <div class="asset-analysis-content">
          <div class="asset-analysis-content-container1">
            <div class="graph-container2">
              <p class="graph-title2">{{ highestAsset.prodCategory }} 자산 비중이 <br /> 제일 높아요</p>
              <div class="asset-analysis-graph">
                <canvas ref="pieChart"></canvas>
              </div>
            </div>
            <div class="asset-analysis-table-wrapper">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>총 상품자산</th>
                    <th>{{ formatCurrency(displayAsset) }}원</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(asset, index) in paginatedAssets" :key="index" @click="toggleDetails(asset)" class="clickable-row">
                    <td>{{ asset.prodCategory }}</td>
                    <td>{{ formatCurrency(asset.amount) }}원</td>
                  </tr>
                </tbody>
              </table>
              <!-- Pagination -->
              <nav>
                <ul class="pagination justify-content-center">
                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <a class="page-link" href="#" @click.prevent="prevPage">Previous</a>
                  </li>
                  <li class="page-item disabled">
                    <a class="page-link" href="#">Page {{ currentPage }} of {{ totalPages }}</a>
                  </li>
                  <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          <!-- 자산 변화 그래프 -->
          <div class="asset-analysis-content-container2">
            <p>총자산이 지난달보다 <br /> 
              <strong>{{ assetDifferenceMessage }}</strong>
            </p>
            <div class="asset-analysis-graph-container2">
              <canvas ref="barChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <div class="asset-analysis-container">
        <div class="asset-analysis-nav">
          <div class="asset-analysis-title"  style="font-size: 20px;font-weight: 700;line-height: 150%; letter-spacing: -0.4px;">나의 자산 한 눈에 보기</div>
        </div>

        <div class="graph-container-wrapper">

          <div class="graph-container">
            <div class="graph-title">저축량</div>
            <div class="graph-sum">{{returnIncomeSum}}원</div>
            <canvas class="graph" ref="lineChart3"></canvas>
          </div>

          <div class="graph-container">
            <div class="graph-title">주식 수익률</div>
            <div class="graph-sum">{{returnStockSum}}%</div>
            <canvas class="graph" ref="lineChart4"></canvas>
          </div>

          <div class="graph-container">
            <div class="graph-title">코인 수익률</div>
            <div class="graph-sum">{{returnCoinSum}}%</div>
            <canvas class="graph" ref="lineChart1"></canvas>
          </div>

          <div class="graph-container">
            <div class="graph-title">채권 수익률</div>
            <div class="graph-sum">{{returnBondSum}}%</div>
            <canvas class="graph" ref="lineChart2"></canvas>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import { Chart, PieController, ArcElement, Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale, LineController, PointElement, LineElement } from 'chart.js';
import instance from '@/axiosInstance.js';
// import instance from '@/axiosInstance'; 


// Register Chart.js components
Chart.register(PieController, ArcElement, Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale, LineController, PointElement, LineElement);

// 상태 관리
const includePhysicalAssets = ref(false); 
const finAsset = ref(0);
const totalAsset = ref(0); 
const finAssetTotal = ref([]);
const electronicSpot = ref({});
const otherSpot = ref({});
const carSpot = ref({});
const brandSpot = ref({});
const paginatedAssets = ref([]);
const changedFin = ref([]);
const changedSpot = ref([]);
const returnBond = ref([]);
const returnCoin = ref([]);
const returnStock = ref([]);
const returnIncome = ref([]);
const returnBondSum = ref(0);
const returnCoinSum = ref(0);
const returnStockSum = ref(0);
const returnIncomeSum = ref(0);
const assetDifferenceMessage = ref('');

const currentPage = ref(1);
const itemsPerPage = ref(6);
const pieChart = ref(null);
const barChart = ref(null);
const lineChart1 = ref(null);
const lineChart2 = ref(null);
const lineChart3 = ref(null);
const lineChart4 = ref(null);

let chartInstance = null;
let barChartInstance = null;
let lineChartInstance1 = null;
let lineChartInstance2 = null;
let lineChartInstance3 = null;
let lineChartInstance4 = null;

const displayAsset = computed(() => includePhysicalAssets.value ? totalAsset.value : finAsset.value);
const displayedSixMonth = computed(() => includePhysicalAssets.value ? changedSpot.value : changedFin.value);

// 표시할 자산 목록과 합계 계산
const displayedAsset = computed(() => {
  const baseAmount = finAsset.value;
  const physicalAssetsAmount = includePhysicalAssets.value
    ? [electronicSpot.value, otherSpot.value].reduce((sum, item) => sum + (item?.amount || 0), 0)
    : 0;
  return baseAmount + physicalAssetsAmount;
});

const categoryMapping = {
  car: '자동차',
  elec: '전자기기',
  brand: '브랜드',
  luxury: '명품',
  etc: '기타'
};

// 가장 큰 자산 항목 계산
const highestAsset = computed(() => {
  if (displayedAssetList.value.length > 0) {
    const highest = displayedAssetList.value.reduce((prev, current) => (prev.amount > current.amount ? prev : current));

    // 매핑된 카테고리로 변환하여 반환
    return {
      prodCategory: categoryMapping[highest.prodCategory] || highest.prodCategory, // 매핑되지 않은 카테고리는 원래 값 유지
      amount: highest.amount
    };
  }

  // 기본 값 반환
  return { prodCategory: '자산', amount: 0 }; 
});


// 금액 포맷 함수
const formatCurrency = (amount) => {
  return amount.toLocaleString('ko-KR');
};

const processSums = (returnBond, returnCoin, returnStock, returnIncome) => {
  // month가 1인 값을 찾아서 합계에 저장
  returnBondSum.value = returnBond.find(item => item.month === 1)?.earningRate || 0;
  returnCoinSum.value = returnCoin.find(item => item.month === 1)?.earningRate || 0;
  returnStockSum.value = returnStock.find(item => item.month === 1)?.earningRate || 0;
  returnIncomeSum.value = returnIncome.find(item => item.month === 1)?.balance || 0; // 예시로 balance 사용
};

const fetchData = async () => {
  try {

    const [
      finAssetRes,
      totalAssetRes,
      finAssetTotalRes,
      changedFinRes,
      changedSpotRes,
      electronicSpotRes,
      otherSpotRes,
      carSpotRes,
      // luxSpotRes,
      brandSpotRes,
      returnIncomeRes,
      returnBondRes,
      returnCoinRes,
      returnStockRes
    ]  
    = await Promise.all([
      instance.get('/finance/fin/sum'),   // 절대 경로 대신 상대 경로 사용
      instance.get('/finance/total/sum'), 
      instance.get('/finance/fin'),       
      instance.get('/finance/changed/fin'),
      instance.get('/finance/changed/spot'),
      instance.get('/finance/spot/elec/sum'),
      instance.get('/finance/spot/etc/sum'),
      instance.get('/finance/spot/car/sum'),
      // instance.get('/finance/spot/luxury/sum'),
      instance.get('/finance/spot/brand/sum'),
      instance.get('/finance/return/income'),
      instance.get('/finance/return/bond'),
      instance.get('/finance/return/bond'),
      instance.get('/finance/return/stock')
    ]);   

    // 데이터 저장
    finAsset.value = finAssetRes?.data?.response?.data?.data?.amount || 0;  // finAsset 값 설정
    totalAsset.value = totalAssetRes?.data?.response?.data?.data?.amount || 0;  // totalAsset 값 설정
    finAssetTotal.value = finAssetTotalRes?.data?.response?.data?.data || [];  // 값이 없을 경우 빈 배열을 할당
    changedFin.value = changedFinRes.data.response.data;
    changedSpot.value = changedSpotRes.data.response.data;
    electronicSpot.value = electronicSpotRes?.data?.response?.data || {};
    otherSpot.value = otherSpotRes?.data?.response?.data || {};
    carSpot.value = carSpotRes?.data?.response?.data || {};
    brandSpot.value = brandSpotRes?.data?.response?.data || {};
    // luxSpot.value = luxSpotRes?.data?.response?.data || {};
    returnIncome.value = returnIncomeRes.data.response.data;
    returnCoin.value = returnCoinRes.data.response.data;
    returnStock.value = returnStockRes.data.response.data;
    returnBond.value = returnBondRes.data.response.data;

    console.log(finAsset.value);
    console.log(totalAsset.value);

    // 자산 변화 계산 함수 호출
    calculateAssetDifference();

    // 페이지네이션을 위한 자산 목록 슬라이스
    paginatedAssets.value = displayedAssetList.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value);

    // 차트 렌더링
    renderChart(pieChart, 'doughnut', displayedAssetList.value.map(item => item.prodCategory), displayedAssetList.value.map(item => item.amount));
    renderBarChart(displayedSixMonth.value.map(item => mapMonthToLabel(item.month)), displayedSixMonth.value.map(item => item.balance));

    processSums(returnBond.value, returnCoin.value, returnStock.value, returnIncome.value);

    const bondLabels = returnBond.value.map(item => mapMonthToLabel(item.month));
    const coinLabels = returnCoin.value.map(item => mapMonthToLabel(item.month));
    const incomeLabels = returnIncome.value.map(item => mapMonthToLabel(item.month));
    const stockLabels = returnStock.value.map(item => mapMonthToLabel(item.month));

    renderAllLineCharts(bondLabels, returnBond.value.map(item => item.earningRate), coinLabels, returnCoin.value.map(item => item.earningRate), incomeLabels, returnIncome.value.map(item => item.balance), stockLabels, returnStock.value.map(item => item.earningRate));


  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
  }
};

// 자산 변화 계산
const calculateAssetDifference = () => {
  const currentMonthBalance = displayedSixMonth.value[0]?.balance || 0;
  const lastMonthBalance = displayedSixMonth.value[1]?.balance || 0;
  const difference = currentMonthBalance - lastMonthBalance;

  assetDifferenceMessage.value = difference > 0
    ? `${Math.floor(difference / 10000)}만원 늘었어요 🥰`
    : difference < 0
      ? `${Math.floor(Math.abs(difference) / 10000)}만원 줄었어요 🥺`
      : '변화가 없어요';
};

const displayedAssetList = computed(() => {
  const assetList = includePhysicalAssets.value
    ? [
        ...(Array.isArray(finAssetTotal.value) ? finAssetTotal.value : []), 
        ...(electronicSpot.value ? [electronicSpot.value] : []), 
        ...(otherSpot.value ? [otherSpot.value] : []),
        ...(brandSpot.value ? [brandSpot.value] : []),
        ...(carSpot.value ? [carSpot.value] : [])
      ]
    : Array.isArray(finAssetTotal.value) ? finAssetTotal.value : [];
  
  // assetList가 빈 배열이 아닌지 확인
  if (assetList.length === 0) {
    console.error('displayedAssetList is empty:', assetList);
  }
  return assetList;
});

const renderAllLineCharts = async (bondLabels, bondData, coinLabels, coinData, incomeLabels, incomeData, stockLabels, stockData) => {
  await nextTick();
  renderLineChart(lineChart1, lineChartInstance1, coinLabels, coinData);
  renderLineChart(lineChart2, lineChartInstance2, bondLabels, bondData);
  renderLineChart(lineChart3, lineChartInstance3, incomeLabels, incomeData, true);  // 소득 수익률 차트는 원 단위로 표시
  renderLineChart(lineChart4, lineChartInstance4, stockLabels, stockData);
};

// 데이터의 month를 이번 달 기준으로 계산하는 함수
const mapMonthToLabel = (month) => {
  const today = new Date();
  const currentMonth = today.getMonth(); // 현재 월 (0부터 시작, 1월은 0)

  // 현재 달에서 month 값을 빼서 라벨을 결정
  const calculatedMonth = currentMonth +2 - month; // month 값이 1부터 시작하므로 +1
  const targetMonth = calculatedMonth > 0 ? calculatedMonth : 12 + calculatedMonth;

  // month가 1일 경우 "이번달", 2일 경우 "9월" 이런 식으로 처리
  if (month === 1) {
    return '이번달';
  }

  return `${targetMonth}월`;  // 나머지 경우에 대한 월 반환
};

// 차트 렌더링 함수
const renderBarChart = async (labels, data) => {
  await nextTick();
  if (!barChart.value) return;

  if (barChartInstance) barChartInstance.destroy();

  const reversedLabels = labels.reverse();
  const reversedData = data.reverse();

  barChartInstance = new Chart(barChart.value, {
    type: 'bar',
    data: {
      labels: reversedLabels,
      datasets: [{
        data: reversedData,
        backgroundColor: reversedLabels.map(label => label === '이번달' ? 'rgba(255,0,98,0.67)' : 'rgba(220,212,212,0.63)'),
        borderRadius: { topLeft: 10, topRight: 10 }, // 위쪽 두 꼭짓점만 둥글게 설정
        borderSkipped: 'bottom' // 아래쪽 모서리만 직각으로 유지
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: true } },
      scales: {
        y: { display: false }, 
        x: { grid: { display: false } }
      }
    }
  });
};




const renderChart = async (chartRef, chartType, labels, data) => {
  await nextTick();
  if (!chartRef.value) return;

  // 데이터가 비어 있거나 잘못된 경우 확인
  if (!labels || labels.length === 0 || !data || data.length === 0) {
    console.error('차트 렌더링에 필요한 데이터가 비어있습니다.');
    return;
  }

  // 기존 차트가 있으면 파괴
  if (chartInstance) chartInstance.destroy();

  // 차트 렌더링
  chartInstance = new Chart(chartRef.value.getContext('2d'), {
    type: chartType,
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#C30044', '#FF0062', '#DA0052', '#FFF2F6', '#FF99CC', '#FF6699']  // 파이 차트 색상
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } }
    }
  });
};


// 라인 차트 렌더링 함수 (라벨 정렬 수정)
const renderLineChart = (chartRef, chartInstance, labels, data, isCurrency = false) => {
  if (!chartRef.value) return;

  if (chartInstance) chartInstance.destroy();

  // 데이터를 오늘을 기준으로 역순에서 정상 순서로 변경
  const reversedLabels = labels.reverse();
  const reversedData = data.reverse();

  // 데이터의 최소값과 최대값을 계산하여 Y축 범위를 설정
  const minValue = Math.min(...reversedData);
  const maxValue = Math.max(...reversedData);

  chartInstance = new Chart(chartRef.value, {
    type: 'line',
    data: {
      labels: reversedLabels, // 정렬된 라벨 사용
      datasets: [{
        data: reversedData, // 정렬된 데이터 사용
        backgroundColor: 'rgba(250, 158, 190, 1)',
        borderColor: 'rgba(250, 158, 190, 1)',
        pointRadius: 3,
        fill: false,
      }]
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
                return value.toLocaleString() + '원';
              } else {
                return value + '%';
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
  });
};


const nextPage = () => {
  if (currentPage.value < Math.ceil(displayedAssetList.value.length / itemsPerPage.value)) {
    currentPage.value++;
    paginatedAssets.value = displayedAssetList.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value);
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    paginatedAssets.value = displayedAssetList.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value);
  }
};

// 차트 리셋
const resetCharts = () => {
  fetchData();
};

// 컴포넌트가 마운트될 때 데이터 가져오기
onMounted(() => {
  fetchData();
});
</script>


<style scoped>
* {
  /* text-align: center; */
  color: #19181d;
  font-family: 'Pretendard', sans-serif;
}

.content-container {
  margin: 80px;
}

.total-asset, .asset-analysis-container, .asset-level-container {
  max-width: 1704px;
  border-radius: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 40px;
}


.total-asset {
  background-color: #f9f9f9;
  height: 150px;
  border: 1px solid #f8f8f8;
}

.asset-title, .asset-analysis-title, .asset-level-title {
  font-size: 20px;
  font-weight: 500;
  line-height: 150%;
  color: var(--black-default, #19181D);
  letter-spacing: -0.4px;
  text-align: center;
  margin-top: 36px;
}

.asset-amount {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 36.5px;
  line-height: 150%;
  margin-top: 10px;
  letter-spacing: -0.48px;
}

.asset-level-container {
  background-color: #fff;
  padding: 30px;
  border: 2px solid #e4ebf0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.asset-level-sub {
  margin-top: 5px;
  font-size: 18px;
  color: var(--3, #414158);
  font-weight: 400;
  letter-spacing: -0.36px;
}

.asset-level-img {
  margin-top: 10px;
  background-image: url('@/assets/images/level-seed-rich.png');
  background-size: cover;
  width: 90px;
  height: 126px;
  padding: 20px;
}

.asset-analysis-container {
  background-color: #fff;
  padding: 50px;
  border: 2px solid #e4ebf0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.asset-analysis-nav {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.asset-analysis-btn {
  display: flex;
  align-items: center;
}

.asset-analysis-btn input {
  margin-right: 10px;
}

.asset-analysis-btn p {
  font-size: 16px;
  color: #333;
}

.asset-analysis-content{

  height: 930px;
  padding: 30px;
}

.asset-analysis-content-container1{
  border-radius: 10px;
  background-color: #f9f9f9;
  display: flex;
  padding : 10px 30px;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  width: 1000px;
  height : 400px;
}

.asset-analysis-content-container2{

  display : flex; 
  align-items: center;
  margin-top: 40px;
  width: 1000px;
  height : 412px;
  flex-direction: column;
   justify-content: center

}

.asset-analysis-graph-container2, .asset-analysis-graph-contanier1  {
  width: 470px;
  height: 370px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.asset-analysis-graph{
  height: 250px;
  display: flex;
  padding: 10px;
  align-items: center;
  gap: 10px;
}

.asset-analysis-table {
  /* flex: 1; */
  
  margin-left: 40px;
  width: 387px;
  padding: 20px 10px;

}

.asset-analysis-table table {
  width : 300px;
}

.asset-analysis-table th, .asset-analysis-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.asset-analysis-table th {
  font-weight: 600;
  background-color: #f9f9f9;
  color: #333;
}

.asset-analysis-table td {
  font-size: 16px;
  color: #555;
}

.graph-container-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  width: 946px;
}

.graph-container {
  width: 400px;
  height: 350px;
  font-family: pretendard;

}

.graph-container canvas {
  width: 100%;
  height: 100%;
}

.graph-title {
  color: 19181d;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
}

.graph-title2 {
  color: var(--black-default, #19181D);
    text-align: center;
    font-family: Pretendard;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 150%; /* 27px */
    letter-spacing: -0.36px;
}

.graph-sum {
  overflow: hidden;
  color: #0D171C;
  text-overflow: ellipsis;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 40px; /* 222.222% */
}

.asset-analysis-content2-title {
  color: var(--black-default, #19181D);
  font-size: 18px;
  font-weight: 500;
  line-height: 150%; /* 27px */
  letter-spacing: -0.36px;
}

.asset-analysis-content2-sub {
  margin-top: 10px;
  color: var(--2, #8A8AA8);
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.32px;
}

.graph-container2{
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .graph-container-wrapper {
    grid-template-columns: 1fr;
  }

  .content-container {
    margin: 20px;
  }
}
</style>