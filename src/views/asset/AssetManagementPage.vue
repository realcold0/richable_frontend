<!-- RC-P-09 : 자산 항목 관리 페이지 -->
<template>
  <div>
    <div class="tab-bar">
      <ul class="nav nav-tabs">
        <li class="nav-item nav-link" @click="selectedTab = 'tab1'" :class="{ active: selectedTab === 'tab1' }">
          <a>금융 자산 현황</a>
        </li>
        <li class="nav-item nav-link" @click="selectedTab = 'tab2'" :class="{ active: selectedTab === 'tab2' }">
          <a>현물 자산 포함</a>
        </li>
        <div class="tooltip-box">
          <button class="tool-btn" ref="tooltipButton" type="button" data-bs-toggle="tooltip" data-bs-placement="left"
            :title="tooltipMessage">
            <font-awesome-icon icon="circle-question" style="font-size: 25px;" />
          </button>
        </div>
      </ul>
    </div>

    <div class="tab-content">
      <div class="tab-page" v-if="selectedTab === 'tab1'">
        <div class="total-asset">
          <div class="asset-title">김리치님의 총 금융 자산 현황 😎</div>
          <div class="asset-amount">12,100,000원</div>
        </div>
        <div class="asset-list">
          <div class="list-title">금융 자산 목록 <font-awesome-icon icon="square-plus" style="color: #C30044;"
              @click="openCreateModal" /></div>

          <div class="list-box">
            <div class="asset-item" @click="openCheckModal('bank')">
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 18px;">예/적금</div>
              </div>
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 24px; color: #FF0062;">11,000,000</div>
                <div style="font-weight: bold; font-size: 18px; color: #8A8AA8; margin-left: 4px;"> 원</div>
              </div>
              <div
                style="display: flex; justify-content: center; align-items: center; font-size: 60px; margin-top:8px;">
                <font-awesome-icon icon="piggy-bank" />
              </div>
            </div>
            <div class="asset-item" @click="openCheckModal('stock')">
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 18px;">주식</div>
              </div>
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 24px; color: #FF0062;">11,000,000</div>
                <div style="font-weight: bold; font-size: 18px; color: #8A8AA8; margin-left: 4px;"> 원</div>
              </div>
              <div
                style="display: flex; justify-content: center; align-items: center; font-size: 60px; margin-top:8px;">
                <font-awesome-icon icon="chart-line" />
              </div>
            </div>
            <div class="asset-item" @click="openCheckModal('bond')">
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 18px;">채권</div>
              </div>
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 24px; color: #FF0062;">11,000,000</div>
                <div style="font-weight: bold; font-size: 18px; color: #8A8AA8; margin-left: 4px;"> 원</div>
              </div>
              <div
                style="display: flex; justify-content: center; align-items: center; font-size: 60px; margin-top:8px;">
                <font-awesome-icon icon="money-check-dollar" />
              </div>
            </div>
            <div class="asset-item" @click="openCheckModal('coin')">
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 18px;">코인</div>
              </div>
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 24px; color: #FF0062;">11,000,000</div>
                <div style="font-weight: bold; font-size: 18px; color: #8A8AA8; margin-left: 4px;"> 원</div>
              </div>
              <div
                style="display: flex; justify-content: center; align-items: center; font-size: 60px; margin-top:8px;">
                <font-awesome-icon icon="fa-brands fa-bitcoin" />
              </div>
            </div>
          </div>
        </div>
        <div class="asset-chart">
          <div class="list-title">총 금융 자산 분포</div>
          <div class="chart-box">
            <canvas ref="pieChart"></canvas>
          </div>
        </div>
      </div>


      <div class="tab-page" v-if="selectedTab === 'tab2'">
        <div class="total-asset">
          <div class="asset-title">김리치님의 총 현물 자산 현황 😎</div>
          <div class="asset-amount">25,100,000원</div>
        </div>
        <div class="asset-list">
    <div class="list-title">
      현물 자산 목록 
      <font-awesome-icon icon="square-plus" style="color: #C30044;" @click="openCreateModal2" />
    </div>
    
    <!-- Carousel for Tangible Assets -->
    <div class="list-box">

      <button class="control-btn" @click="prevSlide" :disabled="currentSlide === 0">
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>
        <div class="carousel-track">

          <div v-for="(asset, index) in paginatedAssets" :key="index" class="asset-item" >
            <div style="display: flex; flex-direction: row; justify-content: center;">
              <div class="asset-category">{{ asset.category }}</div>
              <div style="color:#C30044; font-size: 16px; margin-left: 4px;" @click="openEditModal2(asset)">
                <font-awesome-icon icon="pen-to-square" />
              </div>
            </div>
            
            <div class="asset-name">{{ asset.name }}</div>
            <div class="asset-price">
              <span class="price">{{ formatCurrency(asset.price) }}</span>
              <span class="currency">원</span>
            </div>
            <div class="asset-icon">
              <font-awesome-icon  :icon="getIcon(asset.category)" />
            </div>
          </div>
        </div>

          <button class="control-btn" @click="nextSlide" :disabled="currentSlide === maxSlide - 1">
            <font-awesome-icon :icon="['fas', 'chevron-right']" />
          </button>

      </div>


          <div class="asset-chart">
            <div class="list-title">총 현물 자산 분포</div>
            <div class="chart-box">
              <canvas ref="pieChart2"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AssetCreateModal ref="createModal" />
    <AssetUpdateModal ref="editModal" />
    <TangibleAssetCreateModal ref="createModal2" @create-asset="handleCreateAsset" />
    <TangibleAssetUpdateModal ref="editModal2" @update-asset="handleUpdateAsset" @delete-asset="handleDeleteAsset" />
    <AssetCheckModal   :selected-asset-type="selectedAssetType" 
      :bank-data-list="bankDataList" 
      :bond-data-list="bondDataList" 
      :coin-data-list="coinDataList" 
      :stock-data-list="stockDataList" ref="checkModal"/>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, nextTick, computed } from 'vue';
