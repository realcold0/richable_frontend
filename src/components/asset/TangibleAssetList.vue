<template>
  <div class="asset-list">
    <div class="list-title">
      현물 자산 목록
      <font-awesome-icon icon="square-plus" style="color: #c30044" @click="$emit('open-create')" />
    </div>

    <div class="list-box">
      <button class="control-btn" @click="$emit('prev-slide')" :disabled="currentSlide === 0">
        <font-awesome-icon :icon="['fas', 'chevron-left']" />
      </button>

      <div class="carousel-track">
        <div v-for="(asset, index) in paginatedAssets" :key="index" class="asset-item">
          <div class="asset-header">
            <div class="asset-category">{{ asset.category }}</div>
            <div class="edit-icon" @click.stop="$emit('open-edit', asset)">
              <font-awesome-icon icon="pen-to-square" />
            </div>
          </div>

          <div class="asset-name">{{ asset.name }}</div>
          <div class="asset-price">
            <span class="price">{{ Number(asset.price).toLocaleString() }}</span>
            <span class="currency">원</span>
          </div>
          <div class="asset-icon">
            <font-awesome-icon :icon="getIcon(asset.category)" />
          </div>
        </div>
      </div>

      <button class="control-btn" @click="$emit('next-slide')" :disabled="currentSlide === maxSlide - 1">
        <font-awesome-icon :icon="['fas', 'chevron-right']" />
      </button>
    </div>
  </div>
</template>

<script setup>defineProps({
  paginatedAssets: {
    type: Array,
    required: true
  },
  currentSlide: {
    type: Number,
    required: true
  },
  maxSlide: {
    type: Number,
    required: true
  }
})

defineEmits(['open-create', 'open-edit', 'prev-slide', 'next-slide'])

const getIcon = (category) => {
  const iconMap = {
    '자동차': 'car',
    '전자기기': 'desktop',
    '명품': 'fa-gem',
    '브랜드': 'tags',
    '기타': 'question-circle'
  }
  return iconMap[category] || 'question-circle'
}
</script>

<style scoped>
/* 공통 스타일 */
.asset-list {
  margin-top: 117px;
}

.list-title {
  margin: 24px auto;
  font-size: 20px;
  font-weight: bold;
}

.list-box {
  display: flex;
  background-color: #fff2f6;
  border-radius: 10px;
  max-width: 1704px;
  height: 244px;
  margin-bottom: 44px;
  justify-content: space-between;
  align-items: center;
  padding: 0 27px;
}
.asset-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 300px;
  height: 190px;
  background-color: white;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));
  border-radius: 20px;
  cursor: pointer;
}

.asset-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.asset-name {
  font-weight: bold;
  font-size: 18px;
  text-align: center; /* 추가 */
}

.asset-price, .asset-amount {
  display: flex;
  justify-content: center;
  align-items: center;
}

.price, .amount {
  font-weight: bold;
  font-size: 24px;
  color: #ff0062;
}

.currency {
  font-weight: bold;
  font-size: 18px;
  color: #8a8aa8;
  margin-left: 4px;
}

.asset-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 60px;
  margin-top: 8px;
}

/* 현물 자산 리스트 전용 스타일 */
.carousel-track {
  display: flex;
  justify-content: center;
  transition: transform 0.5s ease;
  width: 100%;
  gap: 20px;
}

.control-btn {
  background-color: #c30044;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.control-btn:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.control-btn:hover:not(:disabled) {
  background-color: #ff0055;
}

.edit-icon {
  color: #c30044;
  font-size: 16px;
  margin-left: 4px;
  cursor: pointer;
}

.asset-category {
  font-weight: bold;
  font-size: 18px;
}

.asset-header {
  display: flex;
  gap: 8px;
}
</style>
