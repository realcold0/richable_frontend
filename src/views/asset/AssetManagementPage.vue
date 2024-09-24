<!-- RC-P-09 : 자산 항목 관리 페이지 -->
<template>
  <div>
    <div class="tab-bar">
      <ul class="nav nav-tabs">
        <li class="nav-item nav-link" @click="selectedTab = 'tab1'" :class="{ active: selectedTab === 'tab1' }">
          <a>금융 자산 현황</a>
        </li>
        <li class="nav-item nav-link" @click="selectedTab = 'tab2'" :class="{ active: selectedTab === 'tab2' }">
          <a>현물 자산 포함</a>
        </li>
        <div class="tooltip-box">
          <button class="tool-btn" ref="tooltipButton" type="button" data-bs-toggle="tooltip" data-bs-placement="left"
            :title="tooltipMessage">
            <font-awesome-icon icon="circle-question" style="font-size: 25px;" />
          </button>
        </div>
      </ul>

    </div>
    <div class="tab-content">
      <div class="tab-page" v-if="selectedTab === 'tab1'">
        <div class="total-asset">
          <div class="asset-title">김리치님의 총 금융 자산 현황 😎</div>
          <div class="asset-amount">12,100,000원</div>
        </div>
        <div class="asset-list">
          <div class="list-title">금융 자산 목록 <font-awesome-icon icon="square-plus" style="color: #C30044;" /></div>
          <div class="list-box">
            <div class="asset-item">
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 18px;">예/적금</div>
                <div style="color:#C30044; font-size: 16px; margin-left: 4px;"><font-awesome-icon
                    icon="pen-to-square" /></div>
              </div>
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 24px; color: #FF0062;">11,000,000</div>
                <div style="font-weight: bold; font-size: 18px; color: #8A8AA8; margin-left: 4px;"> 원</div>
              </div>
              <div
                style="display: flex; justify-content: center; align-items: center; font-size: 60px; margin-top:8px;">
                <font-awesome-icon icon="piggy-bank" />
              </div>
            </div>
            <div class="asset-item">
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 18px;">주식</div>
                <div style="color:#C30044; font-size: 16px; margin-left: 4px;"><font-awesome-icon
                    icon="pen-to-square" /></div>
              </div>
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 24px; color: #FF0062;">11,000,000</div>
                <div style="font-weight: bold; font-size: 18px; color: #8A8AA8; margin-left: 4px;"> 원</div>
              </div>
              <div
                style="display: flex; justify-content: center; align-items: center; font-size: 60px; margin-top:8px;">
                <font-awesome-icon icon="chart-line" />
              </div>
            </div>
            <div class="asset-item">
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 18px;">채권</div>
                <div style="color:#C30044; font-size: 16px; margin-left: 4px;"><font-awesome-icon
                    icon="pen-to-square" /></div>
              </div>
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 24px; color: #FF0062;">11,000,000</div>
                <div style="font-weight: bold; font-size: 18px; color: #8A8AA8; margin-left: 4px;"> 원</div>
              </div>
              <div
                style="display: flex; justify-content: center; align-items: center; font-size: 60px; margin-top:8px;">
                <font-awesome-icon icon="money-check-dollar" />
              </div>
            </div>
            <div class="asset-item">
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 18px;">코인</div>
                <div style="color:#C30044; font-size: 16px; margin-left: 4px;"><font-awesome-icon
                    icon="pen-to-square" /></div>
              </div>
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 24px; color: #FF0062;">11,000,000</div>
                <div style="font-weight: bold; font-size: 18px; color: #8A8AA8; margin-left: 4px;"> 원</div>
              </div>
              <div
                style="display: flex; justify-content: center; align-items: center; font-size: 60px; margin-top:8px;">
                <font-awesome-icon icon="fa-brands fa-bitcoin" />
              </div>
            </div>
            <div class="asset-item">
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 18px;">현금</div>
                <div style="color:#C30044; font-size: 16px; margin-left: 4px;"><font-awesome-icon
                    icon="pen-to-square" /></div>
              </div>
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 24px; color: #FF0062;">11,000,000</div>
                <div style="font-weight: bold; font-size: 18px; color: #8A8AA8; margin-left: 4px;"> 원</div>
              </div>
              <div
                style="display: flex; justify-content: center; align-items: center; font-size: 60px; margin-top:8px;">
                <font-awesome-icon icon="money-bill" />
              </div>
            </div>
          </div>
        </div>
        <div class="asset-chart">
          <div class="list-title">총 금융 자산 분포</div>
          <div class="chart-box">
            <canvas ref="pieChart"></canvas>
          </div>
        </div>
      </div>
      <div class="tab-page" v-if="selectedTab === 'tab2'">
        <div class="total-asset">
          <div class="asset-title">김리치님의 총 현물 자산 현황 😎</div>
          <div class="asset-amount">25,100,000원</div>
        </div>
        <div class="asset-list">
          <div class="list-title">금융 자산 목록 <font-awesome-icon icon="square-plus" style="color: #C30044;" /></div>
          <div class="list-box">
            <div class="asset-item">
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 18px;">예/적금</div>
                <div style="color:#C30044; font-size: 16px; margin-left: 4px;"><font-awesome-icon
                    icon="pen-to-square" /></div>
              </div>
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 24px; color: #FF0062;">11,000,000</div>
                <div style="font-weight: bold; font-size: 18px; color: #8A8AA8; margin-left: 4px;"> 원</div>
              </div>
              <div
                style="display: flex; justify-content: center; align-items: center; font-size: 60px; margin-top:8px;">
                <font-awesome-icon icon="piggy-bank" />
              </div>
            </div>
            <div class="asset-item">
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 18px;">주식</div>
                <div style="color:#C30044; font-size: 16px; margin-left: 4px;"><font-awesome-icon
                    icon="pen-to-square" /></div>
              </div>
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 24px; color: #FF0062;">11,000,000</div>
                <div style="font-weight: bold; font-size: 18px; color: #8A8AA8; margin-left: 4px;"> 원</div>
              </div>
              <div
                style="display: flex; justify-content: center; align-items: center; font-size: 60px; margin-top:8px;">
                <font-awesome-icon icon="chart-line" />
              </div>
            </div>
            <div class="asset-item">
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 18px;">채권</div>
                <div style="color:#C30044; font-size: 16px; margin-left: 4px;"><font-awesome-icon
                    icon="pen-to-square" /></div>
              </div>
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 24px; color: #FF0062;">11,000,000</div>
                <div style="font-weight: bold; font-size: 18px; color: #8A8AA8; margin-left: 4px;"> 원</div>
              </div>
              <div
                style="display: flex; justify-content: center; align-items: center; font-size: 60px; margin-top:8px;">
                <font-awesome-icon icon="money-check-dollar" />
              </div>
            </div>
            <div class="asset-item">
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 18px;">코인</div>
                <div style="color:#C30044; font-size: 16px; margin-left: 4px;"><font-awesome-icon
                    icon="pen-to-square" /></div>
              </div>
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 24px; color: #FF0062;">11,000,000</div>
                <div style="font-weight: bold; font-size: 18px; color: #8A8AA8; margin-left: 4px;"> 원</div>
              </div>
              <div
                style="display: flex; justify-content: center; align-items: center; font-size: 60px; margin-top:8px;">
                <font-awesome-icon icon="fa-brands fa-bitcoin" />
              </div>
            </div>
            <div class="asset-item">
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 18px;">현금</div>
                <div style="color:#C30044; font-size: 16px; margin-left: 4px;"><font-awesome-icon
                    icon="pen-to-square" /></div>
              </div>
              <div style="display: flex; justify-content: center; align-items: center;">
                <div style="font-weight: bold; font-size: 24px; color: #FF0062;">11,000,000</div>
                <div style="font-weight: bold; font-size: 18px; color: #8A8AA8; margin-left: 4px;"> 원</div>
              </div>
              <div
                style="display: flex; justify-content: center; align-items: center; font-size: 60px; margin-top:8px;">
                <font-awesome-icon icon="money-bill" />
              </div>
            </div>
          </div>
          <div class="asset-chart">
            <div class="list-title">총 현물 자산 분포</div>
            <div class="chart-box">
              <canvas ref="pieChart2"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, nextTick } from 'vue';