import { Tooltip as BootstrapTooltip } from 'bootstrap';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
import AssetCreateModal from '../../components/modal/asset/AssetCreateModal.vue';
import AssetUpdateModal from '../../components/modal/asset/AssetUpdateModal.vue';
import AssetCheckModal from '../../components/modal/asset/AssetCheckModal.vue';
import TangibleAssetCreateModal from '../../components/modal/asset/TangibleAssetCreateModal.vue';
import TangibleAssetUpdateModal from '../../components/modal/asset/TangibleAssetUpdateModal.vue';

// Chart.js에 필요한 컴포넌트(컨트롤러, 요소, 플러그인) 등록
Chart.register(PieController, ArcElement, Tooltip, Legend);

// 1. 데이터 정의
const selectedTab = ref('tab1'); // 현재 선택된 탭
const tooltipButton = ref(null); // 툴팁 버튼
const tooltipInstance = ref(null); // 툴팁 인스턴스
const tooltipMessage = ref('금융 자산은 [예/적금], [주식], [채권], [코인], [현금]을 포함합니다.');

// 현재 페이지 인덱스와 페이지당 항목 수
const currentSlide = ref(0);
const itemsPerPage = 4; 

// 자산 데이터
const selectedAssetType = ref('bank');
const bankDataList = ref([
  { orgCode: '국민은행', accountNum: 93800123456, prodCategory: '예금', balanceAmt: 1000000 },
  { orgCode: '신한은행', accountNum: 12345678910, prodCategory: '적금', balanceAmt: 1500000 },
  { orgCode: '하나은행', accountNum: 56789012345, prodCategory: '예금', balanceAmt: 2000000 }
]);

const bondDataList = ref([
  { name: '국고채권 01500-5003(20-2)', cnt: 2, price: 7000 },
  { name: '국고채권 01200-4003(18-3)', cnt: 3, price: 8500 },
  { name: '국고채권 01300-5003(19-2)', cnt: 5, price: 9200 }
]);

const coinDataList = ref([
  { currency: 'BTC', balance: 0.5, avgBuyPrice: 45000000 },
  { currency: 'ETH', balance: 2.0, avgBuyPrice: 1500000 },
  { currency: 'XRP', balance: 5000.0, avgBuyPrice: 1000 }
]);

const stockDataList = ref([
  { prdtName: '삼성전자', hldgQty: 10, avgBuyPrice: 80000 },
  { prdtName: 'LG화학', hldgQty: 5, avgBuyPrice: 750000 },
  { prdtName: '카카오', hldgQty: 15, avgBuyPrice: 110000 }
]);

