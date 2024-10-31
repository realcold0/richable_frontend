<template>
  <!-- 투자 성향 및 상품 추천 -->
  <div v-if="isLoadingTendency" class="spinner-container">
    <div class="spinner"></div>
  </div>
  <div v-else>
    <div class="cha-title">
      <div class="cha-title-sub">
        <strong>{{ nickname }}</strong
        >님은
        <p style="display: inline; color: #ff0062">{{ tendency }}</p>
        이군요.
      </div>
      <div class="cha-title-main">
        <template v-if="tendency === '공격형'">
          <span style="color: #ff0062">채권/예금</span> 상품을 추천해드려요.
        </template>
        <template v-else-if="tendency === '안정형'">
          <span style="color: #ff0062">주식/코인</span> 상품을 추천해드려요.
        </template>
        <template v-else> 다양한 상품을 추천해드려요. </template>
      </div>
    </div>

    <!-- ListSlider 컴포넌트로 추천 상품 리스트 표시 -->
    <ListSlider :products="recommendedProducts" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axiosInstance from '@/AxiosInstance'
import ListSlider from './ListSlider.vue'

const recommendedProducts = ref([]) // 추천 상품
const tendency = ref('') // 투자 성향 데이터
const nickname = ref('') // 닉네임 데이터 추가
const isLoadingTendency = ref(true)

onMounted(() => {
  const token = localStorage.getItem('authToken')

  if (token) {
    // 추천 상품 가져오기
    axiosInstance
      .get('/invest/recommended')
      .then((response) => {
        if (response.data.success) {
          recommendedProducts.value = response.data.response.data
          isLoadingTendency.value = false
        } else {
          console.error('추천 상품을 가져오는데 실패했습니다.')
        }
      })
      .catch((error) => {
        console.error('추천 상품을 가져오는 중 에러 발생:', error)
      })

    // 투자 성향 및 카테고리 데이터 가져오기
    axiosInstance
      .get('/invest/tendency')
      .then((response) => {
        if (response.data.success) {
          tendency.value = response.data.response.data.tendency
        } else {
          console.error('투자 성향 데이터를 가져오는데 실패했습니다.')
        }
      })
      .catch((error) => {
        console.error('투자 성향 데이터를 가져오는 중 에러 발생:', error)
      })

    // 닉네임 가져오기
    axiosInstance
      .get('/member/info')
      .then((response) => {
        if (response.data.success) {
          nickname.value = response.data.response.data.data.nickname
        } else {
          console.error('닉네임 데이터를 가져오는데 실패했습니다.')
        }
      })
      .catch((error) => {
        console.error('닉네임 데이터를 가져오는 중 에러 발생:', error)
      })
  } else {
    console.error('JWT 토큰이 localStorage에 없습니다.')
    isLoadingTendency.value = false
  }
})
</script>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #ff0062;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.cha-title {
  margin-top: 100px;
}

.cha-title-sub {
  color: var(--4, #1d1616);
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;
}

.cha-title-main {
  color: var(--4, #1d1616);
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 700;
}
</style>
