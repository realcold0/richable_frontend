<template>
    <div class="filter-bar">
      <button :class="{ active: selectedCategory === '전체' }" @click="$emit('filterCategory', '전체')">
        전체
      </button>
      <button :class="{ active: selectedCategory === '예적금' }" @click="$emit('filterCategory', '예적금')">
        예적금
      </button>
      <button :class="{ active: selectedCategory === '투자' }" @click="$emit('filterCategory', '투자')">
        투자
      </button>
      <button :class="{ active: selectedCategory === '코인' }" @click="$emit('filterCategory', '코인')">
        코인
      </button>
      <button :class="{ active: selectedCategory === '기타' }" @click="$emit('filterCategory', '기타')">
        기타
      </button>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    selectedCategory: String
  })
  </script>
  
  <style scoped>
 .filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.filter-bar button {
  padding: 10px 20px;
  border-radius: 30px;
  background-color: #f2f2f2;
  color: #000;
  border: none;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.filter-bar button.active {
  background-color: #FF0062;
  color: white;
}
  </style>
  