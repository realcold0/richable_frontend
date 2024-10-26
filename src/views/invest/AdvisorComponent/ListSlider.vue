<template>
  <div
    class="scroll-container"
    ref="scrollContainer"
    @mousedown="startDragging"
    @mousemove="onDragging"
    @mouseup="stopDragging"
    @mouseleave="stopDragging"
    @touchstart="startDragging"
    @touchmove="onDragging"
    @touchend="stopDragging"
  >
    <div class="scroll-item" v-for="(product, index) in products" :key="index">
      <div class="custom-card">
        <div class="card-body">
          <p :class="getRiskClass(product.prodCategroy)">
            위험도 {{ getRiskLevel(product.prodCategroy) }}
          </p>
          <div class="product-name mb-2 text-muted">{{ product.name }}</div>
          <div style="display: flex; justify-content: space-between">
            <p class="product-price">
              <strong>{{ product.price.toLocaleString() }}원</strong>
            </p>
            <p class="unit-price text-muted">단위당 가격</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { defineProps } from 'vue'

const props = defineProps({
  products: {
    type: Array,
    required: true
  }
})

const scrollContainer = ref(null)
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

// 마우스 드래그 시작 시 호출
const startDragging = (e) => {
  isDragging.value = true
  startX.value = e.pageX || e.touches[0].pageX
  scrollLeft.value = scrollContainer.value.scrollLeft
}

// 마우스 드래그 중일 때 호출
const onDragging = (e) => {
  if (!isDragging.value) return
  const x = e.pageX || e.touches[0].pageX
  const walk = (x - startX.value) * 1.5
  scrollContainer.value.scrollLeft = scrollLeft.value - walk
}

// 마우스 드래그 끝났을 때 호출
const stopDragging = () => {
  isDragging.value = false
}

// 위험도 관련 함수들
const getRiskLevel = (category) => {
  if (category === '채권') return '중'
  if (category === '주식') return '상'
  if (category === '코인') return '상'
  return '알 수 없음'
}

const getRiskClass = (category) => {
  if (category === '채권') return 'risk-medium'
  if (category === '주식') return 'risk-high'
  if (category === '코인') return 'risk-high'
  return ''
}
</script>

<style scoped>
.scroll-container {
  display: flex;
  overflow-x: auto;
  gap: 10px;
  padding: 10px;
  scroll-behavior: smooth;
  cursor: grab;
}

.scroll-container:active {
  cursor: grabbing;
}

.scroll-item {
  flex: 0 0 calc(25% - 10px);
  min-width: calc(25% - 10px);
  scroll-snap-align: start;
}

.scroll-container::-webkit-scrollbar {
  display: none;
}

.custom-card {
  height: 180px;
  display: flex;
  width: 100%;
  padding: 20px;
  flex-direction: column;
  gap: 17px;
  border-radius: 12px;
  background-color: #f9f9f9;
  text-align: left;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
}

.risk-medium {
  color: orange;
}

.risk-high {
  color: red;
}

.product-name {
  color: var(--3, #414158);
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;
}

.product-price {
  color: #19181d;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 500;
}

.unit-price {
  color: var(--2, #8a8aa8);
  text-align: right;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 400;
}
</style>