const tangibleAssets = ref([
  { id: 1, category: '전자기기', name: '아이폰', price: 1200000 },
  { id: 2, category: '명품', name: '구찌 가방', price: 3000000 },
  { id: 3, category: '브랜드', name: '나이키 신발', price: 200000 },
  { id: 4, category: '기타', name: '기타 자산', price: 500000 },
  { id: 5, category: '전자기기', name: '맥북', price: 2000000 },
  { id: 6, category: '명품', name: '프라다 가방', price: 3500000 },
  { id: 7, category: '브랜드', name: '아디다스 신발', price: 150000 },
  { id: 8, category: '기타', name: '기타 자산 2', price: 600000 }
]);

// 2. 계산된 속성 정의
const latestAssets = computed(() => tangibleAssets.value.slice().reverse()); // 최신순 정렬

// 현재 페이지에 보여줄 항목 계산
const paginatedAssets = computed(() => {
  const start = currentSlide.value * itemsPerPage;
  const end = start + itemsPerPage;
  return latestAssets.value.slice(start, end);
});

// 총 슬라이드 개수 계산
const maxSlide = computed(() => Math.ceil(tangibleAssets.value.length / itemsPerPage));

// 금액 포맷 함수
const formatCurrency = (amount) => {
  return amount.toLocaleString('ko-KR');
};

// 카테고리에 따른 아이콘 매핑
const getIcon = (category) => {
  switch (category) {
    case '자동차': return 'car';
    case '전자기기': return 'desktop';
    case '명품': return 'fa-gem';
    case '브랜드': return 'tags';
    case '기타': return 'question-circle';
    default: return 'question-circle';
  }
};

// 3. 차트 렌더링 함수 정의
const pieChart = ref(null);
const pieChart2 = ref(null);
let chartInstance = null;
let chartInstance2 = null;

// 파이 차트 렌더링 (금융 자산)
const renderPieChart = async () => {
  await nextTick();
  if (chartInstance) chartInstance.destroy();
  
  chartInstance = new Chart(pieChart.value, {
    type: 'doughnut',
    data: {
      labels: ['예/적금', '주식', '채권', '코인'],
      datasets: [
        { data: [25, 35, 20, 20], backgroundColor: ['#C30044', '#FF0062', '#DA0052', '#FFF2F6'] },
      ],
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
            font: { size: 14, weight: 'bold' },
          },
        },
      },
      layout: { padding: { top: 10, bottom: 10 } },
    },
  });
};

// 파이 차트 렌더링 (현물 자산)
const renderPieChart2 = async () => {
  await nextTick();
  if (chartInstance2) chartInstance2.destroy();
  
  chartInstance2 = new Chart(pieChart2.value, {
    type: 'doughnut',
    data: {
      labels: ['자동차', '전자기기', '브랜드', '명품', '기타'],
      datasets: [
        { data: [45, 15, 20, 10, 10], backgroundColor: ['#C30044', '#FF0062', '#DA0052', '#FFF2F6', '#DA0052'] },
      ],
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
            font: { size: 14, weight: 'bold' },
          },
        },
      },
      layout: { padding: { top: 10, bottom: 10 } },
    },
  });
};

// 4. 이벤트 핸들러 정의
const prevSlide = () => {
  if (currentSlide.value > 0) currentSlide.value--;
};

const nextSlide = () => {
  if (currentSlide.value < maxSlide.value - 1) currentSlide.value++;
};

// 툴팁 업데이트
const updateTooltipMessage = async () => {
  tooltipMessage.value = selectedTab.value === 'tab1' 
    ? '금융 자산은 [예/적금], [주식], [채권], [코인], [현금]을 포함합니다.' 
    : '현물 자산은 [자동차], [전자기기], [브랜드], [명품], [기타]를 포함합니다.';
  
  if (tooltipInstance.value) tooltipInstance.value.dispose();
  
  tooltipButton.value.setAttribute('title', tooltipMessage.value);
  tooltipInstance.value = new BootstrapTooltip(tooltipButton.value);
};

// 탭 변경 시 차트 렌더링
watch(selectedTab, (newTab) => {
  if (newTab === 'tab1') renderPieChart();
  else if (newTab === 'tab2') renderPieChart2();
});

// 모달 처리
const createModal = ref(null);
const editModal = ref(null);
const editModal2 = ref(null);
const createModal2 = ref(null);
const checkModal = ref(null);

