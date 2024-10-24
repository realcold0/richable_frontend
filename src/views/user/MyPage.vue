<template>
  <div class="mypage-container">
    <div class="top-section d-flex justify-content-between">
      <!-- 프로필 섹션 -->
      <ProfileSection :userProfile="auth.userProfile.data" />

      <!-- API 관리 섹션 -->
      <APIManagement :userProfile="auth.userProfile.data" />
    </div>

    <!-- 뱃지 섹션 -->
    <BadgeSection />
  </div>
</template>

<script setup>
import ProfileSection from '@/components/user/ProfileSection.vue';
import APIManagement from '@/components/user/APIManagement.vue';
import BadgeSection from '@/components/user/BadgeSection.vue';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
</script>

<style scoped>
/* 기존 CSS 유지 */
.mypage-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.top-section {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.box {
  background-color: #f9f9f9;
  padding: 40px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  width: 100%;
}
</style>