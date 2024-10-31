<template>
    <div class="sort-options">
      <span @click="$emit('sortBy', '최신순')" :class="{ active: sortOption === '최신순' }">최신순</span> |
      <span @click="$emit('sortBy', '오래된 순')" :class="{ active: sortOption === '오래된 순' }">오래된 순</span>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    sortOption: String
  })
  </script>
  <style scoped>
  .sort-options {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  font-size: 14px;
  color: #6b6b6b;
}

.sort-options span {
  cursor: pointer;
  transition: color 0.3s ease;
}

.sort-options span.active {
  color: #3d3dff;
}
</style>