<template>
  <section class="badge-section box mt-5">
    <div class="d-flex justify-content-between align-items-center">
      <h1 class="badge-title bold-text">나의 뱃지</h1>
      <!-- 전체보기 클릭 시 모달 오픈 -->
      <a href="#" class="text-end" @click.prevent="openBadgeModal" style="color: #FF0062;">전체보기</a>
    </div>

    <div class="badges d-flex justify-content mt-5">
      <div class="representative-badge text-center">
        <h6 class="bold-text">대표 뱃지</h6><br>
        <div v-if="selectedBadge" class="text-center">
          <p>{{ selectedBadge.name }}</p>
          <img :src="selectedBadge.imageUrl" alt="대표 뱃지 이미지" class="badge-image" />
          <label class="d-flex align-items-center justify-content-center mt-2">
            <input type="checkbox" v-model="selectedBadge.isSelected" @change="toggleBadgeSelection(selectedBadge)">
            <p class="mb-0 ms-2">대표 뱃지 등록</p>
          </label>
        </div>
        <div v-else>
          <p>뱃지</p>
        </div>
      </div>

      <div class="d-flex flex-column align-items-start">
        <h6 class="bold-text">내가 획득한 뱃지</h6><br>
        <div class="d-flex justify-content-start">
          <div v-for="badge in badges" :key="badge.id" class="badge-item text-center" @click="selectBadge(badge)">
            <p class="badge-name">{{ badge.name }}</p>
            <img :src="badge.imageUrl" alt="뱃지 이미지" class="badge-image" />
          </div>
        </div>
      </div>
    </div>

    <!-- UserAllBadgesModal 모달 삽입 -->
    <UserAllBadgesModal ref="badgeModal" />
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useBadgeStore } from '@/stores/mypage/badge.js';
import UserAllBadgesModal from '@/components/modal/user/UserAllBadgesModal.vue';

const badgeStore = useBadgeStore();
const badges = computed(() => badgeStore.badges);

// 모달 관리
const openBadgeModal = () => {
  const badgeModal = new bootstrap.Modal(document.getElementById('badgeModal'));
  badgeModal.show();
};

const selectedBadgeId = ref(null);

const selectedBadge = computed(() => badges.value.length > 0 ? badges.value.find(badge => badge.id === selectedBadgeId.value) : null);

const selectBadge = (badge) => {
  selectedBadgeId.value = badge.id;
  // 선택한 배지 정보를 localStorage에 저장
  localStorage.setItem('selectedBadge', JSON.stringify(badge));
};

const toggleBadgeSelection = (badge) => {
  if (!badge.isSelected) selectedBadgeId.value = null;
};

// 사용자 정보 로드
onMounted(() => {
  // localStorage에 저장된 배지 정보를 불러옴
  const storedBadge = localStorage.getItem('selectedBadge');
  if (storedBadge) {
    const badge = JSON.parse(storedBadge);
    selectedBadgeId.value = badge.id; // 저장된 배지 ID 설정
  }

  badgeStore.fetchBadges();
});
</script>

<style scoped>
.badge-section {
  position: relative;
  margin-top: 40px;
}

.badge-title {
  font-weight: bold;
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 20px;
}

.badges {
  display: flex;
  justify-content: space-around;
  margin-top: 50px;
}

.bold-text {
  font-weight: bold;
}

.representative-badge {
  margin-right: 50px;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
}

.badge-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
}

.badge-item .badge-name {
  font-weight: bold;
  margin-bottom: 5px;
}
</style>