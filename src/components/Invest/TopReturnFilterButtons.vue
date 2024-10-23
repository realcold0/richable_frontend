<template>
  <div class="filters">
    <button
      v-for="(filter, index) in filters"
      :key="index"
      :class="['filter-btn', selectedFilter === filter ? 'active' : 'inactive']"
      @click="emitFilter(filter)"
    >
      {{ filter }}
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  filters: Array,
  selectedFilter: String
})

const emit = defineEmits(['filterSelected'])

const emitFilter = (filter) => {
  emit('filterSelected', filter)
}
</script>

<style scoped>
.filters {
  display: flex;
  border-bottom: 2px solid #414158;
  margin-top: 22px;
}

.filter-btn {
  padding: 10px 25px;
  width: 100px;
  height: 48px;
  margin-bottom: -2px;
  border: none;
  background-color: transparent;
  font-size: 16px;
  font-weight: 500;
  color: #9e9e9e;
  cursor: pointer;
  border-radius: 10px 10px 0 0;
}

.filter-btn.active {
  background-color: #3e3e3e;
  color: white;
}

.filter-btn.inactive {
  border: 1px solid #ccccd6;
}
</style>
