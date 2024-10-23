<template>
  <div class="container"><br>
    <KnowhowFilter :selectedCategory="selectedCategory" @filterCategory="filterCategory" />
    <KnowhowSortOptions :sortOption="sortOption" @sortBy="sortBy" />
    <KnowhowCardGrid :items="filteredItems" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import instance from '@/AxiosInstance.js'
import KnowhowCardGrid from '@/components/knowhow/KnowhowCardGrid.vue'
import KnowhowSortOptions from '@/components/knowhow/KnowhowSortOptions.vue'
import KnowhowFilter from '@/components/knowhow/KnowhowFilter.vue'

const selectedCategory = ref('전체')
const sortOption = ref('최신순')
const items = ref([])

const fetchBoards = async () => {
  try {
    const response = await instance.get('/community/all')
    if (response.data && Array.isArray(response.data)) {
      items.value = response.data
    } else if (response.data && Array.isArray(response.data.response?.data)) {
      items.value = response.data.response.data
    } else {
      items.value = []
    }
  } catch (error) {
    items.value = []
  }
}

onMounted(() => {
  fetchBoards()
})

const filteredItems = computed(() => {
  let filtered = items.value
  if (selectedCategory.value !== '전체') {
    filtered = filtered.filter(
      (item) =>
        (item.title && item.title.toLowerCase().includes(selectedCategory.value.toLowerCase())) ||
        (item.contents && item.contents.toLowerCase().includes(selectedCategory.value.toLowerCase()))
    )
  }
  return filtered.sort((a, b) => {
    if (sortOption.value === '최신순') {
      return b.id - a.id
    } else {
      return a.id - b.id
    }
  })
})

const filterCategory = (category) => {
  selectedCategory.value = category
}

const sortBy = (option) => {
  sortOption.value = option
}

const openCreateModal = () => {
  console.log('Modal Open')
}
</script>

<style scoped>
*{
color : #19181d;
font-family:'Pretendard', sans-serif;
}
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.tag {
  display: inline-block;
  padding: 5px 10px;
  background-color: #f2f2f2;
  border-radius: 30px;
  font-size: 12px;
  color: #7b7b7b;
}

.floating-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ff007a;
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
}

.floating-btn:hover {
  background-color: #FF0062;
  transform: scale(1.1);
}

/* 태블릿용 (768px ~ 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .filter-bar button {
    padding: 8px 18px;
    font-size: 14px;
  }
  
  .card-content h3 {
    font-size: 15px;
  }
  
  .card-content p {
    font-size: 13px;
  }

  .card-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

/* 모바일용 (767px 이하) */
@media (max-width: 767px) {
  .container {
    padding: 10px;
  }

  .filter-bar {
    justify-content: center;
  }

  .filter-bar button {
    padding: 6px 14px;
    font-size: 12px;
  }

  .sort-options {
    justify-content: center;
    font-size: 12px;
  }

  .card-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .card {
    padding: 10px;
  }
  .card-content h3 {
    font-size: 14px;
  }
  .card-content p {
    font-size: 12px;
  }

  .floating-btn {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }
}
</style>
