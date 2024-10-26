<!-- RC-P-09 : 자산 항목 관리 페이지 -->
<template>
  <div>
    <div class="tab-bar">
      <ul class="nav nav-tabs">
        <li
          class="nav-item nav-link"
          @click="selectedTab = 'tab1'"
          :class="{ active: selectedTab === 'tab1' }"
        >
          <a>금융 자산 현황</a>
        </li>
        <li
          class="nav-item nav-link"
          @click="selectedTab = 'tab2'"
          :class="{ active: selectedTab === 'tab2' }"
        >
          <a>현물 자산 포함</a>
        </li>
        <div class="tooltip-box">
          <button
            class="tool-btn"
            ref="tooltipButton"
            type="button"
            data-bs-toggle="tooltip"
            data-bs-placement="left"
            :title="tooltipMessage"
          >
            <font-awesome-icon icon="circle-question" style="font-size: 25px" />
          </button>
        </div>
      </ul>
    </div>

    <div class="tab-content">
      <div class="tab-page" v-if="selectedTab === 'tab1'">
        <TotalAssetDisplay 
          asset-type="금융"
          :amount="financeTotalAmount"
        />
        <FinancialAssetList
          :bank-amount="bankAssetAmount"
          :stock-amount="stockAssetAmount"
          :bond-amount="bondAssetAmount"
          :coin-amount="coinAssetAmount"
          @open-create="openCreateModal"
          @open-check="openCheckModal"
        />
        <AssetChart 
          asset-type="금융"
          :chart-data="[bankAssetAmount, stockAssetAmount, bondAssetAmount, coinAssetAmount]"
          :chart-labels="['예/적금', '주식', '채권', '코인']"
        />
      </div>

      <div class="tab-page" v-if="selectedTab === 'tab2'">
        <TotalAssetDisplay 
          asset-type="현물"
          :amount="spotTotalAmount"
        />
        <TangibleAssetList
          :paginated-assets="paginatedAssets"
          :current-slide="currentSlide"
          :max-slide="maxSlide"
          @open-create="openCreateModal2"
          @open-edit="openEditModal2"
          @prev-slide="prevSlide"
          @next-slide="nextSlide"
        />
        <AssetChart 
          asset-type="현물"
          :chart-data="[spotCarAmount, spotElecAmount, spotBrandAmount, spotLuxuryAmount, spotEtcAmount]"
          :chart-labels="['자동차', '전자기기', '브랜드', '명품', '기타']"
        />
      </div>
    </div>
    <AssetCreateModal ref="createModal" 
      @refresh-data="refreshData" />
    <AssetUpdateModal ref="editModal" />
    <TangibleAssetCreateModal ref="createModal2" @create-asset="handleCreateAsset" />
    <TangibleAssetUpdateModal
      ref="editModal2"
      @update-asset="handleUpdateAsset"
      @delete-asset="handleDeleteAsset"
    />
    <AssetCheckModal
      :selected-asset-type="selectedAssetType"
      :bank-data-list="bankDataList"
      :bond-data-list="bondDataList"
      :coin-data-list="coinDataList"
      :stock-data-list="stockDataList"
      @refresh-data="refreshData"  
      ref="checkModal"
    />
      
    <AssetUpdateModal
      ref="updateModal"
      @update-asset="handleAssetUpdate"
      @delete-asset="handleAssetDelete"
    />

  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import axiosInstance from '@/AxiosInstance'
import { Tooltip as BootstrapTooltip } from 'bootstrap'
import AssetCreateModal from '../../components/modal/asset/AssetCreateModal.vue'
import AssetUpdateModal from '../../components/modal/asset/AssetUpdateModal.vue'
import AssetCheckModal from '../../components/modal/asset/AssetCheckModal.vue'
import TangibleAssetCreateModal from '../../components/modal/asset/TangibleAssetCreateModal.vue'
import TangibleAssetUpdateModal from '../../components/modal/asset/TangibleAssetUpdateModal.vue'
import TotalAssetDisplay from '@/components/asset/TotalAssetDisplay.vue'
import FinancialAssetList from '@/components/asset/FinancialAssetList.vue'
import TangibleAssetList from '@/components/asset/TangibleAssetList.vue'
import AssetChart from '@/components/asset/AssetChart.vue'

