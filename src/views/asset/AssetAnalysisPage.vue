<template>
  <div>
    <div class="content-container">
      <div class="total-asset">
        <div class="asset-title">김리치님의 총 자산 현황 😎</div>
        <div class="asset-amount">12,100,000원</div>
      </div>

      <!-- 나의 단계 -->
      <div class="asset-level-container">
        <div class="asset-level-title">김리치님은 <strong>씨앗 단계</strong>예요</div>
        <div class="asset-level-sub">0원 ~ 1천만원 이하의 유저입니다.</div>
        <div class="asset-level-img"></div>
      </div>
        
      <div class="asset-analysis-container">
        <div class="asset-analysis-nav">
          <div class="asset-analysis-title" style="font-size: 20px;font-weight: 700;line-height: 150%; letter-spacing: -0.4px;">나의 자산</div>
          <div class="asset-analysis-btn">
            <!-- 체크박스 클릭 이벤트를 통해 값을 업데이트 -->
            <input type="checkbox" v-model="includePhysicalAssets" @change="resetCharts">
            <p>현물자산포함</p>
          </div>
        </div>

        <!-- 체크박스가 선택되지 않았을 때 첫 번째 content 표시 -->
        <div class="asset-analysis-content" v-if="!includePhysicalAssets">

          <div class="asset-analysis-content-container1">
            <div class="asset-analysis-graph-contanier1">
              <p style="margin-top: 30px; color: var(--black-default, #19181D);text-align: center;font-family: Pretendard;font-size: 18px;font-style: normal;font-weight: 600;line-height: 150%;letter-spacing: -0.36px;">
                주식 자산 비중이 <br/> 제일 높아요</p>
              <div class="asset-analysis-graph">
                <canvas ref="pieChart"></canvas>
              </div>
            </div>
            
            <div class="asset-analysis-table-wrapper">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>총 상품자산</th>
                <th>{{ totalAsset }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(asset, index) in paginatedAssets" :key="index" @click="toggleDetails(asset)" class="clickable-row">
                <td>{{ asset.name }}</td>
                <td>{{ asset.amount }}원</td>
              </tr>
              <tr v-if="selectedAsset">
                <td colspan="2" class="details-cell">
                  <div>Details about {{ selectedAsset.name }}: {{ selectedAsset.details }}</div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Bootstrap Pagination -->
          <nav>
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="prevPage">Previous</a>
              </li>
              <li class="page-item disabled">
                <a class="page-link" href="#">Page {{ currentPage }} of {{ totalPages }}</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
              </li>
            </ul>
          </nav>
          </div>
        </div>
          <div class="asset-analysis-content-container2">
            <div class="asset-analysis-content2-title">총자산이 지난달보다 <br/> <strong>10만원 늘었어요</strong></div>
              <div class="asset-analysis-content2-sub">6개월 자산 변동 추이를 보여드려요.</div>
            <div class="asset-analysis-graph-container2">
              <canvas ref="barChart" style="width: 700px; height: 275px;"></canvas>
            </div>
          </div>
        </div>

       <!-- 체크박스가 선택되지 않았을 때 두 번째 content 표시 -->
       <div class="asset-analysis-content" v-if="includePhysicalAssets">
        <div class="asset-analysis-content-container1">
          <div class="asset-analysis-graph-contanier1">
            <p style="margin-top: 30px; color: var(--black-default, #19181D);text-align: center;font-family: Pretendard;font-size: 18px;font-style: normal;font-weight: 600;line-height: 150%;letter-spacing: -0.36px;">
              주식 자산 비중이 <br/> 제일 높아요</p>
            <div class="asset-analysis-graph">
              <canvas ref="pieChart2"></canvas>
            </div>
          </div>
  
            <!-- Table with pagination and collapsible details -->
            <div class="asset-analysis-table-wrapper">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>총 상품자산</th>
                <th>{{ totalAsset }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(asset, index) in paginatedAssets" :key="index" @click="toggleDetails(asset)" class="clickable-row">
                <td>{{ asset.name }}</td>
                <td>{{ asset.amount }}원</td>
              </tr>
              <tr v-if="selectedAsset">
                <td colspan="2" class="details-cell">
                  <div>Details about {{ selectedAsset.name }}: {{ selectedAsset.details }}</div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Bootstrap Pagination -->
          <nav>
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="prevPage">Previous</a>
              </li>
              <li class="page-item disabled">
                <a class="page-link" href="#">Page {{ currentPage }} of {{ totalPages }}</a>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
              </li>
            </ul>
          </nav>
          </div>
          </div>

          <div class="asset-analysis-content-container2">
            <div class="asset-analysis-content2-title">총자산이 지난달보다 <br/> <strong>10만원 늘었어요</strong></div>
              <div class="asset-analysis-content2-sub">6개월 자산 변동 추이를 보여드려요.</div>
            <div class="asset-analysis-graph-container2">
              <canvas ref="barChart" style="width: 700px; height: 275px;"></canvas>
            </div>
          </div>
          </div>
        </div>


      <div class="asset-analysis-container">
        <div class="asset-analysis-nav">
          <div class="asset-analysis-title"  style="font-size: 20px;font-weight: 700;line-height: 150%; letter-spacing: -0.4px;">나의 자산 한 눈에 보기</div>
        </div>

        <div class="graph-container-wrapper">
         
          <div class="graph-container">
            <div class="graph-title">달별 저축</div>
            <div class="graph-sum">1,200,000원</div>
            <canvas class ="graph" ref="lineChart"></canvas>
          </div>

          <div class="graph-container">
            <div class="graph-title">주식 수익률</div>
            <div class="graph-sum">1,200,000원</div>
            <canvas class ="graph" ref="lineChart2"></canvas>
          </div>
          
          <div class="graph-container">
            <div class="graph-title">가상화폐 수익률</div>
            <div class="graph-sum">1,200,000원</div>
            <canvas class ="graph" ref="lineChart3"></canvas>
          </div>

          <div class="graph-container">
            <div class="graph-title">채권 수익률</div>
            <div class="graph-sum">1,200,000원</div>
            <canvas class ="graph" ref="lineChart4"></canvas></div>
          </div>
      </div>


   
</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { Chart, PieController, ArcElement, Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale, LineController, PointElement, LineElement } from 'chart.js';

// Register Chart.js components
Chart.register(PieController, ArcElement, Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale, LineController, PointElement, LineElement);

// Asset and Physical Asset data
const includePhysicalAssets = ref(false);
const totalAsset = ref(12100000);
const assets = ref([
  { name: '예금', amount: 5000000, details: 'This is a bank deposit.' },
  { name: '주식', amount: 3000000, details: 'These are your stocks.' },
  { name: '채권', amount: 2000000, details: 'This is your bond investment.' },
  { name: '코인', amount: 1000000, details: 'These are cryptocurrency holdings.' },
  { name: '현금', amount: 1000000, details: 'This is your available cash.' }
]);
const physicalAssets = ref([
  { name: '자동차', amount: 4000000, details: 'This is your car.' },
  { name: '전자기기', amount: 2000000, details: 'This includes electronics.' },
  { name: '명품', amount: 3000000, details: 'Luxury goods such as branded items.' }
]);

const testData = {
  username: '김리치',
  totalAsset: 12100000,
  financialAssets: [
    { name: '예금', amount: 5000000, details: 'This is a bank deposit.' },
    { name: '주식', amount: 3000000, details: 'These are your stocks.' },
    { name: '채권', amount: 2000000, details: 'This is your bond investment.' },
    { name: '코인', amount: 1000000, details: 'These are cryptocurrency holdings.' },
    { name: '현금', amount: 1000000, details: 'This is your available cash.' }
  ],
  physicalAssets: [
    { name: '자동차', amount: 4000000, details: 'This is your car.' },
    { name: '전자기기', amount: 2000000, details: 'This includes electronics.' },
    { name: '명품', amount: 3000000, details: 'Luxury goods such as branded items.' }
  ],
  userLevel: '씨앗 단계',
  userLevelRange: '0원 ~ 1천만원 이하의 유저입니다.',
  monthlyChanges: [11000000, 11200000, 11400000, 11500000, 12000000, 12100000]
};

// Manage the display of assets based on checkbox state
const displayedAssets = computed(() => {
  return includePhysicalAssets.value ? [...assets.value, ...physicalAssets.value] : assets.value;
});

// Total assets displayed (with or without physical assets)
const totalDisplayedAssets = computed(() => {
  return displayedAssets.value.reduce((sum, asset) => sum + asset.amount, 0);
});

// Pagination for the table
const currentPage = ref(1);
const itemsPerPage = ref(6);
const selectedAsset = ref(null);
const paginatedAssets = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return displayedAssets.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(displayedAssets.value.length / itemsPerPage.value));

// Pagination functions
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

// Toggle asset details
const toggleDetails = (asset) => {
  selectedAsset.value = selectedAsset.value === asset ? null : asset;
};

const lineChart = ref(null);
const lineChart2 = ref(null);
const lineChart3 = ref(null);
const lineChart4 = ref(null);


const barChart = ref(null);
const pieChart = ref(null);
const pieChart2 = ref(null);

let lineChartInstance = null;
let barChartInstance = null; 
let chartInstance = null;
let chartInstance2 = null;


const renderLineChart = async () => {
  await nextTick();
  if (!lineChart.value) return;

  lineChartInstance = new Chart(lineChart.value,  {
    type: 'line',
    data: {
      labels: ['4월', '5월', '6월', '7월', '8월', '오늘'],
      datasets: [{
        // Removed or set label as empty string to hide it
        label: '', // You can also remove this line entirely
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(250, 158, 190, 1)',
        borderColor: 'rgba(250, 158, 190, 1)',
        pointRadius: 3,
        fill: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false // Hides the legend which displays dataset labels
        },
        tooltip: {
          enabled: true
        }
      }
    }
  });
};



const renderLineChart2 = async () => {
  await nextTick();
  if (!lineChart.value) return;

  lineChartInstance = new Chart(lineChart2.value, {
    type: 'line',
    data: {
      labels: ['4월', '5월', '6월', '7월', '8월', '오늘'],
      datasets: [{
        // Removed or set label as empty string to hide it
        label: '', // You can also remove this line entirely
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(250, 158, 190, 1)',
        borderColor: 'rgba(250, 158, 190, 1)',
        pointRadius: 3,
        fill: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false // Hides the legend which displays dataset labels
        },
        tooltip: {
          enabled: true
        }
      }
    }
  });
};

const renderLineChart3 = async () => {
  await nextTick();
  if (!lineChart.value) return;

  lineChartInstance = new Chart(lineChart3.value, {
    type: 'line',
    data: {
      labels: ['4월', '5월', '6월', '7월', '8월', '오늘'],
      datasets: [{
        // Removed or set label as empty string to hide it
        label: '', // You can also remove this line entirely
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(250, 158, 190, 1)',
        borderColor: 'rgba(250, 158, 190, 1)',
        pointRadius: 3,
        fill: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false // Hides the legend which displays dataset labels
        },
        tooltip: {
          enabled: true
        }
      }
    }
  });
};


const renderLineChart4 = async () => {
  await nextTick();
  if (!lineChart.value) return;

  lineChartInstance = new Chart(lineChart4.value, {
    type: 'line',
    data: {
      labels: ['4월', '5월', '6월', '7월', '8월', '오늘'],
      datasets: [{
        // Removed or set label as empty string to hide it
        label: '', // You can also remove this line entirely
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(250, 158, 190, 1)',
        borderColor: 'rgba(250, 158, 190, 1)',
        pointRadius: 3,
        fill: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false // Hides the legend which displays dataset labels
        },
        tooltip: {
          enabled: true
        }
      }
    }
  });
};

const renderBarChart = async () => {
  await nextTick();

  if (!barChart.value) {
    console.error('Cannot find barChart canvas element.');
    return;
  }

  if (barChartInstance) {
    barChartInstance.destroy();
  }

  barChartInstance = new Chart(barChart.value, {
    type: 'bar',
    data: {
      labels: ['04월', '05월', '06월', '7월', '08월', '오늘'],
      datasets: [{
        data: [4900, 4900, 5800, 5800, 4900, 5900],
        backgroundColor: [
          'rgba(220,212,212,0.63)',
          'rgba(220,212,212,0.63)',
          'rgba(220,212,212,0.63)',
          'rgba(220,212,212,0.63)',
          'rgba(220,212,212,0.63)',
          'rgba(255,0,98,0.67)'
        ],
        borderColor: [
          'rgba(225,225,225,0)',
          'rgba(225,225,225,0)',
          'rgba(225,225,225,0)',
          'rgba(225,225,225,0)',
          'rgba(225,225,225,0)',
          'rgba(255,0,98,0.67)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 80, // 상단 패딩을 40px로 설정
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false
        }
      },
      scales: {
        y: {
          display: false,
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    },
    plugins: [{
      afterDatasetsDraw: (chart) => {
        const ctx = chart.ctx;
        chart.data.datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          meta.data.forEach((bar, index) => {
            const data = dataset.data[index];

            const radius = 5; // 둥근 모서리를 위한 반지름 값
            const { x, y, width, base } = bar.getProps(['x', 'y', 'width', 'base']);

            const barWidth = width;
            const barHeight = base - y;
            const cornerRadius = Math.min(radius, barHeight / 2);

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x - barWidth / 2, base);
            ctx.lineTo(x - barWidth / 2, y + cornerRadius);
            ctx.quadraticCurveTo(x - barWidth / 2, y, x - barWidth / 2 + cornerRadius, y);
            ctx.lineTo(x + barWidth / 2 - cornerRadius, y);
            ctx.quadraticCurveTo(x + barWidth / 2, y, x + barWidth / 2, y + cornerRadius);
            ctx.lineTo(x + barWidth / 2, base);
            ctx.fillStyle = dataset.backgroundColor[index];
            ctx.fill();

            if (dataset.borderColor[index] && dataset.borderWidth > 0) {
              ctx.strokeStyle = dataset.borderColor[index];
              ctx.lineWidth = dataset.borderWidth;
              ctx.stroke();
            }

            // 텍스트 렌더링
            ctx.fillStyle = '#767676';  // 텍스트 색상
            ctx.font = ' 10px pretendard';  // 텍스트 폰트 설정
            ctx.textAlign = 'center';
            // 텍스트 위치를 더 위로 이동
            ctx.fillText(`${data}만원`, x, y - 30);  // 텍스트 위치를 더 위로 설정
          });
        });
      }
    }]
  });
};





// 금융 자산 차트 설정
const renderPieChart = async () => {
  await nextTick();

  if (chartInstance) {
    chartInstance.destroy();
  }
  
  chartInstance = new Chart(pieChart.value, {
    type: 'doughnut',
    
    data: {
      labels: ['예/적금', '주식', '채권', '코인', '현금'],
      datasets: [
        {
          data: [25, 35, 20, 10, 10],
          backgroundColor: ['#C30044', '#FF0062', '#DA0052', '#FFF2F6', '#DA0052'],
        },
      ],
    },
    
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    },
  });
};

