<template>
  <div class="top-return-asset-page container">
    <!-- Filters Section -->
    <div class="filters">
      <button
        v-for="(filter, index) in filters"
        :key="index"
        :class="['filter-btn', selectedFilter === filter ? 'active' : 'inactive']"
        @click="filterAssets(filter)"
      >
        {{ filter }}
      </button>
    </div>

    <!-- 상위 수익 자산 카드 -->
    <div class="card-container">
      <div v-for="(asset, index) in topAssets" :key="index" class="asset-card card">
        <h5 class="rank"> {{ index + 1 }} {{ asset.name }} </h5>
        <p class="type">{{ asset.type }}</p>
        <h3 class="return-rate">{{ asset.returnRate }}%</h3>
        <p class="price">{{ asset.price }}원</p>
      </div>
    </div>

    <!-- 표를 카드로 감싸기 -->
    <div class="table-card card">
      <table class="table">
        <thead class="thead-light">
          <tr>
            <th>순위</th>
            <th>종류</th>
            <th>자산명</th>
            <th>가격</th>
            <th>수익률</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(asset, index) in filteredAssets" :key="index">
            <td>{{ index + 4 }}</td>
            <td>{{ asset.type }}</td>
            <td>{{ asset.name }}</td>
            <td>{{ asset.price }}원</td>
            <td class="return-rate">{{ asset.returnRate }}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 필터 항목들
const filters = ['전체', '주식', '예/적금', '채권', '코인']
const selectedFilter = ref('전체')

// 상위 수익 자산 데이터 (주식, 예적금, 채권, 코인)
const topAssets = [
  { type: '주식', name: '에이치엘사이언스', returnRate: 30.0, price: '17,160' },
  { type: '주식', name: '영풍정밀', returnRate: 29.9, price: '12,180' },
  { type: '주식', name: '골드앤에스', returnRate: 29.9, price: '542' }
]

// 더미 데이터 추가 (다양한 유형)
const otherAssets = [
  { type: '예/적금', name: '한국은행 적금', returnRate: 1.5, price: '1,000,000' },
  { type: '채권', name: '국채 10년물', returnRate: 2.0, price: '1,500,000' },
  { type: '코인', name: '비트코인', returnRate: -5.0, price: '50,000,000' },
  { type: '주식', name: '하이트론', returnRate: 29.9, price: '3,535' },
  { type: '주식', name: '영풍', returnRate: 29.9, price: '386,000' },
  { type: '예/적금', name: '카카오뱅크 적금', returnRate: 1.8, price: '500,000' },
  { type: '채권', name: '국채 20년물', returnRate: 2.3, price: '2,000,000' },
  { type: '코인', name: '이더리움', returnRate: -2.5, price: '4,000,000' },
  { type: '주식', name: '삼성전자', returnRate: 5.3, price: '68,000' }
]

// 필터 클릭 시 실행되는 함수
const filterAssets = (filter) => {
  selectedFilter.value = filter
}

// 필터링된 자산 목록 계산
const filteredAssets = computed(() => {
  if (selectedFilter.value === '전체') {
    return otherAssets // 전체 선택 시 모든 자산을 표시
  }
  return otherAssets.filter(asset => asset.type === selectedFilter.value) // 필터에 맞는 자산만 표시
})
</script>

<style scoped>
/* 전체 페이지 여백 */
.top-return-asset-page {
  margin-top: 40px; /* 상단에서 40px 만큼 떨어지게 */
  padding: 20px;
}

/* 필터 스타일 */
.filters {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
}

.filter-btn {
  padding: 15px 25px;
  border: none;
  background-color: transparent;
  font-size: 18px; /* 크기 증가 */
  font-weight: bold;
  color: #9e9e9e;
  cursor: pointer;
  border-radius: 10px 10px 0 0;
}

.filter-btn.active {
  background-color: #3e3e3e;
  color: white;
}

.filter-btn.inactive {
  color: #bdbdbd;
}

.filter-btn + .filter-btn {
  margin-left: 15px; /* 필터 간 간격을 조금 더 크게 */
}

/* 카드 스타일 */
.card-container {
  display: flex;
  gap: 30px; /* 카드 간격을 넓게 */
  margin-top: 40px; /* 상단에서 더 떨어지도록 */
}

.asset-card {
  flex: 1;
  padding: 30px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  text-align: center;
  font-size: 18px; /* 카드 내 텍스트 크기 증가 */
}

.rank {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
}

.type {
  font-size: 18px;
  margin-bottom: 5px;
}

.return-rate {
  font-size: 26px; /* 수익률 글씨 크기 증가 */
  color: red;
  margin-bottom: 5px;
}

.price {
  font-size: 18px;
  color: #555;
}

/* 표를 감싸는 카드 */
.table-card {
  margin-top: 40px; /* 표 상단에서 더 내려오도록 */
  padding: 30px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 18px; /* 표 글씨 크기 증가 */
}

.table {
  width: 100%;
  margin-top: 20px;
}

.table th, .table td {
  text-align: center;
  padding: 12px; /* 표 내 셀 패딩 증가 */
}

.return-rate {
  color: red;
}
</style>
