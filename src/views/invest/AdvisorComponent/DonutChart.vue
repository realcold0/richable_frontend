<template>
  <!-- 도넛 차트 영역 -->
  <div class="d-flex justify-content-center align-items-center mb-5 chart-container1">
    <div class="chart-container2">
      <!-- ToolTip 컴포넌트 사용 -->
      <ToolTip :tooltipMessage="tooltipMessage" position="right" />
      <div class="donut-chart">
        <svg viewBox="0 0 36 36">
          <path
            class="circle-bg"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            class="circle"
            :stroke-dasharray="`${availablePercentage}, 100`"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div class="chart-label">{{ availablePercentage.toFixed(0) }}%</div>
      </div>
    </div>

    <!-- 범례 추가 -->
    <div class="legend-container d-flex justify-content-center align-items-center">
      <div class="legend-item"><span class="legend-box total"></span> 총 자산</div>
      <div class="legend-item"><span class="legend-box available"></span> 여유 자금</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import ToolTip from './ToolTip.vue'

const props = defineProps({
  tooltipMessage: {
    type: String,
    required: true
  },
  availablePercentage: {
    type: Number,
    required: true
  }
})
</script>

<style>
.chart-container1 {
  height: 320px;
  margin-top: 18px;
  border-radius: 20px;
  border: 1px solid #e4ebf0;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.chart-container2 {
  position: relative;
  width: 200px;
  height: 200px;
  position: relative;
}

.donut-chart {
  width: 100%;
  height: 100%;
  position: relative;
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

.chart-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
  color: var(--3, #414158);
}

.legend-container {
  margin-top: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-right: 15px;
  font-size: 14px;
}

.legend-box {
  border-radius: 20%;
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 5px;
}

.legend-box.total {
  background-color: #eee;
}

.legend-box.available {
  background-color: #ff0062;
}
</style>
