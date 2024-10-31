<template>
  <div class="total-consume">
    <div class="consume-title">
      나의 이번 달
      <select
        :value="category"
        @change="updateCategory($event.target.value)"
        class="form-select custom-inline-select"
        style="font-size: 18px; font-weight: 700; background-color: none"
      >
        <option v-for="option in categories" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      소비는
    </div>

    <div class="consume-title">
      평균보다
      <span
        :style="{
          color: diffAmount > 0 ? '#EB003B' : '#2768FF',
          fontSize: '18px',
          fontWeight: '700'
        }"
      >
        {{ Math.abs(diffAmount).toLocaleString() }}원
      </span>
      <span
        :style="{
          color: diffAmount > 0 ? '#EB003B' : '#2768FF',
          fontSize: '18px',
          fontWeight: '700'
        }"
        v-if="diffAmount > 0"
      >
        많습니다</span
      >
      <span
        :style="{
          color: diffAmount > 0 ? '#EB003B' : '#2768FF',
          fontSize: '18px',
          fontWeight: '700'
        }"
        v-else
        >적습니다</span
      >.
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  category: {
    type: String,
    Required: true
  },
  categories: {
    type: Array,
    Required: true
  },
  diffAmount: {
    type: Number,
    Required: true
  }
})
const emit = defineEmits(['update:category'])

const updateCategory = (newCategory) => {
  emit('update:category', newCategory)
}
</script>

<style scoped>
.total-consume {
  margin-top: 21px;
  flex-shrink: 0;
  border-radius: 20px;
  background: #fafafb;
  display: flex;
  height: 125px;
  padding: 10px 10px 10px 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  background-color: #f9f9f9;
  height: 150px;
  border: 1px solid #f8f8f8;
  position: relative;
}

.consume-title {
  color: var(--black-default, #19181d);
  text-align: center;
  font-feature-settings: 'dlig' on;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px; /* 177.778% */
  letter-spacing: -0.8px;
}
.custom-inline-select {
  display: inline-block;
  width: auto; /* select 박스 크기를 자동으로 맞춤 */
  margin-left: 5px; /* 약간의 여백 추가 */
  margin-right: 5px;
}
</style>