// 현물 자산 차트 설정
const renderPieChart2 = async () => {
  await nextTick();
  if (chartInstance2) {
    chartInstance2.destroy();
  }
  chartInstance2 = new Chart(pieChart2.value, {
    type: 'doughnut',
    data: {
    labels: ['예/적금', '주식', '채권', '코인', '현금', '자동차', '전자기기', '브랜드', '명품', '기타'],
datasets: [
  {
    data: [15, 50, 20, 15, 10, 5, 10, 20, 15, 10],
    backgroundColor: [
    '#C30044',  // 예/적금
      '#FF0062',  // 주식
      '#DA0052',  // 채권
      '#FFF2F6',  // 코인
      '#DA0052',  // 현금
      '#FF3366',  // 자동차 - 추가 색상
      '#FF6699',  // 전자기기 - 추가 색상
      '#FF99CC',  // 브랜드 - 추가 색상
      '#FFCCE5',  // 명품 - 추가 색상
      '#FF80B3'   // 기타 - 추가 색상
    ],
  }
]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    },
  });
};

// 차트를 리셋하고 적절한 차트를 다시 렌더링하는 함수
const resetCharts = () => {
  if (includePhysicalAssets.value) {
    renderPieChart2();  // 현물 자산 포함 시 pieChart2 렌더링
    renderBarChart();
  } else {
    renderPieChart();  // 금융 자산만 표시할 때 pieChart 렌더링
    renderBarChart();
  }
};

