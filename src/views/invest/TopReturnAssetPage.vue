<template>
  <div style="margin-bottom:100px;" class="top-return-asset-page container">
    <div class="total-asset">
      <div class="total-asset-sub">리치들이 투자한 상품 중 </div>
      <div class="total-asset-title">전일 대비 수익률이 높은 자산은?</div>
    </div>

    <!-- 필터 섹션 -->
    <TopReturnFilterButtons
      :filters="filters"
      :selectedFilter="selectedFilter"
      @filterSelected="filterAssets"
    />

    <!-- 상위 수익 자산 카드 -->
    <TopReturnCard :topAssets="topAssets" />

    <!-- 자산 목록 표 -->
    <TopReturnTable :filteredAssets="filteredAssets" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axiosInstance from '@/AxiosInstance'
import TopReturnCard from '../../components/Invest/TopReturnCard.vue';
import TopReturnFilterButtons from '../../components/Invest/TopReturnFilterButtons.vue';
import TopReturnTable from '../../components/Invest/TopReturnTable.vue';

const filters = ['전체', '주식', '코인']
const selectedFilter = ref('전체')

const topAssets = ref([])
const filteredAssets = ref([])
let allAssets = ref([])

const filterAssets = async (filter) => {
  selectedFilter.value = filter;
  let url = '/invest/highreturn'; // 전체 조회

  if (filter === '주식') {
    url = '/invest/highreturn/stock';
  } else if (filter === '코인') {
    url = '/invest/highreturn/coin';
  }

  try {
    const response = await axiosInstance.get(url);
    if (response.data.success) {
      allAssets.value = response.data.response.data.map(item => ({
        name: item.name,
        category: item.category,
        rate: parseFloat(item.rate.replace('%', '')),
        price: item.price.toLocaleString()
      }));
      filterAssetsByType();
    } else {
      console.error('API 응답 실패:', response.data.message);
    }
  } catch (error) {
    console.error('자산 데이터를 불러오는 중 오류 발생:', error);
  }
}

const filterAssetsByType = () => {
  let filtered = allAssets.value;

  if (selectedFilter.value !== '전체') {
    filtered = allAssets.value.filter(asset => asset.category === selectedFilter.value);
  }

  filtered.sort((a, b) => b.rate - a.rate);

  filteredAssets.value = filtered;
  topAssets.value = filteredAssets.value.slice(0, 3); // 상위 3개만 topAssets에 저장
}

onMounted(() => {
  filterAssets('전체');
})
</script>