import { Tooltip as BootstrapTooltip } from 'bootstrap';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';

// Chart.js에 필요한 컴포넌트(컨트롤러, 요소, 플러그인)를 등록
Chart.register(PieController, ArcElement, Tooltip, Legend);

const selectedTab = ref('tab1');
const tooltipButton = ref(null);
const tooltipInstance = ref(null);
const tooltipMessage = ref('금융 자산은 [예/적금], [주식], [채권], [코인], [현금]을 포함합니다.');


const updateTooltipMessage = async () => {
  // selectedTab에 따라 툴팁 메시지 변경
  tooltipMessage.value = selectedTab.value === 'tab1' ? '금융 자산은 [예/적금], [주식], [채권], [코인], [현금]을 포함합니다.' : '현물 자산은 [자동차], [전자기기], [브랜드], [명품], [기타]를 포함합니다.';

  // 기존 툴팁이 존재하는 경우 메시지만 업데이트
  if (tooltipInstance.value) {
    tooltipInstance.value.dispose(); // 기존 툴팁 삭제
  }

  // 새로운 title을 설정 후 툴팁 다시 생성
  tooltipButton.value.setAttribute('title', tooltipMessage.value); // 새로운 메시지 설정
  tooltipInstance.value = new BootstrapTooltip(tooltipButton.value); // 새 툴팁 생성
};

