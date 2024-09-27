<template>
  <div class="container">
    <!-- 상단 자산 정보 -->
    <div class="text-center mb-4 saved-info">
      <h2>김리치님의 자산 현황 <span>😎</span></h2>
      <h1 class="saved-amount">{{ currentAsset.toLocaleString() }}원</h1>
    </div>

    <!-- 전체 자산 비교 -->
    <div class="asset-comparison-section text-center mb-4">
      <h4>김리치님의 자산은 20대 평균보다 <strong class="text-danger">{{ assetDifference.toLocaleString() }}만원 많습니다.</strong></h4>
      <div class="row">
        <!-- 막대 차트 -->
        <div class="col-md-6">
          <canvas id="barChart" class="chart-size"></canvas>
        </div>
        <!-- 레이더 차트 -->
        <div class="col-md-6">
          <canvas id="radarChart" class="chart-size"></canvas>
        </div>
      </div>
    </div>

    <!-- 자산 비교 테이블 -->
    <div class="table-responsive mt-4">
      <table class="table table-striped text-center">
        <thead>
          <tr>
            <th>종목</th>
            <th>나의 자산</th>
            <th>평균 자산</th>
            <th>비교</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in assetList" :key="index">
            <td>{{ item.category }}</td>
            <td>{{ item.myAsset.toLocaleString() }}원</td>
            <td>{{ item.averageAsset.toLocaleString() }}원</td>
            <td>{{ item.difference.toLocaleString() }}원이 더 적습니다.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// 현재 자산 정보
const currentAsset = ref(12100000);
const assetDifference = ref(1000);

// 자산 리스트
const assetList = ref([
  { category: '적금', myAsset: 10000, averageAsset: 10000, difference: 10000 },
  { category: '예금', myAsset: 10000, averageAsset: 10000, difference: 10000 },
  { category: '주식', myAsset: 10000, averageAsset: 10000, difference: 10000 },
  { category: '코인', myAsset: 10000, averageAsset: 10000, difference: 10000 },
  { category: '채권', myAsset: 10000, averageAsset: 10000, difference: 10000 },
  { category: '입출금', myAsset: 10000, averageAsset: 10000, difference: 10000 }
]);

// 차트 생성 함수
const createCharts = () => {
  const barCtx = document.getElementById('barChart').getContext('2d');
  const radarCtx = document.getElementById('radarChart').getContext('2d');

  // 막대 차트
  new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: ['20대 평균', '나의 자산'],
      datasets: [
        {
          label: '자산 비교',
          data: [4900, 5900],
          backgroundColor: ['#d3d3d3', '#ff6384'],
          borderRadius: 10,
          barThickness: 50,
        }
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // 가로세로 비율 유지 안함
      scales: { y: { beginAtZero: true } },
      plugins: {
        legend: { display: false },
      },
    },
  });

  // 레이더 차트
  new Chart(radarCtx, {
    type: 'radar',
    data: {
      labels: ['예금', '적금', '주식', '코인', '채권', '펀드'],
      datasets: [
        {
          label: '나의 자산',
          data: [10, 9, 7, 6, 5, 4],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: '#ff6384',
          borderWidth: 2,
        },
        {
          label: '평균 자산',
          data: [9, 8, 6, 5, 4, 3],
          backgroundColor: 'rgba(211, 211, 211, 0.5)',
          borderColor: '#d3d3d3',
          borderWidth: 2,
        }
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // 가로세로 비율 유지 안함
      scales: {
        r: {
          beginAtZero: true,
          min: 0,       // 최소 값
          max: 10,      // 최대 값
          ticks: {
            stepSize: 2,  // 2 단위로 설정
          }
        }
      },
    },
  });
};

onMounted(() => {
  createCharts();
});
</script>

<style scoped>
/* 상단 자산 정보 */
.saved-info h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.saved-amount {
  font-size: 36px;
  font-weight: bold;
  color: #ff6384;
}

/* 자산 비교 섹션 */
.asset-comparison-section {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
}

.asset-comparison-section h4 {
  font-size: 18px;
  margin-bottom: 20px;
}

.table-responsive {
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
}

.table th, .table td {
  vertical-align: middle;
  font-size: 14px;
}

.table th {
  font-weight: bold;
}

.table td {
  color: #333;
}

.highlight {
  color: #ff6384;
  font-weight: bold;
}

/* 차트 스타일 */
.chart-size {
  width: 100%;
  height: 400px; /* 차트 크기 조정 */
}

canvas {
  max-width: 100%;
  margin: 0 auto;
  display: block;
}
</style>
