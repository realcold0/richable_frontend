<template>
  <div class="content-container">
    <!-- 상단 자산 정보 -->
    <div class="total-asset">
      <div class="asset-title">{{ userName }}님의 자산 현황 😎</div>
      <div class="asset-amount">{{ currentAsset ? currentAsset.toLocaleString() : 0 }}원</div>
    </div>

    <!-- 전체 자산 비교 -->
    <div class="asset-graph-container">
      <div class="asset-analysis-nav">
        <div class="asset-title">전체 자산 비교</div>
      </div>

      <div class="asset-graph-container2">
        <!-- 20대 평균 자산과 나의 자산 비교 (막대 차트) -->
        <div class="graph-container">
          <div class="graph-container-title">
            {{ userName }}님의 자산은 <br />
            20대 평균보다 <strong style="color:#ff0062">{{ assetDifference > 0 ? assetDifference.toLocaleString() + '만원 많습니다.' : Math.abs(assetDifference).toLocaleString() + '만원 적습니다.' }}</strong>
          </div>
          <canvas id="barChart" class="chart-size"></canvas>
        </div>

        <!-- 카테고리별 자산 비교 (레이더 차트) -->
        <div class="graph-container">
          <div class="graph-container-title">
            {{ userName }}님의 카테고리별 자산 비교
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
            <td>{{ item.myAsset ? item.myAsset.toLocaleString() : 0 }}원</td>
            <td>{{ item.averageAsset ? item.averageAsset.toLocaleString() : 0 }}원</td>
            <td>
              {{ item.difference > 0 ? item.difference.toLocaleString() + '원이 더 적습니다.' : Math.abs(item.difference).toLocaleString() + '원이 더 많습니다.' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 로딩 및 오류 메시지 -->
    <div v-if="loading">로딩 중...</div>
    <div v-if="errorMessage">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import axios from 'axios';

Chart.register(...registerables);

// 사용자 이름
const userName = "김리치";

// 현재 자산 정보 및 자산 차이
const currentAsset = ref(0);
const peerAverageAsset = ref(0); // 20대 평균 자산
const assetDifference = ref(0); // 내 자산과 20대 평균 자산의 차이

// 자산 리스트 (카테고리별)
const assetList = ref([]);

// 로딩 상태 및 오류 메시지
const loading = ref(false);
const errorMessage = ref('');

// JWT 토큰을 localStorage에서 가져오는 함수
const getToken = () => {
  return localStorage.getItem('authToken'); // JWT 토큰을 localStorage에서 가져옴
};

// 자산 현황 (금융 자산 합계) 데이터를 가져오는 함수
const fetchFinancialAssetsSum = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const token = getToken();
    const response = await axios.get('http://localhost:8080/finance/fin/sum', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data && response.data.response && response.data.response.data && response.data.response.data.data) {
      const total = response.data.response.data.data.amount;
      currentAsset.value = total;
    } else {
      errorMessage.value = '자산 데이터가 올바르지 않습니다.';
    }
  } catch (error) {
    errorMessage.value = '금융 자산을 가져오는 데 실패했습니다.';
    console.error('Error fetching financial asset sum:', error);
  } finally {
    loading.value = false;
  }
};

// 20대 평균 자산 데이터를 가져오는 함수
const fetchPeerData = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const token = getToken();
    const response = await axios.get('http://localhost:8080/finance/peer', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = response.data.response.data;
    peerAverageAsset.value = data.spotAvgAmount;
    assetDifference.value = (currentAsset.value - peerAverageAsset.value) / 10000; // 만원 단위로 차이 계산
  } catch (error) {
    errorMessage.value = '동료 자산 데이터를 가져오는 데 실패했습니다.';
    console.error('Error fetching peer data:', error);
  } finally {
    loading.value = false;
  }
};

// 금융 자산별 또래 자산 비교 데이터를 가져오는 함수
const fetchPeerFinanceData = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const token = getToken();
    const response = await axios.get('http://localhost:8080/finance/peer/finance', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const financeData = response.data.response.data;

    if (Array.isArray(financeData)) {
      assetList.value = financeData.map(item => ({
        category: item.category,
        myAsset: item.bsAmount,
        averageAsset: item.spotAvgAmount,
        difference: item.bsAmount - item.spotAvgAmount
      }));
    } else {
      console.error("Expected an array but got: ", financeData);
      errorMessage.value = "예상한 배열을 받지 못했습니다.";
      assetList.value = [];
    }
  } catch (error) {
    errorMessage.value = '금융 자산 비교 데이터를 가져오는 데 실패했습니다.';
    console.error('Error fetching peer finance data:', error);
  } finally {
    loading.value = false;
  }
};

