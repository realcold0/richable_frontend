<template>
  <!-- 월간 네비게이션 -->
  <div class="month-navigation text-center">
    <!-- 이전 달 버튼 -->
    <button @click="handlePreviousMonth" class="btn custom-btn-left"></button>
    <div>{{ curMonth }}월</div>
    <!-- 다음 달 버튼 -->
    <button @click="handleNextMonth" class="btn custom-btn-right"></button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  curMonth: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['previous-month', 'next-month'])

// 이벤트를 발생시키는 핸들러 함수
const handlePreviousMonth = () => {
  emit('previous-month')
}

const handleNextMonth = () => {
  emit('next-month')
}
</script>

<style>
.month-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0px;
}
.month-navigation h2 {
  margin: 0 20px;
  font-size: 24px;
}
.custom-btn-left,
.custom-btn-right {
  width: 0;
  height: 0;
  border: 10px solid transparent;
  background: none;
  padding: 0;
  margin: 10px;
}
.custom-btn-left {
  border-right-color: #c0c0c0;
}

.custom-btn-right {
  border-left-color: #c0c0c0;
}
</style>