// 1. 데이터 정의
const selectedTab = ref('tab1') // 현재 선택된 탭
const tooltipButton = ref(null) // 툴팁 버튼
const tooltipInstance = ref(null) // 툴팁 인스턴스
const tooltipMessage = ref('금융 자산은 [예/적금], [주식], [채권], [코인], [현금]을 포함합니다.')

// 현재 페이지 인덱스와 페이지당 항목 수
const currentSlide = ref(0)
const itemsPerPage = 4

// 자산 데이터
const selectedAssetType = ref('bank')
const bankDataList = ref([])
const bondDataList = ref([])
const coinDataList = ref([])
const stockDataList = ref([])
const tangibleAssets = ref([])

// 2. 계산된 속성 정의
const latestAssets = computed(() => tangibleAssets.value.slice().reverse()) // 최신순 정렬

// 현재 페이지에 보여줄 항목 계산
const paginatedAssets = computed(() => {
  const start = currentSlide.value * itemsPerPage
  const end = start + itemsPerPage

  return latestAssets.value.slice(start, end)
})

// 총 슬라이드 개수 계산
const maxSlide = computed(() => Math.ceil(tangibleAssets.value.length / itemsPerPage))

// 3. 차트 렌더링 함수 정의
// pieChart, pieChart2 ref 삭제
// chartInstance, chartInstance2 변수 삭제

// 4. 이벤트 핸들러 정의
const prevSlide = () => {
  if (currentSlide.value > 0) currentSlide.value--
}

const nextSlide = () => {
  if (currentSlide.value < maxSlide.value - 1) currentSlide.value++
}

// 툴팁 데이트
const updateTooltipMessage = async () => {
  tooltipMessage.value =
    selectedTab.value === 'tab1'
      ? '금융 자산은 [예/적금], [주식], [채권], [코인], [현금]을 포함합니다.'
      : '현물 자산은 [자동차], [전자기기], [브랜드], [명품], [기타]를 포함합니다.'

  if (tooltipInstance.value) tooltipInstance.value.dispose()

  tooltipButton.value.setAttribute('title', tooltipMessage.value)
  tooltipInstance.value = new BootstrapTooltip(tooltipButton.value)
}

// 탭 변경 시 차트 렌더링
// watch(selectedTab, (newTab) => {
//   if (newTab === 'tab1') renderPieChart()
//   else if (newTab === 'tab2') renderPieChart2()
// })


// 모달 처리
const createModal = ref(null)
const editModal = ref(null)
const editModal2 = ref(null)
const createModal2 = ref(null)
const checkModal = ref(null)

const openCreateModal = () => createModal.value && createModal.value.show()
const openCreateModal2 = () => createModal2.value && createModal2.value.show()
const openEditModal = () => editModal.value && editModal.value.show()
const openEditModal2 = (asset) => editModal2.value && editModal2.value.show(asset)

// 모달 열기 함수 (자산 타입에 따라)
const openCheckModal = (assetType) => {
  if (checkModal.value) {
    selectedAssetType.value = assetType
    checkModal.value.show(assetType)
  }
}

// 자산 추가 처리
const handleCreateAsset = async (newAsset) => {
    tangibleAssets.value.push({ ...newAsset });
    await fetchSpotTotalAmount();
    await getSpotList(); // renderPieChart2() 대신 데이터 갱신
};

// 자산 수정 처리
const handleUpdateAsset = async (updatedAsset) => {
  const index = tangibleAssets.value.findIndex((asset) => asset.index === updatedAsset.index);
  if (index !== -1) {
    tangibleAssets.value.splice(index, 1, { ...updatedAsset });
    await fetchSpotTotalAmount();
    await getSpotList(); // renderPieChart2() 대신 데이터 갱신
  }
};

