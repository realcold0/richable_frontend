<template>
  <div class="container">
    <div class="filter-bar">
      <button :class="{ active: selectedCategory === '전체' }" @click="filterCategory('전체')">전체</button>
      <button :class="{ active: selectedCategory === '절약' }" @click="filterCategory('절약')">절약</button>
      <button :class="{ active: selectedCategory === '저축' }" @click="filterCategory('저축')">저축</button>
      <button :class="{ active: selectedCategory === '투자' }" @click="filterCategory('투자')">투자</button>
      <button :class="{ active: selectedCategory === '기타' }" @click="filterCategory('기타')">기타</button>
    </div>
    <div class="sort-options">
      <span @click="sortBy('최신순')" :class="{ active: sortOption === '최신순' }">최신순</span> |
      <span @click="sortBy('오래된 순')" :class="{ active: sortOption === '오래된 순' }">오래된 순</span>
    </div>
    <div class="card-grid">
      <div v-for="(item, index) in filteredItems" :key="index" class="card">
        <img :src="item.image || placeholderImage" class="card-image" />
        <div class="card-content">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <span class="tag">{{ item.tag }}</span>
        </div>
      </div>
    </div>
    <button class="floating-btn" @click="openCreateModal">
      <span>+</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const selectedCategory = ref('전체');
const sortOption = ref('최신순');
const placeholderImage = 'your_placeholder_image_url';
const items = ref([
  { title: '예/적금의 모든 것', description: '위니바앤왕', tag: '저축', image: 'your_image_url' },
  { title: '예/적금의 모든 것', description: '위니바앤왕', tag: '저축', image: '' },
  { title: '절약의 모든 것', description: '스마트 소비', tag: '절약', image: '' },
  { title: '투자의 모든 것', description: '성공적인 투자', tag: '투자', image: '' },
  { title: '기타 항목 1', description: '기타 설명', tag: '기타', image: '' },
  { title: '기타 항목 2', description: '기타 설명', tag: '기타', image: '' },
  { title: '절약 팁', description: '효율적인 절약', tag: '절약', image: '' },
  { title: '투자의 미래', description: '성공적인 투자 전략', tag: '투자', image: '' },
  { title: '저축과 투자의 차이', description: '저축과 투자에 대한 이해', tag: '저축', image: '' },
  { title: '금융 시장 이해하기', description: '금융 시장 입문', tag: '저축', image: '' },
  { title: '경제 관리의 모든 것', description: '경제 관리 가이드', tag: '절약', image: '' },
  { title: '기타 항목 3', description: '기타 설명', tag: '기타', image: '' },
 
]);
const filteredItems = computed(() => {
  let filtered = items.value.filter(item =>
    selectedCategory.value === '전체' || item.tag === selectedCategory.value
  );
  return filtered.sort((a, b) => {
    if (sortOption.value === '최신순') {
      return b.index - a.index; 
    } else {
      return a.index - b.index; 
    }
  });
});

const filterCategory = (category) => {
  selectedCategory.value = category;
};

const sortBy = (option) => {
  sortOption.value = option;
};

//모달 오픈
const openCreateModal = () => {
  console.log("Modal Open");
};
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: flex-start;
  flex-wrap: wrap; /* 작은 화면에서 버튼들이 줄바꿈 될 수 있게 함 */
}

.filter-bar button {
  padding: 10px 20px;
  border-radius: 30px;
  background-color: #f2f2f2;
  color: #000;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.filter-bar button.active {
  background-color: #3d3dff;
  color: white;
}

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
}

.card-content h3 {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.card-content p {
  font-size: 14px;
  color: #7b7b7b;
  margin-bottom: 10px;
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
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.floating-btn:hover {
  background-color: #e60067;
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
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* 카드 크기를 줄임 */
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
    grid-template-columns: 1fr; /* 카드가 한 열로 정렬되도록 함 */
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
