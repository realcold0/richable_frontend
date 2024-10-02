<template>
  <div class="content-container">
    <!-- 상단 자산 정보 -->
    <div class="total-asset">
      <div class="asset-title">김리치님의 자산 현황 😎</div>
      <div class="asset-amount">{{ currentAsset.toLocaleString() }}원</div>
    </div>

    <!-- 전체 자산 비교 -->
    <div class="asset-graph-container">
      <div class="asset-analysis-nav">
        <div class="asset-title">전체 자산 비교</div>
      </div>
      
      <div class="asset-graph-container2">
        <div class="graph-container">
          <div class="graph-container-title">
            김리치님의 자산은 <br/>
             20대 평균보다 <strong style="color:#ff0062">{{ assetDifference.toLocaleString() }}만원 많습니다.</strong>
          </div>
          <canvas id="barChart" class="chart-size"></canvas>
        </div>
      
        <div class="graph-container">
          <div class="graph-container-title">
            김리치님의 자산은 <br/>
            20대 평균보다 <strong style="color:#ff0062">{{ assetDifference.toLocaleString() }}만원 많습니다.</strong>
          </div>
          <canvas id="radarChart" class="chart-size"></canvas>
        </div>
      </div>
    </div>



    <!-- 자산 비교 테이블 -->
    <div class="compare-table">
      <table>
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
        borderColor : ['rgba(211, 211, 211)','rgba(255, 0, 98)'],
        borderWidth: 1, // 테두리 두께
        backgroundColor: ['rgba(211, 211, 211, 0.7)', 'rgba(255, 0, 98, 0.7)'], // 투명도 적용
        borderRadius: 20, // 막대 끝을 둥글게 처리
        barThickness: 80, // 막대 두께 설정
      }
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false, // 가로세로 비율 유지 안함
    scales: {
      y: {
        display:false,
        beginAtZero: true,
        grid: {
          display: false, // y축 배경선 숨기기
        },
        ticks: {
          display: false, // y축 눈금 숨기기
        },
      },
      x: {
        grid: {
          display: false, // x축 배경선 숨기기
        },
        ticks: {
          color: '#666', // x축 라벨 색상
          font: {
            size: 16,
            weight: 'bold',
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false, // 범례 숨기기
      },
    },
    animation: {
      onComplete: function () {
        const chartInstance = this.chart,
          ctx = chartInstance.ctx;
        ctx.font = Chart.helpers.fontString(16, 'bold', Chart.defaults.font.family);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = '#666'; // 텍스트 색상 설정

        this.data.datasets.forEach(function (dataset, i) {
          const meta = chartInstance.getDatasetMeta(i);
          meta.data.forEach(function (bar, index) {
            const data = dataset.data[index];
            ctx.fillText(data.toLocaleString(), bar.x, bar.y - 10); // 막대 위에 값 표시
          });
        });
      },
    },
    layout: {
      padding: {
        top: 20, // 차트 상단 여백 설정
        bottom: 0,
      },
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
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: '#ff6384',
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
* {
  text-align: center;
  color: #19181d;
  font-family: 'Pretendard', sans-serif;
}

.content-container{
  margin : 40px auto;
  max-width: 1440px;
  padding : 0 40px; /* 좌우 간격을 40px로 설정하여 1440px에 맞게 배치 */
}

.total-asset{
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 40px; /* 간격을 조금 더 넓힘 */
}

.asset-title{
  font-size: 20px;
  font-weight: 500;
  margin-top: 10px;
}

.asset-amount{
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
}

.asset-graph-container{
  margin-top: 40px; /* 간격을 넓힘 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.asset-analysis-nav{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.graph-container-title{
    font-size: 18px;
    padding: 30px;
    background-color: #f9f9f9;
    border: 1px solid #f8f8f8;
    color: var(--black-default, #19181D);
    text-align: center;
    font-feature-settings: 'dlig' on;
    font-family: Pretendard;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 32px; /* 177.778% */
    border-radius: 20px;
  }

.asset-graph-container2{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 40px 0; /* 위 아래 간격 40px */
}

.graph-container{
  margin: 0 20px; /* 좌우 간격을 20px로 설정하여 컴포넌트 간 균형 맞춤 */
  width:580px;
  height:460px;
}


.chart-size{
  margin-top: 20px;
  border: 1px solid #f8f8f8;
  border-radius: 20px;
  width: 100%;
  height:330px;
}

.compare-table{
  margin-top: 150px; /* 테이블과 위쪽 차트 간 간격을 조금 더 넓힘 */
}

table {
  font-family: pretendard;
  font-size: 18px;
  width: 100%;
  text-align: center;
}

th, td {
  font-size: 18px;
  height: 35px;
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

th {
  font-weight: 600;
  background-color: #f9f9f9;
  color: #333;
}

td {
  font-size: 16px;
  color: #555;
}

@media (max-width: 768px) {
  .asset-graph-wrapper {
    grid-template-columns: 1fr;
  }
  
  .graph-container {
    margin: 0 auto;
  }
}
</style>