// 자산 삭제 처리
const handleDeleteAsset = async (deletedAsset) => {
  tangibleAssets.value = tangibleAssets.value.filter((asset) => asset.index !== deletedAsset.index);
  await fetchSpotTotalAmount();
  await getSpotList(); // renderPieChart2() 대신 데이터 갱신
}

const handleAssetUpdate = async (assetType, updatedAsset) => {
  let targetList;
  if (assetType === 'bank') {
    targetList = bankDataList;
  } else if (assetType === 'bond') {
    targetList = bondDataList;
  } else if (assetType === 'coin') {
    targetList = coinDataList;
  } else if (assetType === 'stock') {
    targetList = stockDataList;
  }

  // 여기서 ref.value로 접근해야 함
  const index = targetList.value.findIndex(asset => asset.index === updatedAsset.index);
  if (index !== -1) {
    targetList.value[index] = { ...updatedAsset };
    console.log(`자산 ${assetType}이(가) 업데이트되었습니다.`);
  } else {
    console.warn(`해당 자산을 찾을 수 없습니다: ${updatedAsset.index}`);
  }

  await getFinanceList();
  await fetchFinanceAmount();
  await fetchFinanceAssetList();
  // renderPieChart() 제거
};

const handleAssetDelete = async (assetType, assetIndex) => {
  let targetList;
  if (assetType === 'bank') {
    targetList = bankDataList;
  } else if (assetType === 'bond') {
    targetList = bondDataList;
  } else if (assetType === 'coin') {
    targetList = coinDataList;
  } else if (assetType === 'stock') {
    targetList = stockDataList;
  }

  // ref.value로 접근
  targetList.value = targetList.value.filter(asset => asset.index !== assetIndex);
  console.log(`${assetType} 자산이 삭제되었습니다.`);

  await getFinanceList();
  await fetchFinanceAmount();
  await fetchFinanceAssetList();
  // renderPieChart() 제거
};


const refreshData = async () => {
  console.log("데이터 새로고침 ");
  await fetchFinanceAmount(); 
  await getFinanceList();
  await fetchFinanceAssetList();
  // renderPieChart() 제거
  console.log("데이터 새로고침 완료");
}


const financeTotalAmount = ref(0)

const fetchFinanceAssetList = async () => {
  try {
    const response = await axiosInstance.get('/finance/fin/sum');
    console.log(response);

    console.log(response.data.response.data.amount)
    financeTotalAmount.value = response.data.response.data.amount
  } catch (error) {
    console.error('금융 자산 합 조회 api 호출을 실패하였습니다. ', error)
  }
}

// 금융 자산별 합
const bankAssetAmount = ref(0)
const stockAssetAmount = ref(0)
const coinAssetAmount = ref(0)
const bondAssetAmount = ref(0)

// 금융 자산별 합 조회 연동
const fetchFinanceAmount = async () => {
  try {
    const response = await axiosInstance.get('/finance/fin')
    const data = response.data.response.data

    // 예적금
    bankAssetAmount.value = data[0] ? data[0].amount : 0
    // 주식
    stockAssetAmount.value = data[1] ? data[1].amount : 0
    // 코인
    coinAssetAmount.value = data[2] ? data[2].amount : 0
    // 채권
    bondAssetAmount.value = data[3] ? data[3].amount : 0
  } catch (error) {
    console.error('금융 자산별 합 조회 api 호출을 실패하였습니다. ', error)
  }
}

// 금융 자산별 목록 조회
const fetchFinanceList = async (category) => {
  try {
    const response = await axiosInstance.get(`/asset/${category}/all`)

    console.log(response.data.response.data)

    const data = response.data.response.data

    const dataMap = {
      bank: bankDataList,
      bond: bondDataList,
      coin: coinDataList,
      stock: stockDataList
    }

    // category가 유효하면 해당 값에 data를 할당
    if (dataMap[category]) {
      dataMap[category].value = data
    }
  } catch (error) {
    console.error(category, ' / 금융 자산별 목록 조회 api 호출을 실패하였습니다. ', error)
  }
}

// 현물 자산 총합
const spotTotalAmount = ref(0);

