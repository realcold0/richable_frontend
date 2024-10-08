<template>
  <div class="top-return-asset-page container">
    <!-- 필터 섹션 -->
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
      <div v-if="topAssets.length === 0">상위 자산이 없습니다.</div>
      <div v-else v-for="(asset, index) in topAssets" :key="index" class="asset-card card">
        <h5 class="rank"> {{ index + 1 }} {{ asset.name }} </h5>
        <p class="type">{{ asset.category }}</p>
        <h3 class="return-rate">{{ asset.rate }} %</h3>
        <p class="price">{{ asset.price }}원</p>
      </div>
    </div>

    <!-- 자산 목록 표 -->
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
            <td>{{ index+1  }}</td>
            <td>{{ asset.category }}</td>
            <td>{{ asset.name }}</td>
            <td>{{ asset.price }}원</td>
            <td class="return-rate">{{ asset.rate }} %</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import axiosInstance from '@/AxiosInstance';

// JWT 토큰을 저장 (예: 로그인 후 받은 토큰)
const token = localStorage.getItem('authToken');

// 필터 항목들
const filters = ['전체', '주식', '코인']
const selectedFilter = ref('전체')

// 상위 수익 자산 데이터
const topAssets = ref([])

// 필터링된 자산 목록
const filteredAssets = ref([])

// 전체 자산 데이터 (API 호출 결과를 저장할 변수)
let allAssets = ref([])

// 필터 클릭 시 실행되는 함수
const filterAssets = async (filter) => {
  selectedFilter.value = filter;
  let url = 'http://localhost:8080/invest/highreturn'; // 전체 조회

  if (filter === '주식') {
    url = 'http://localhost:8080/invest/highreturn/stock';
  } else if (filter === '코인') {
    url = 'http://localhost:8080/invest/highreturn/coin';
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`  // JWT 토큰을 Authorization 헤더에 추가
      }
    });
    if (response.data.success) {
      allAssets.value = response.data.response.data.map(item => ({
        name: item.name,
        category: item.category,
        rate: parseFloat(item.rate.replace('%', '')), // 수익률을 숫자로 변환
        price: item.price.toLocaleString() // 천 단위 구분 추가
      }));
      filterAssetsByType();
    } else {
      console.error('API 응답 실패:', response.data.message);
    }
  } catch (error) {
    console.error('자산 데이터를 불러오는 중 오류 발생:', error);
  }
}

// 선택된 필터에 따른 자산 필터링 및 정렬
const filterAssetsByType = () => {
  let filtered = allAssets.value;
  
  if (selectedFilter.value !== '전체') {
    filtered = allAssets.value.filter(asset => asset.category === selectedFilter.value);
  }

  // 수익률 기준으로 내림차순 정렬
  filtered.sort((a, b) => b.rate - a.rate);

  filteredAssets.value = filtered;
  topAssets.value = filteredAssets.value.slice(0, 3); // 상위 3개만 topAssets에 저장
}

// 페이지 로드 시 전체 자산을 불러옴
onMounted(() => {
  filterAssets('전체'); // 초기 로드 시 전체 자산 조회
})
</script>

<style scoped>
/* 전체 페이지 여백 */
.top-return-asset-page {
  margin-top: 40px;
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
  font-size: 18px;
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
  margin-left: 15px;
}

/* 카드 스타일 */
.card-container {
  display: flex;
  gap: 30px;
  margin-top: 40px;
}

.asset-card {
  flex: 1;
  padding: 30px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  text-align: center;
  font-size: 18px;
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
  font-size: 26px;
  color: red;
  margin-bottom: 5px;
}

.price {
  font-size: 18px;
  color: #555;
}

/* 표 스타일 */
.table-card {
  margin-top: 40px;
  padding: 30px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  font-size: 18px;
}

.table {
  width: 100%;
  margin-top: 20px;
}

.table th, .table td {
  text-align: center;
  padding: 12px;
}

.return-rate {
  color: red;
}
</style>
