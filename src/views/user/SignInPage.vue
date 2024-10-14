<template>
  <div class="container">
    <div class="filter-bar">
      <button :class="{ active: selectedCategory === '전체' }" @click="filterCategory('전체')">
        전체
      </button>
      <button :class="{ active: selectedCategory === '예적금' }" @click="filterCategory('예적금')">
        예적금
      </button>
      <button :class="{ active: selectedCategory === '투자' }" @click="filterCategory('투자')">
        투자
      </button>
      <button :class="{ active: selectedCategory === '코인' }" @click="filterCategory('코인')">
        코인
      </button>
      <button :class="{ active: selectedCategory === '기타' }" @click="filterCategory('기타')">
        기타
      </button>
    </div>
    <div class="sort-options">
      <span @click="sortBy('최신순')" :class="{ active: sortOption === '최신순' }">최신순</span> |
      <span @click="sortBy('오래된 순')" :class="{ active: sortOption === '오래된 순' }"
        >오래된 순</span
      >
    </div>
    <div class="card-grid">
      <div v-for="item in filteredItems" :key="item.id" class="card">
        <div class="card-content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.contents }}</p>
          <span class="tag">작성자: {{ item.writer }}</span>
        </div>
      </div>
    </div>
    <button class="floating-btn" @click="openCreateModal">
      <span>+</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const selectedCategory = ref('전체')
const sortOption = ref('최신순')
const items = ref([])

const fetchBoards = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/community/all`)
    if (response.data.success && Array.isArray(response.data.response?.data)) {
      items.value = response.data.response.data
    } else {
      console.error('Invalid response format:', response.data)
      items.value = []
    }
  } catch (error) {
    console.error('Error fetching boards:', error)
    alert(
      `게시판 데이터를 가져오는 중 오류가 발생했습니다: ${error.response?.data?.error || error.message}`
    )
    items.value = []
  }
}

onMounted(fetchBoards)

const filteredItems = computed(() => {
  let filtered = items.value
  if (selectedCategory.value !== '전체') {
    filtered = filtered.filter(
      (item) =>
        (item.title && item.title.toLowerCase().includes(selectedCategory.value.toLowerCase())) ||
        (item.contents &&
          item.contents.toLowerCase().includes(selectedCategory.value.toLowerCase()))
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
body {
  width: 500px;
  font-family: 'pretendard', sans-serif;
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
.title {
  width: 40%;
  height: 8%;
  padding: 0.5rem;
}
.join-link {
  font-size: 0.9rem;
  color: #777777;
  font-weight: 500;
  text-decoration: underline; /* 밑줄 추가 */
}
.form-label {
  padding: 0.5rem;
}

.login-container {
  width: 500px;
  /* max-width: 400px; */
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: 5% auto;
}
.login-btn {
  border: none;
  color: white;
  border-radius: 5px;
  width: 100%;
  height: 40px;
  margin-top: 1rem;
  background-color: #ff0062;
}
.or-divider {
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  text-align: center;
}
.or-divider::before,
.or-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #dee2e6;
}
.or-divider::before {
  margin-right: 0.25em;
}
.or-divider::after {
  margin-left: 0.25em;
}
.sns-buttons img {
  width: 40px;
  margin: 0 5px;
}
.form-control:focus {
  border-color: #ff0062; /* 원하는 테두리 색상 */
  box-shadow: none;
  outline: none; /* 기본 아웃라인 제거 */
}
.naver-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

a {
  text-decoration: none;
  color: inherit;
}
#naver_id_login {
  display: inline-block;
  vertical-align: middle;
}

::placeholder {
  color: #999999; /* 원하는 색상으로 변경 */
  opacity: 1; /* 투명도 조절 */
}
</style>
