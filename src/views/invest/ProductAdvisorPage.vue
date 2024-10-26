<template>
  <div class="container">
    <!-- 상단 질문 텍스트 -->
    <TopText :available-cash="availableCash" />

    <!-- 도넛 차트 영역 -->
    <DonutChart :availablePercentage="availablePercentage" :tooltipMessage="tooltipMessage" />

    <!-- 투자 성향 및 상품 추천 -->
    <DefiningTendency
      :isLoadingTendency="isLoadingTendency"
      :nickname="nickname"
      :startDragging="startDragging"
      :tendency="tendency"
      :recommendedProducts="recommendedProducts"
      :category="category"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axiosInstance from '@/AxiosInstance'
import TopText from './AdvisorComponent/TopText.vue'
import DonutChart from './AdvisorComponent/DonutChart.vue'
import DefiningTendency from './AdvisorComponent/DefiningTendency.vue'

const availableCash = ref(0)
const availablePercentage = ref(0)
const totalAssets = ref(0)
const recommendedProducts = ref([])
const tendency = ref('')
const category = ref('')
const nickname = ref('')
const isLoadingTendency = ref(true)
const tooltipMessage = ref('여유자금은 보유 현금과 입출금 통장 금액의 합산입니다')

onMounted(() => {
  const token = localStorage.getItem('authToken')
  if (token) {
    axiosInstance
      .get('/finance/total/sum')
      .then((response) => {
        if (response.data.success) {
          totalAssets.value = response.data.response.data.amount
          return axiosInstance.get('/invest/available')
        }
      })
      .then((response) => {
        if (response && response.data.success) {
          availableCash.value = response.data.response.data.availableCash
          availablePercentage.value = (availableCash.value / totalAssets.value) * 100
        }
      })
      .catch(console.error)

    axiosInstance
      .get('/invest/recommended')
      .then((response) => {
        if (response.data.success) {
          recommendedProducts.value = response.data.response.data
          isLoadingTendency.value = false
        }
      })
      .catch(console.error)

    axiosInstance
      .get('/invest/tendency')
      .then((response) => {
        if (response.data.success) {
          tendency.value = response.data.response.data.tendency
          category.value = response.data.response.data.category
        }
      })
      .catch(console.error)

    axiosInstance
      .get('/member/info')
      .then((response) => {
        if (response.data.success) {
          nickname.value = response.data.response.data.data.nickname
        }
      })
      .catch(console.error)
  } else {
    isLoadingTendency.value = false
    console.error('JWT 토큰이 localStorage에 없습니다.')
  }
})
</script>

<style scoped>
* {
  color: #19181d;
  font-family: 'Pretendard', sans-serif;
}
.container {
  margin: 0;
  padding: 20px;
  transform: translateX(300px);
}
</style>
