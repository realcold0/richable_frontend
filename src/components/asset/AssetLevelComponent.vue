<template>
    <!-- 나의 단계 -->
    <div class="asset-level-container">
      <div class="asset-level-title">
        {{ auth.userProfile.data.nickname }}님은 <strong>{{ assetLevel.level }} 단계</strong>예요
      </div>
      <div class="asset-level-sub">{{ assetLevel.description }}</div>
      <div
        class="asset-level-img"
        :style="{
          backgroundImage: `url(${assetLevel.imgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          marginBottom: '36px'
        }"
      ></div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import axiosInstance from '@/AxiosInstance';
  
  const auth = useAuthStore();
  const finAsset = ref(0); // ref로 선언
  
  const fetchData = async () => {
    try {
      const finsum = await axiosInstance.get('/finance/fin/sum');
      finAsset.value = finsum?.data?.response?.data?.amount || 0;
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
    }
  };
  
  // DisplayAsset 값에 따른 단계 계산
  const assetLevel = computed(() => {
    const asset = finAsset.value;
  
    if (asset < 10000000) {
      return {
        level: '씨앗',
        description: '0원 ~ 1천만원 이하의 유저입니다.',
        imgUrl: new URL('@/assets/images/level-seed-rich.png', import.meta.url).href
      };
    } else if (asset >= 10000000 && asset < 50000000) {
      return {
        level: '새싹',
        description: '1천만원 이상 ~ 5천만원 미만의 유저입니다.',
        imgUrl: new URL('@/assets/images/level-sprout-rich.png', import.meta.url).href
      };
    } else if (asset >= 50000000 && asset < 100000000) {
      return {
        level: '나무',
        description: '5천만원 이상 ~ 1억원 미만의 유저입니다.',
        imgUrl: new URL('@/assets/images/level-tree-rich.png', import.meta.url).href
      };
    } else {
      return {
        level: '리치',
        description: '1억원 이상의 재산가입니다.',
        imgUrl: new URL('@/assets/images/level-leechy-rich.png', import.meta.url).href
      };
    }
  });
  
  onMounted(() => {
    auth.fetchUserProfile();
    fetchData();
  });
  </script>
  
  <style scoped>
  .asset-level-container {
    background-color: #fff;
    padding: 30px;
    border: 1px solid #e4ebf0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .asset-level-title {
    font-size: 22px;
    font-weight: 500;
    line-height: 150%;
    color: var(--black-default, #19181d);
    letter-spacing: -0.4px;
    text-align: center;
    margin-top: 36px;
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
    background-size: cover;
    width: 90px;
    height: 126px;
    padding: 20px;
  }
  </style>
  