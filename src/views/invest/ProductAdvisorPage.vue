<template>
  <div class="container mt-5">
    <!-- 상단 질문 텍스트 -->
    <div class="text-center mb-4">
      <h3>나의 자산 중 여유자금은 얼마일까요?</h3>
      <p class="lead">
        나의 전체 자산 중 바로 투자를 할 수 있는 여유자금은 <strong class="text-danger">1,100,000원</strong>이에요.
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
              stroke-dasharray="25, 100"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div class="chart-label">
            <strong>25%</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- 투자 추천 영역 -->
    <div class="text-center mb-3">
      <h5>여유자금으로 투자하기</h5>
    </div>

    <!-- 추천 카드 리스트 -->
    <div class="row text-center mb-5">
      <div class="col-md-3">
        <div class="card mb-4 shadow-sm">
          <div class="card-body">
            <p class="card-title" style="color: orange;">위험도 중</p>
            <h6 class="card-subtitle mb-2 text-muted">KB주주가치 포커스증권투자신탁</h6>
            <p class="card-text"><strong>10,000원</strong></p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card mb-4 shadow-sm">
          <div class="card-body">
            <p class="card-title" style="color: red;">위험도 상</p>
            <h6 class="card-subtitle mb-2 text-muted">메리츠 증권</h6>
            <p class="card-text"><strong>93,000원</strong></p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card mb-4 shadow-sm">
          <div class="card-body">
            <p class="card-title" style="color: red;">위험도 상</p>
            <h6 class="card-subtitle mb-2 text-muted">KB금융</h6>
            <p class="card-text"><strong>82,300원</strong></p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card mb-4 shadow-sm">
          <div class="card-body">
            <p class="card-title" style="color: red;">위험도 상</p>
            <h6 class="card-subtitle mb-2 text-muted">POSCO</h6>
            <p class="card-text"><strong>82,300원</strong></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