const openCreateModal = () => createModal.value && createModal.value.show();
const openCreateModal2 = () => createModal2.value && createModal2.value.show();
const openEditModal = () => editModal.value && editModal.value.show();
const openEditModal2 = (asset) => editModal2.value && editModal2.value.show(asset);

// 모달 열기 함수 (자산 타입에 따라)
const openCheckModal = (assetType) => {
  if (checkModal.value) {
    selectedAssetType.value = assetType;
    checkModal.value.show(assetType);
  }
};

// 자산 수정 처리
const handleUpdateAsset = (updatedAsset) => {
  const index = tangibleAssets.value.findIndex(asset => asset.id === updatedAsset.id);
  if (index !== -1) tangibleAssets.value[index] = { ...updatedAsset };
};

// 자산 삭제 처리
const handleDeleteAsset = (deletedAsset) => {
  tangibleAssets.value = tangibleAssets.value.filter(asset => asset.id !== deletedAsset.id);
};

// 5. 초기 설정
onMounted(() => {
  updateTooltipMessage();
  renderPieChart(); // 초기 마운트 시 '금융 자산 현황' 차트 렌더링
});
</script>


<style scoped>

.tab-bar {
    width : 1704px;
    margin-left : 80px;
    margin-top : 80px;
    position: relative;
}

.nav-tabs {
    border-bottom : 2px solid #414158;
}

.nav-item {
    color : #CCCCD6;
    width: 200px;
    height: 57px;
    text-align: center;
    font-size: 18px;
    line-height: 39px;
    border : 1px solid #CCCCD6;
    border-bottom: 1px solid #414158;
}

.nav-item.active {
    background-color: #414158;
    color : white;
    border-bottom: 2px solid #414158;
}

.tooltip-inner {
    white-space: nowrap !important;
}

.tooltip-box {
    position: absolute;
    right: 0;
    top: 0;
}

.tool-btn {
    border: none;
    background-color: white;
    padding-top : 4px;
    margin-top : 12px;
}

.tab-content {
    margin-top: 80px;
    margin-left: 80px;
}

.tab-page {
    
}

.total-asset {
    background-color: #F9F9F9;
    max-width: 1704px;
    height: 150px;
    border-radius: 20px;
    border: 1px solid #F8F8F8;
    text-align: center;
}
.asset-title {
    font-size: 20px;
    margin-top: 36px;
    margin-bottom: 10px;
}

.asset-amount {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 36.5px;
}

.asset-list {
    margin-top: 117px;
}

.list-title {
    margin: 24px auto;
    font-size: 20px;
    font-weight: bold;
}

.list-box {
    display: flex;
    background-color: #FFF2F6;
    border-radius: 10px;
    max-width: 1704px;
    height: 244px;
    margin-bottom: 44px;
    justify-content: space-between;
    align-items: center;
    padding-left: 27px; /* 왼쪽 여백 */
    padding-right: 27px; /* 오른쪽 여백 */
}

.asset-item {
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 190px;
  background-color: white;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));
  border-radius: 20px;
  padding-top: 28px;
}

.chart-box {
    max-width: 1704px;
    height: 620px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top : 100px;
    padding-bottom: 42.5px;
}

.asset-chart {
    position: relative;
    margin-top: 44px;
    padding-bottom: 80px;
}

.list-box {
  position: relative;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease;
}

.asset-item {
  width: 300px;
  height: 200px;
  background-color: white;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));
  border-radius: 20px;
  padding: 20px;
  margin-right: 20px;
  text-align: center;
}

.asset-category {
  font-weight: bold;
  font-size: 18px;
}

.asset-name {
  font-size: 18px;
  margin-top: 0px;
}

.asset-price {
  margin-top: 0px;
  font-weight: bold;
  font-size: 24px;
  color: #FF0062;
}

.price {
  margin-right: 4px;
}

.currency {
  font-size: 18px;
  color: #8A8AA8;
}

.asset-icon {
  font-size: 50px;
  margin-top: 0px;
}

.carousel-controls {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.control-btn {
  background-color: #C30044;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.control-btn:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.control-btn:hover:not(:disabled) {
  background-color: #ff0055;
}

</style>

<style>
body {
    font-family: 'Pretendard';
}
.tooltip-inner {
    font-family: 'Pretendard';
    max-width: 400px !important;
    white-space: normal !important;
    font-size: 12px;
}
</style>
