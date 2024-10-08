<template>
  <div class="container mt-5">
    <!-- 상단 질문 텍스트 -->
    <div class="text-center mb-4">
      <h3>나의 자산 중 여유자금은 얼마일까요?</h3>
      <p class="lead">
        나의 전체 자산 중 바로 투자를 할 수 있는 여유자금은 <strong class="text-danger">{{ availableCash.toLocaleString() }}원</strong>이에요.
      </p>
    </div>

    <!-- 도넛 차트 영역 -->
    <div class="d-flex justify-content-center align-items-center mb-5">
      <div class="chart-container">
        <div class="donut-chart">
          <svg viewBox="0 0 36 36">
            <path
              class="circle-bg"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              class="circle"
              :stroke-dasharray="`${availablePercentage}, 100`"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div class="chart-label">
            <strong>{{ availablePercentage.toFixed(2) }}%</strong>
          </div>
        </div>
      </div>
    </div>


<div class="text-left mt-5">
  <p class="lead">
    김리치님의 <strong class="text-danger">[{{ tendency }}]</strong> 성향을 기반으로 추천드려요.
  </p>
  <h5><strong>[{{ category }}]</strong> 상품에 여유자금으로 투자하기</h5>
</div>


   <!-- 추천상품 -->
    <div class="row text-center mt-4">
      <div v-for="(product, index) in recommendedProducts" :key="index" class="col-md-3">
        <div class="card mb-4 shadow-sm">
          <div class="card-body">
            <p class="card-title" :style="{ color: product.prodCategory === '채권' ? 'orange' : 'red' }">{{ product.prodCategory }}</p>
            <h6 class="card-subtitle mb-2 text-muted">{{ product.name }}</h6>
            <p class="card-text"><strong>{{ product.price.toLocaleString() }}원</strong></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import axiosInstance from '@/AxiosInstance';

const availableCash = ref(0); // 여유 자금
const availablePercentage = ref(0); // 여유 자금 비율
const recommendedProducts = ref([]); // 추천 상품
const tendency = ref(''); // 투자 성향 데이터
const category = ref(''); // 카테고리 데이터

onMounted(() => {
  const token = localStorage.getItem('authToken'); // JWT 토큰 가져오기

  if (token) {
    // 여유 자금 및 비율 가져오기
    axiosInstance.get('/invest/available')
    .then(response => {
      if (response.data.success) {
        availableCash.value = response.data.response.data.availableCash; // 여유 자금 설정
        availablePercentage.value = calculatePercentage(response.data.response.data.availableCash); // 비율 계산
      } else {
        console.error("여유 자금 데이터를 가져오는데 실패했습니다.");
      }
    })
    .catch(error => {
      console.error("여유 자금 데이터를 가져오는 중 에러 발생:", error);
    });

    // 추천 상품 가져오기
    axiosInstance.get('/invest/recommended')
    .then(response => {
      if (response.data.success) {
        recommendedProducts.value = response.data.response.data; // 추천 상품 설정
      } else {
        console.error("추천 상품을 가져오는데 실패했습니다.");
      }
    })
    .catch(error => {
      console.error("추천 상품을 가져오는 중 에러 발생:", error);
    });

    // 투자 성향 및 카테고리 데이터 가져오기
    axiosInstance.get('/invest/tendency')
    .then(response => {
      if (response.data.success) {
        tendency.value = response.data.response.data.tendency; // 투자 성향 데이터 설정
        category.value = response.data.response.data.category; // 카테고리 데이터 설정
      } else {
        console.error("투자 성향 데이터를 가져오는데 실패했습니다.");
      }
    })
    .catch(error => {
      console.error("투자 성향 데이터를 가져오는 중 에러 발생:", error);
    });

  } else {
    console.error('JWT 토큰이 localStorage에 없습니다.');
  }
});

// 여유 자금 비율 계산 함수
const calculatePercentage = (cash) => {
  const totalAssets = 5000000; // 전체 자산 값 설정 (변경 가능)
  return (cash / totalAssets) * 100;
};
</script>

<style scoped>
.chart-container {
  width: 200px;
  height: 200px;
  position: relative;
}

.donut-chart {
  width: 100%;
  height: 100%;
  position: relative;
}

.donut-chart svg {
  width: 100%;
  height: 100%;
}

.circle-bg {
  fill: none;
  stroke: #eee;
  stroke-width: 3.8;
}

.circle {
  fill: none;
  stroke-width: 3.8;
  stroke: #ff0062;
  stroke-linecap: round;
  animation: progress 1s ease-out forwards;
}

@keyframes progress {
  0% {
    stroke-dasharray: 0 100;
  }
}

.chart-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
}
</style>
