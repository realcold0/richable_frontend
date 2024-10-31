<template>
  <div class="container">
    <!-- 월간 네비게이션 -->
    <MonthNavigation :curMonth="curMonth" @previous-month="previousMonth" @next-month="nextMonth" />

    <!-- 상단 소비 정보 -->
    <ConsumeInfo
      :saveAmount="saveAmount"
      :possibleSaveAmount="possibleSaveAmount"
      :couldsaving="couldsaving"
    />

    <!-- 카테고리 선택 및 비교 -->
    <div class="avg-content">
      <div class="text-left category-comparison">
        <div class="sub-title">대한민국 평균 소비금액을 기준으로 비교해요</div>
        <div class="main-title">나는 평균 대비 얼마나 지출할까요?</div>
      </div>

      <div class="text-center">
        <SelectingCategory
          v-model:category="category"
          :categories="categories"
          :diffAmount="diffAmount"
        />

        <!-- 차트 -->
        <MyChart :averageSpending="averageSpending" :userSpending="userSpending" />
      </div>
    </div>

    <!-- 6개월 절약 시뮬레이션 -->
    <CouldSavingInfo
      :couldsaving="couldsaving"
      :possibleSaveAmount="possibleSaveAmount"
      :saveAmount="saveAmount"
      :months="months"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axiosInstance from '@/AxiosInstance'
import { useMonthStore } from '@/stores/consume/curMonth.js'

import SelectingCategory from './CompareComponent/SelectingCategory.vue'
import MonthNavigation from './CompareComponent/MonthNavigation.vue'
import ConsumeInfo from './CompareComponent/ConsumeInfo.vue'
import CouldSavingInfo from './CompareComponent/CouldSavingInfo.vue'
import MyChart from './CompareComponent/MyChart.vue'

// 달별 네비게이션
const monthStore = useMonthStore()
const curMonth = ref(monthStore.month)
const curYear = ref(monthStore.year)
const category = ref('식료품')
const categories = ref([
  '식료품',
  '유흥',
  '쇼핑',
  '공과금',
  '생활용품',
  '의료비',
  '교통비',
  '통신비',
  '문화',
  '교육비',
  '외식',
  '비소비지출',
  '기타'
])
const userSpending = ref(0)
const couldsaving = ref(0)
const averageSpending = ref(0)
const diffAmount = computed(() => userSpending.value - averageSpending.value)
const possibleSaveAmount = ref([])
const saveAmount = ref([])
const months = ref([])

// 이전/다음 달 버튼 클릭 시 데이터 가져오기
const previousMonth = () => {
  const { year: updatedYear, month: updatedMonth } = monthStore.decreaseMonth()
  curMonth.value = updatedMonth
  curYear.value = updatedYear
  fetchAllData()
}

const nextMonth = () => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1

  if (
    curYear.value < currentYear ||
    (curYear.value === currentYear && curMonth.value < currentMonth)
  ) {
    const { year: updatedYear, month: updatedMonth } = monthStore.increaseMonth()
    curMonth.value = updatedMonth
    curYear.value = updatedYear
    fetchAllData()
  }
}

// API 호출 함수들
const fetchComparisonData = async () => {
  const tempCategory = mapColumnToKeyword2(category.value)
  const encodedCategory = encodeURIComponent(tempCategory)
  const response = await axiosInstance.get(
    `/outcome/compare/${curYear.value}/${curMonth.value}/${encodedCategory}`
  )
  const data = response.data.response.data
  userSpending.value = data.mySum
  averageSpending.value = data.averageSum
}

const fetchCouldSaving = async () => {
  const response = await axiosInstance.get(`/outcome/review/sum/${curYear.value}/${curMonth.value}`)
  couldsaving.value = Math.abs(response.data.response.data.possibleSaveAmount)
}

const fetchSimulationData = async () => {
  const response = await axiosInstance.get(`/outcome/simulation/${curYear.value}/${curMonth.value}`)
  const data = response.data.response.data
  possibleSaveAmount.value = data.possibleSaveAmount.map((amount) => Math.abs(amount))
  saveAmount.value = data.saveAmount.map((amount) => Math.abs(amount))
  months.value = data.months
}

const fetchAllData = () => {
  fetchComparisonData()
  fetchCouldSaving()
  fetchSimulationData()
}

const mapColumnToKeyword2 = (keyword) => {
  const wordMapping2 = {
    식료품: '식료품 · 비주류음료',
    유흥: '주류 · 담배',
    쇼핑: '의류 · 신발',
    공과금: '주거 · 수도 · 광열',
    생활용품: '가정용품 · 가사서비스',
    의료비: '보건',
    교통비: '교통',
    통신비: '통신',
    문화: '오락 · 문화',
    교육비: '교육',
    외식: '음식',
    기타: '기타상품',
    비소비지출: '비소비지출'
  }
  return wordMapping2[keyword] || '매핑되지 않은 컬럼'
}

// 데이터 로드 시점 설정
onMounted(fetchAllData)

watch([curMonth, curYear], fetchAllData)
</script>

<style scoped>
* {
  font-family: pretendard;
  color: #19181d;
  font-size: 20px;
  max-width: 1704px;
}

.container {
  padding: 5em;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 432px;
  background: #fff;
}

.avg-content {
  margin-top: 100px;
}

#myChart {
  width: 100%;
  max-width: 800px;
  height: auto;
  margin: 0;
  display: block;
  border-radius: 20px;
  border: 1px solid #e4ebf0;
}

.sub-title {
  color: var(--3, #414158);
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: -0.36px;
}

.graph-container,
.graph-container2 {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 432px;
  background: #fff;
}

.save-chart-container {
  width: 100%;
  max-width: 800px;
  height: 100%;
  display: flex;
  justify-content: center;
  border-radius: 20px;
  border: 1px solid #e4ebf0;
}
</style>
