<!-- RC-P-24 -->
<template>
  <div class="top-return-asset-page container">
    <!-- Page Title -->
    <h2 class="page-title my-4">
      <font-awesome-icon :icon="['fas', 'chart-line']" class="me-2" />
      리치블이 투자한 상품 중 전월 대비 수익률이 높은 자산은?
    </h2>

    <!-- Filters Section -->
    <div class="filters d-flex mb-4">
      <button
        v-for="(filter, index) in filters"
        :key="index"
        :class="['btn', 'me-2', selectedFilter === filter ? 'btn-primary' : 'btn-outline-secondary']"
        @click="selectedFilter = filter"
      >
        {{ filter }}
      </button>
    </div>

    <!-- Top Assets Cards -->
    <div class="row mb-4">
      <div
        v-for="(asset, index) in topAssets"
        :key="index"
        class="col-lg-4 mb-3"
      >
        <div class="card h-100">
          <div class="card-body text-center">
            <h5 class="card-title">
              <span class="rank me-2">{{ index + 1 }}</span>
              {{ asset.name }}
            </h5>
            <p class="card-text text-muted">{{ asset.type }}</p>
            <h3 class="return-rate text-danger">{{ asset.returnRate }}%</h3>
            <p class="asset-price">{{ asset.price }}원</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Asset Table -->
    <table class="table table-bordered">
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
        <tr v-for="(asset, index) in otherAssets" :key="index">
          <td>{{ index + 4 }}</td>
          <td>{{ asset.type }}</td>
          <td>{{ asset.name }}</td>
          <td>{{ asset.price }}원</td>
          <td class="return-rate text-danger">{{ asset.returnRate }}%</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'

library.add(faChartLine)

const filters = ['전체', '주식', '예/적금', '채권', '코인']
const selectedFilter = ref('전체')

const topAssets = [
  { type: '주식', name: '에이치엘사이언스', returnRate: 30.0, price: '17,160' },
  { type: '주식', name: '영풍정밀', returnRate: 29.9, price: '12,180' },
  { type: '주식', name: '골드앤에스', returnRate: 29.9, price: '542' }
]

const otherAssets = [
  { type: '주식', name: '하이트론', returnRate: 29.9, price: '3,535' },
  { type: '주식', name: '영풍', returnRate: 29.9, price: '386,000' },
  { type: '주식', name: '영풍', returnRate: 29.9, price: '386,000' },
  { type: '주식', name: '영풍', returnRate: 29.9, price: '386,000' }
]
</script>

<style scoped>
.page-title {
  font-size: 24px;
}

.rank {
  font-size: 20px;
  font-weight: bold;
  color: red;
}

.return-rate {
  font-size: 18px;
  color: red;
}

.asset-price {
  margin-top: 10px;
  color: #555;
}

.table th,
.table td {
  text-align: center;
}

.btn-outline-secondary {
  background-color: white;
}
</style>
