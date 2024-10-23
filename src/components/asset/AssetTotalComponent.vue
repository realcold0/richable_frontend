<template>
    <div class="total-asset">
        <div class="asset-title">{{ auth.userProfile.data.nickname }}님의 총 자산 현황 😎</div>
        <div class="asset-amount">{{ formatCurrency(finAsset) }}원</div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth';
import axiosInstance from '@/AxiosInstance';

const auth = useAuthStore();
const finAsset = ref(0);  // 금융 자산을 저장할 반응형 변수

const fetchData = async () => {
  try {
    const response = await axiosInstance.get('/finance/fin/sum');  // API 호출
    finAsset.value = response?.data?.response?.data?.amount || 0;  // 응답에서 자산 금액 가져오기
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error);
    finAsset.value = 0;  // 오류 발생 시 자산을 0으로 설정
  }
};

// 금액 포맷 함수
const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) {
    return '0';  // 금액이 없거나 유효하지 않을 때 기본값으로 '0' 반환
  }
  return amount.toLocaleString('ko-KR');  // 통화 형식으로 변환
};

onMounted(() => {
  auth.fetchUserProfile();  // 사용자 프로필 로드
  fetchData();  // 금융 자산 데이터 가져오기
});
</script>

<style scoped>
.total-asset {
  max-width: 1764px;
  border-radius: 20px;
  margin-top: 40px;
}

.asset-title {
  font-size: 22px;
  font-weight: 500;
  line-height: 150%;
  color: var(--black-default, #19181d);
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
</style>
