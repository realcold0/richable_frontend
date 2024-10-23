<template>
  <div class="card-grid">
    <div v-for="item in items" :key="item.id" class="card">
      <div class="card-content">
        <h4>{{ item.title }}</h4>
        <p>{{ item.contents }}</p><br>
        <span class="tag">작성자: {{ item.writer }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: Array
})
</script>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: scale(1.03);
}

.card-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  background-color: #f0f0f0;
  margin-bottom: 15px;
}

.card-content {
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-content h4 {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-content p {
  font-size: 14px;
  color: #7b7b7b;
  margin-bottom: 10px;
  flex-grow: 1;
}

.tag {
  font-size: 12px;
  color: #999;
  margin-top: auto;
}
</style>
