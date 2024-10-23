<template>
    <div class="content-container">
      <!-- 상단 자산 정보 컴포넌트 -->
      <TotalAsset :nickname="auth.userProfile.data.nickname" :assetAmount="currentAsset" />
  
      <!-- 자산 비교 컴포넌트 -->
      <AssetComparison
        :nickname="auth.userProfile.data.nickname"
        :peerAverageAsset="peerAverageAsset"
        :currentAsset="currentAsset"
        :assetDifference="assetDifference"
        :assetList="assetList"
      />
  
      <!-- 자산 비교 테이블 컴포넌트 -->
      <AssetTable :assetList="assetList" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import TotalAsset from '@/components/TotalAsset.vue';
  import AssetComparison from '@/components/AssetComparison.vue';
  import AssetTable from '@/components/AssetTable.vue';
  import { useAuthStore } from '@/stores/auth';
  import axiosInstance from '@/AxiosInstance.js';
  
  // 상태 관리 및 데이터 초기화
  const auth = useAuthStore();
  const currentAsset = ref(0);
  const peerAverageAsset = ref(0);
  const assetDifference = ref(0);
  const assetList = ref([]);
  
  // 자산 데이터 가져오기 함수들
  const fetchFinancialAssetsSum = async () => {
    try {
      const response = await axiosInstance.get('/finance/fin/sum');
      currentAsset.value = response.data.response.data.amount;
    } catch (error) {
      console.error('Error fetching financial assets sum:', error);
    }
  };
  
  const fetchPeerData = async () => {
    try {
      const response = await axiosInstance.get('/finance/peer');
      peerAverageAsset.value = response.data.response.data.spotAvgAmount;
      assetDifference.value = (currentAsset.value - peerAverageAsset.value) / 10000;
    } catch (error) {
      console.error('Error fetching peer data:', error);
    }
  };
  
  const fetchPeerFinanceData = async () => {
    try {
      const response = await axiosInstance.get('/finance/peer/finance');
      assetList.value = response.data.response.data.map(item => ({
        category: item.category,
        myAsset: item.bsAmount,
        averageAsset: item.categoryAvgAmount,
        difference: item.bsAmount - item.categoryAvgAmount,
      }));
    } catch (error) {
      console.error('Error fetching peer finance data:', error);
    }
  };
  
  // 초기 데이터 로드
  onMounted(async () => {
    auth.fetchUserProfile();
    await fetchFinancialAssetsSum();
    await fetchPeerData();
    await fetchPeerFinanceData();
  });
  </script>
  
  <style scoped>
  .content-container {
    margin: 40px auto;
    max-width: 1440px;
    padding: 0 40px;
    text-align: center;
    color: #19181d;
    font-family: 'Pretendard', sans-serif;
  }
  </style>
  