// 차트 생성 함수
const createCharts = () => {
  const barCtx = document.getElementById('barChart').getContext('2d');
  const radarCtx = document.getElementById('radarChart').getContext('2d');

  // 카테고리별 자산 데이터 가져오기
  const categories = assetList.value.map(item => item.category);
  const myAssets = assetList.value.map(item => item.myAsset / 10000);
  const avgAssets = assetList.value.map(item => item.averageAsset / 10000);

  // 그라디언트 색상 설정
  const gradientBar = barCtx.createLinearGradient(0, 0, 0, 400);
  gradientBar.addColorStop(0, '#ff0062');
  gradientBar.addColorStop(1, '#ff80b2');

  const gradientRadarMyAssets = radarCtx.createLinearGradient(0, 0, 0, 400);
  gradientRadarMyAssets.addColorStop(0, '#ff6384');
  gradientRadarMyAssets.addColorStop(1, '#ff80b2');

  const gradientRadarAvgAssets = radarCtx.createLinearGradient(0, 0, 0, 400);
  gradientRadarAvgAssets.addColorStop(0, '#4bc0c0');
  gradientRadarAvgAssets.addColorStop(1, '#80e1e1');

  // 막대 차트
  new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: ['20대 평균', '나의 자산'],
      datasets: [
        {
          label: '자산 비교',
          data: [peerAverageAsset.value, currentAsset.value],
          backgroundColor: [gradientBar, 'rgba(255, 0, 98, 0.7)'],
          borderColor: '#ff0062',
          borderWidth: 2,
          hoverBorderWidth: 3, // 호버 시 강조 효과
          hoverBorderColor: '#ff4081', // 호버 시 색상
          borderRadius: 20, // 막대 모서리 둥글게
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          display: true,
          beginAtZero: true,
          grid: {
            drawBorder: true,
            color: 'rgba(200, 200, 200, 0.3)', // y축 그리드 라인 색상
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#666',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: '#ff4081', // 툴팁 배경색
          titleFont: {
            size: 16,
          },
          bodyFont: {
            size: 14,
          },
        },
      },
    },
  });

  // 레이더 차트
  new Chart(radarCtx, {
    type: 'radar',
    data: {
      labels: categories,
      datasets: [
        {
          label: '나의 자산',
          data: myAssets,
          backgroundColor: gradientRadarMyAssets,
          borderColor: '#ff6384',
          borderWidth: 2,
          pointBackgroundColor: '#ff6384', // 포인트 색상
          pointHoverRadius: 7, // 포인트 호버 반경
          pointHoverBackgroundColor: '#ff0062', // 포인트 호버 색상
        },
        {
          label: '평균 자산',
          data: avgAssets,
          backgroundColor: gradientRadarAvgAssets,
          borderColor: '#4bc0c0',
          borderWidth: 2,
          pointBackgroundColor: '#4bc0c0', // 포인트 색상
          pointHoverRadius: 7, // 포인트 호버 반경
          pointHoverBackgroundColor: '#2bc0c0', // 포인트 호버 색상
        }
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          min: 0,
          max: Math.max(...myAssets, ...avgAssets),
          ticks: {
            stepSize: 1000,
            font: {
              size: 11,
            }
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            font: {
              size: 14,
              family: "'Pretendard', sans-serif",
            }
          }
        }
      }
    },
  });
};

// 데이터 가져오기 후 차트 생성 및 테이블 반영
onMounted(async () => {
  await fetchFinancialAssetsSum();
  await fetchPeerData();
  await fetchPeerFinanceData();
  createCharts(); // 차트 생성을 데이터 fetch 후에 실행
});
</script>

<style scoped>
* {
  text-align: center;
  color: #19181d;
  font-family: 'Pretendard', sans-serif;
}

.content-container {
  margin: 40px auto;
  max-width: 1440px;
  padding: 0 40px;
}

.total-asset {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 40px;
}

.asset-title {
  font-size: 20px;
  font-weight: 500;
  margin-top: 10px;
}

.asset-amount {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 10px;
}

.asset-graph-container {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.asset-analysis-nav {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.graph-container-title {
  font-size: 18px;
  padding: 30px;
  background-color: #f9f9f9;
  border: 1px solid #f8f8f8;
  color: var(--black-default, #19181D);
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px;
  border-radius: 20px;
}

.asset-graph-container2 {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.graph-container {
  margin: 0 20px;
  width: 450px; /* 폭 조정 */
  height: 400px; /* 높이 조정 */
}

.chart-size {
  margin-top: 20px;
  border: 1px solid #f8f8f8;
  border-radius: 20px;
  width: 100%;
  height: 300px; /* 차트 크기 축소 */
}

.compare-table {
  margin-top: 150px;
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
</style>