onMounted(() => {
  renderPieChart();
  renderPieChart2();
  renderBarChart();
  renderLineChart();
  renderLineChart2();
  renderLineChart3();
  renderLineChart4();
  resetCharts();
});
</script>

<style scoped>
* {
  text-align: center;
  color: #19181d;
  font-family: 'Pretendard', sans-serif;
}

.content-container {
  margin: 80px;
}

.total-asset, .asset-analysis-container, .asset-level-container {
  max-width: 1704px;
  border-radius: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 40px;
}



.total-asset {
  background-color: #f9f9f9;
  height: 150px;
  border: 1px solid #f8f8f8;
}

.asset-title, .asset-analysis-title, .asset-level-title {
  font-size: 20px;
  font-weight: 500;
  line-height: 150%;
  color: var(--black-default, #19181D);
  letter-spacing: -0.4px;
  text-align: center;
  margin-top: 36px;
}

.asset-amount {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 36.5px;
  line-height: 150%;
  margin-top: 10px;
  letter-spacing: -0.48px;
}

.asset-level-container {
  background-color: #fff;
  padding: 30px;
  border: 2px solid #e4ebf0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.asset-level-sub {
  margin-top: 5px;
  font-size: 18px;
  color: var(--3, #414158);
  font-weight: 400;
  letter-spacing: -0.36px;
}

.asset-level-img {
  margin-top: 10px;
  background-image: url('@/assets/images/level-seed-rich.png');
  background-size: cover;
  width: 90px;
  height: 126px;
  padding: 20px;
}

.asset-analysis-container {
  background-color: #fff;
  padding: 50px;
  border: 2px solid #e4ebf0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.asset-analysis-nav {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.asset-analysis-btn {
  display: flex;
  align-items: center;
}

.asset-analysis-btn input {
  margin-right: 10px;
}

.asset-analysis-btn p {
  font-size: 16px;
  color: #333;
}

.asset-analysis-content{

  height: 930px;
  padding: 30px;
}

.asset-analysis-content-container1{
  border-radius: 10px;
  background-color: #f9f9f9;
  display: flex;
  padding : 10px 30px;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  width: 1000px;
  height : 400px;
}

.asset-analysis-content-container2{

  display : flex; 
  align-items: center;
  margin-top: 40px;
  width: 1000px;
  height : 412px;
  flex-direction: column;
   justify-content: center

}


.asset-analysis-graph-container2, .asset-analysis-graph-contanier1  {
  width: 470px;
  height: 370px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.asset-analysis-graph{
  height: 250px;
  display: flex;
  padding: 10px;
  align-items: center;
  gap: 10px;
}

.asset-analysis-table {
  /* flex: 1; */
  
  margin-left: 40px;
  width: 387px;
  padding: 20px 10px;

}

.asset-analysis-table table {
  width : 300px;
}

.asset-analysis-table th, .asset-analysis-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.asset-analysis-table th {
  font-weight: 600;
  background-color: #f9f9f9;
  color: #333;
}

.asset-analysis-table td {
  font-size: 16px;
  color: #555;
}

.graph-container-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  width: 946px;
}

.graph-container {
  width: 400px;
  height: 350px;
  font-family: pretendard;

}

.graph-container canvas {
  width: 100%;
  height: 100%;
}

.graph-title {
  color: #0D171C;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
}

.graph-sum {
  font-family: pretendard;
  color: #0D171C;
  font-size: 18px;
  font-weight: 700;
  line-height: 40px;
}

.asset-analysis-content2-title {
  color: var(--black-default, #19181D);
  font-size: 18px;
  font-weight: 500;
  line-height: 150%; /* 27px */
  letter-spacing: -0.36px;
}

.asset-analysis-content2-sub {
  margin-top: 10px;
  color: var(--2, #8A8AA8);
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.32px;
}

@media (max-width: 768px) {
  .graph-container-wrapper {
    grid-template-columns: 1fr;
  }

  .content-container {
    margin: 20px;
  }
}
</style>