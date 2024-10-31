<template>
  <section class="profile-section box">
    <h5 class="bold-text text-left">나의 프로필</h5>
    <div class="profile">
      <img :src="localProfile.img" alt="프로필 이미지" />
      <h2 class="mt-3">{{ localProfile.nickname }}</h2>
      <button class="btn btn-danger mt-3" @click="openProfileModal"
        style="background-color: #FF0062; border-color: #FF0062;">
        프로필 수정
      </button>
    </div>

    <!-- 프로필 수정 모달 -->
    <DeleteConfirmationModal @confirmDeletion="deleteAccount" @cancelDeletion="cancelDeletion" />
  </section>
</template>

<script setup>
import { ref } from 'vue';
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'
import axios from 'axios';

const props = defineProps({
  userProfile: {
    type: Object,
    required: true
  }
});

// 로컬 프로필 데이터 복사본 생성
const localProfile = ref({ ...props.userProfile });

// JWT 토큰을 localStorage에서 가져오기
const token = localStorage.getItem('authToken');

// 프로필 수정 모달 오픈
const openProfileModal = () => {
  const modal = new bootstrap.Modal(document.getElementById('profileModal'));
  modal.show();
};

// API Base URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/member"

// 회원 탈퇴 기능
const deleteAccount = () => {
  const userId = localProfile.value.name;
  if (!userId) {
    alert("사용자 ID가 없습니다.");
    return;
  }

  axios
    .delete(`${BASE_URL}/delete/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      alert('회원 탈퇴가 완료되었습니다.');
      localStorage.removeItem('authToken');
      window.location.href = '/user/SignIn';
    })
    .catch((error) => {
      console.error('회원 탈퇴 중 에러 발생:', error);
      alert('회원 탈퇴에 실패했습니다.');
    });
};

// 회원 탈퇴 취소
const cancelDeletion = () => {
  const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
  if (deleteModal) deleteModal.hide();
};

</script>

<style scoped>
.profile-section {
  background-color: #f9f9f9;
  padding: 40px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
}

.profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.profile img {
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-bottom: 20px;
  border: 2px solid #FF0062;
}

/* 태블릿 환경 */
@media (max-width: 1023px) and (min-width: 768px) {
  .profile-section {
    padding: 30px;
  }

  .profile img {
    width: 120px;
    height: 120px;
  }
}

/* 모바일 환경 */
@media (max-width: 767px) {
  .profile-section {
    padding: 20px;
    border-radius: 5px;
  }

  .profile img {
    width: 100px;
    height: 100px;
  }
}
</style>