// 총 현물 자산 현황 연동
const fetchSpotTotalAmount = async () => {
  try {

    const response = await axiosInstance.get('/finance/spot/sum')
    console.log(response.data.response.data.amount)
    spotTotalAmount.value = response.data.response.data.amount;
    
  } catch (error) {
    console.error('현물 자산 합 조회 api 호출을 실패하였습니다. ', error)
  }
}

const spotCarAmount = ref(0)
const spotElecAmount = ref(0)
const spotBrandAmount = ref(0)
const spotLuxuryAmount = ref(0)
const spotEtcAmount = ref(0)

// 카테고리별 현물 자산 총��� 조회
const fetchSpotList = async (category) => {
  try {

    const response = await axiosInstance.get(`finance/spot/${category}/sum`)

    const data = response.data.response.data.amount

    const dataMap = {
      car: spotCarAmount,
      elec: spotElecAmount,
      brand: spotBrandAmount,
      luxury: spotLuxuryAmount,
      etc: spotEtcAmount
    }

    // category가 유효하면 해당 값에 data를 할당
    if (dataMap[category]) {
      dataMap[category].value = data
    }
  } catch (error) {
    console.error(category, ' / 카테고리별 현물 자산 목록 조회 api 호출을 실패하였습니다. ', error)
  }
}

// 현물 자산 목록 조회
const fetchFinanceSpotList = async () => {
  try {
    const response = await axiosInstance.get('/finance/spot/all')

    console.log(response.data.response.data)
    tangibleAssets.value = response.data.response.data
  } catch (error) {
    console.error('현물 자산 목록 조회 api 호출을 실패하였습니다. ', error)
  }
}

// 금융 자산별 목록 조회
const getFinanceList = async() => {
  fetchFinanceList('bank')
  fetchFinanceList('stock')
  fetchFinanceList('bond')
  fetchFinanceList('coin')
  console.log("부르기")
}

// 현물 자산별 총합 조회
const getSpotList = async () => {
  await fetchSpotList('car')
  await fetchSpotList('elec')
  await fetchSpotList('brand')
  await fetchSpotList('luxury')
  await fetchSpotList('etc')
}

// 5. 초기 설정
onMounted(() => {
  updateTooltipMessage()
  fetchFinanceAssetList() // 총 금융 자산 현황 조회
  fetchFinanceAmount() // 금융 자산별 합 조회
  getFinanceList() // 금융 자산별 목록 조회
  getSpotList() // 현물 자산별 총합 조회
  fetchSpotTotalAmount() // 총 현물 자산 현황 조회
  fetchFinanceSpotList() // 현물 자산별 목록 조회
  // renderPieChart() 제거
})
</script>

<style scoped>
.tab-bar {
  max-width: 1704px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 80px;
  position: relative;
  padding: 0 20px;
}

.nav-tabs {
  border-bottom: 2px solid #414158;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  padding-right: 60px; /* 툴팁 버튼을 위한 공간 확보 */
}

.nav-item {
  color: #ccccd6;
  flex: 1;
  min-width: 150px;
  max-width: 200px;
  height: 57px;
  text-align: center;
  font-size: 18px;
  line-height: 39px;
  border: 1px solid #ccccd6;
  border-bottom: 1px solid #414158;
}

.nav-item.active {
  background-color: #414158;
  color: white;
  border-bottom: 2px solid #414158;
}

.nav-item:hover {
  cursor: pointer;
}

.tooltip-box {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.tool-btn {
  background: none;
  border: none;
  color: #414158;
  cursor: pointer;
}

.tab-content {
  max-width: 1704px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px;
}

.tab-page {
  margin-top: 40px;
}

/* 반응형 스타일 추가 */
@media (max-width: 768px) {
  .nav-item {
    min-width: 120px;
    font-size: 16px;
  }
  
  .tooltip-box {
    right: -10px;
  }
}

@media (max-width: 576px) {
  .nav-item {
    min-width: 100px;
    font-size: 14px;
  }
  
  .tool-btn {
    font-size: 20px;
  }
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








