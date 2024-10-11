<template>
  <div class="find-id-confirmation-container">
    <h2 class="text-center mb-5" style="font-size: 20px;">아이디 찾기</h2>
    <p class="text-center mb-5">입력하신 정보와 일치하는 아이디는 아래와 같습니다.</p>
    <p class="text-center found-id">
      {{ foundId }}
    </p>
    <!-- Go to Login Page -->
    <div class="mb-5 text-center"></div>
    <!-- Password Recovery Button -->
    <div class="d-flex justify-content-center mb-3">
      <router-link to="/user/findpassword" class="join-link btn btn-pink" @click="findPassword"
        >비밀번호 찾기</router-link
      >
    </div>
    <!-- Go to Login Page -->
    <div class="mb-2 text-center">
      <router-link to="/user/signin" class="join-link"> 로그인 페이지로 이동</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const foundId = ref('')

onMounted(() => {
  foundId.value = route.params.id || '아이디를 찾을 수 없습니다.'
})

// Function to simulate password recovery
const findPassword = () => {
  // alert('비밀번호 찾기 페이지로 이동합니다.')
}

// Function to simulate going to the login page
const goToLogin = () => {
  // alert('로그인 페이지로 이동합니다.')
}
</script>

<style scoped>
.find-id-confirmation-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  text-align: center;
  margin-top: 5rem;
}

h2 {
  font-weight: bold;
}

.found-id {
  font-weight: bold;
  color: #000;
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

.join-link {
  font-size: 0.9rem;
  color: #0d6efd;
  text-decoration: none;
}

.btn-pink {
  background-color: #ff5a78;
  color: white;
  border: none;
  width: 200px;
}

.text-danger {
  color: #ff5a78 !important;
}

.text-danger:hover {
  text-decoration: underline;
}
</style>
