<template>
  <div class="goal-card" :draggable="true" @dragstart="onDragStart" @dragover.prevent @drop="onDrop"
    @click="openDetail">
    <p class="goal-index">{{ index + 1 }}. {{ goal.title }}</p>
    <p class="goal-amount">
      {{ goal.gather.toLocaleString() }}원 / {{ goal.totalAmount.toLocaleString() }}원
    </p>
    <div class="progress-bar">
      <div class="progress" :style="{ width: (goal.gather / goal.totalAmount) * 100 + '%' }"></div>
    </div>
    <p class="goal-progress">
      {{ ((goal.gather / goal.totalAmount) * 100).toFixed(2) }}% 달성
    </p>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

// props: 부모 컴포넌트에서 받아오는 정보
const props = defineProps({
  goal: Object,
  index: Number
})

const emit = defineEmits(['dragstart', 'drop', 'openDetail'])

// 드래그 시작 시 부모에게 알림
const onDragStart = (event) => {
  emit('dragstart', props.goal, event)
}

// 드래그 드롭 시 호출
const onDrop = () => {
  emit('drop', props.goal)
}

// 카드 클릭 시 세부 정보 모달 열기
const openDetail = () => {
  emit('openDetail', props.goal)
}
</script>

<style scoped>
.goal-card {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  font-size: 18px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.goal-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.progress-bar {
  width: 100%;
  background-color: #e0e0e0;
  height: 20px;
  border-radius: 10px;
  margin: 15px 0;
}

.progress {
  background: linear-gradient(90deg, #ffb9c9, #ff6584);
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.goal-index {
  font-weight: bold;
  font-size: 22px;
  color: #414158;
}

.goal-amount {
  font-size: 18px;
  color: #8a8aa8;
}

.goal-progress {
  font-size: 16px;
  color: #414158;
  margin-top: 10px;
}
</style>