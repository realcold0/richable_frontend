<template>
  <div class="modal fade" id="badgeModal" tabindex="-1" aria-labelledby="badgeModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="badgeModalLabel">모든 뱃지</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex flex-wrap justify-content-center">
            <div v-for="(badge, index) in badges" :key="index" class="badge-item text-center m-3">
              <img :src="badge.img" :alt="badge.name" class="badge-image" />
              <p class="badge-name">{{ badge.name }}</p>
              <p v-if="badge.having" class="badge-status" style="color: green;">보유</p>
              <p v-else class="badge-status" style="color: red;">미보유</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axiosInstance from '@/AxiosInstance';
import { useBadgeStore } from '@/stores/mypage/badge.js';


// JWT 디코딩 함수 추가
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

const badges = ref([]);
const badgeStore = useBadgeStore();

const token = localStorage.getItem('authToken');
let nickname = null;

if (token) {
  const decodedToken = parseJwt(token); // JWT 토큰에서 닉네임 추출
  nickname = decodedToken.nickname;
} else {
  console.error('토큰이 없습니다.');
}

// API 호출 후 데이터 가져오기
const fetchBadges = async () => {
  try {
    // nickname을 포함한 API 요청
    const response = await axiosInstance.get(`/member/badge/all/${nickname}`);
    badges.value = response.data.response.data;
  } catch (error) {
    console.error('Error fetching badges:', error);
  }
};

// 컴포넌트가 마운트되면 API 호출
onMounted(() => {
  if (nickname) {
    fetchBadges();
  } else {
    console.error('Nickname is not defined.');
  }
});
</script>


<style scoped>
.badge-item {
  width: 120px;
}

.badge-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.badge-name {
  font-weight: bold;
  margin-top: 10px;
}

.badge-status {
  margin-top: 5px;
}
</style>

  
  <style scoped>
  .badge-item {
    width: 120px;
  }
  
  .badge-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
  }
  
  .badge-name {
    font-weight: bold;
    margin-bottom: 5px;
  }
  </style>
  