const pieChart = ref(null);
const pieChart2 = ref(null); // tab2의 차트를 위한 ref 추가
let chartInstance = null;
let chartInstance2 = null; // tab2 차트를 위한 인스턴스 추가

// 파이 차트 설정
const renderPieChart = async () => {
  await nextTick(); // ref가 제대로 연결된 후 차트를 렌더링하기 위해 nextTick 사용

  if (chartInstance) {
    chartInstance.destroy(); // 차트를 다시 렌더링할 때 이전 인스턴스 제거
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
      maintainAspectRatio: false, // 차트 가로세로 비율을 유지하지 않음
      plugins: {
        legend: {
          position: 'bottom',  // 범례를 아래로 이동
           labels: {
            boxWidth: 70,  // 범례 아이콘의 너비 설정 (기본값: 40)
            padding: 100,  // 범례 항목과 차트 사이의 간격 설정
            font: {
              size: 14,   // 글꼴 크기 설정
              weight: 'bold',  // 글꼴 두께 설정
            },
          },
        },
      },
      layout: {
        padding: {
          top: 10,  // 추가 여백 (차트 내부 여백)
          bottom: 10,  // 하단 여백 추가
        },
      },
    },
  });
};

// 탭이 변경될 때 차트를 렌더링하는 함수
watch(selectedTab, (newTab) => {
  if (newTab === 'tab1') {
    renderPieChart(); // '금융 자산 현황' 탭일 때만 차트를 렌더링
  }
});

onMounted(() => {
  updateTooltipMessage();

   // 초기 마운트 시 tab1 차트를 렌더링
  renderPieChart();
});

// selectedTab이 변경될 때마다 툴팁 메시지를 업데이트
watch(selectedTab, updateTooltipMessage);
</script>

<style scoped>
.tab-bar {
    width : 1704px;
    margin-left : 80px;
    margin-top : 80px;
    position: relative;
}

.nav-tabs {
    border-bottom : 2px solid #414158;
}

.nav-item {
    color : #CCCCD6;
    width: 200px;
    height: 57px;
    text-align: center;
    font-size: 18px;
    line-height: 39px;
    border : 1px solid #CCCCD6;
    border-bottom: 1px solid #414158;
}

.nav-item.active {
    background-color: #414158;
    color : white;
    border-bottom: 2px solid #414158;
}

.tooltip-inner {
    white-space: nowrap !important;
}

.tooltip-box {
    position: absolute;
    right: 0;
    top: 0;
}

.tool-btn {
    border: none;
    background-color: white;
    padding-top : 4px;
    margin-top : 12px;
}

.tab-content {
    margin-top: 80px;
    margin-left: 80px;
}

.tab-page {
    
}

.total-asset {
    background-color: #F9F9F9;
    max-width: 1704px;
    height: 150px;
    border-radius: 20px;
    border: 1px solid #F8F8F8;
    text-align: center;
}
.asset-title {
    font-size: 20px;
    margin-top: 36px;
    margin-bottom: 10px;
}

.asset-amount {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 36.5px;
}

.asset-list {
    margin-top: 117px;
}

.list-title {
    margin: 24px auto;
    font-size: 20px;
    font-weight: bold;
}

.list-box {
    display: flex;
    background-color: #FFF2F6;
    border-radius: 10px;
    max-width: 1704px;
    height: 244px;
    margin-bottom: 44px;
    justify-content: space-between;
    align-items: center;
    padding-left: 27px; /* 왼쪽 여백 */
    padding-right: 27px; /* 오른쪽 여백 */
}

.asset-item {
  width: 300px;
  height: 190px;
  background-color: white;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));
  border-radius: 20px;
  padding-top: 28px;
}

.chart-box {
    max-width: 1704px;
    height: 620px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top : 100px;
    padding-bottom: 42.5px;
}

.asset-chart {
    position: relative;
    margin-top: 44px;
    padding-bottom: 80px;
}
</style>

<style>
body {
    font-family: 'Pretendard';
}
.tooltip-inner {
    font-family: 'Pretendard';
    max-width: 400px !important;
    white-space: normal !important;
    font-size: 12px;
}
</style>