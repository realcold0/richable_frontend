<template>
  <div class="text-center total-asset">
    <div class="asset-title">
      {{
        saveAmount.value - possibleSaveAmount.value > 0
          ? '이번 달에 아낄 수 있었던 비용이에요 😢'
          : '이번달에 아낀 비용이에요 😲'
      }}
    </div>
    <div class="asset-amount">{{ Math.abs(couldsaving).toLocaleString() }}원</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  saveAmount: {
    type: Number,
    required: true
  },
  possibleSaveAmount: {
    type: Number,
    required: true
  },
  couldsaving: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.total-asset {
  margin-top: 40px;
  display: flex;
  height: 107px;
  padding: 10px 10px 10px 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  max-width: 1704px;
  border-radius: 20px;
  background-color: #f9f9f9;
  height: 150px;
  border: 1px solid #f8f8f8;
}
.asset-title {
  color: var(--black-default, #19181d);
  text-align: center;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 30px */
  letter-spacing: -0.4px;
}

.asset-amount {
  color: var(--black-default, #19181d);
  text-align: center;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%; /* 36px */
  letter-spacing: -0.48px;
}
</style>
