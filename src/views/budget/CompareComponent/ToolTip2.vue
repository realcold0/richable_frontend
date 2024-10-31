<template>
  <div class="tooltip-box">
    <button
      class="tool-btn"
      ref="tooltipButton2"
      type="button"
      data-bs-toggle="tooltip"
      data-bs-placement="right"
    >
      <font-awesome-icon icon="circle-question" style="font-size: 25px" />
    </button>
  </div>
</template>

<script setup>
import { onMounted, nextTick, ref } from 'vue'
import { Tooltip as BootstrapTooltip } from 'bootstrap'

const tooltipButton2 = ref(null) // 툴팁 버튼
const tooltipInstance2 = ref(null) // 툴팁 인스턴스
const tooltipMessage2 = ref('이번달에 아낀 소비를 6개월 뒤 까지 누적으로 합산합니다.')

onMounted(() => {
  nextTick(() => {
    // 첫 번째 툴팁 초기화
    if (tooltipButton2.value) {
      tooltipButton2.value.setAttribute('title', tooltipMessage2.value)
      tooltipInstance2.value = new BootstrapTooltip(tooltipButton2.value)
    }
  })
})
</script>

<style scoped>
.tooltip-box,
.tooltip-box2 {
  position: absolute;
  top: 10px; /* 그래프 상단에 맞추기 위한 값 */
  right: 10px; /* 그래프 우측에 맞추기 위한 값 */
  z-index: 10;
  display: flex;
  justify-content: flex-end; /* 우측 정렬 */
  align-items: flex-start; /* 상단 정렬 */
}

.tooltip-inner {
  font-family: 'Pretendard';
  max-width: 400px !important;
  white-space: normal !important;
  font-size: 12px;
}
</style>
