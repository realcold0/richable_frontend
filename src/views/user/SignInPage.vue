<template>
  <div id="singin" class="login-container">
    <img class="title" src="../../assets/images/navbar-full-rich.png" />
    <form @submit.prevent="login">
      <div class="mb-3 text-start">
        <label for="id" class="form-label">아이디</label>
        <input
          type="text"
          v-model="id"
          class="form-control"
          id="id"
          placeholder="이메일 주소를 입력해주세요"
          required
        />
      </div>
      <div class="mb-3 text-start position-relative">
        <label for="password" class="form-label">비밀번호</label>
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          class="form-control"
          id="password"
          placeholder="비밀번호를 입력해주세요"
          required
        />
        <span
          @click="togglePassword"
          class="position-absolute"
          style="right: 10px; top: 36px; cursor: pointer"
        >
          <!-- You can add visibility icons here -->
        </span>
      </div>
      <button
        type="submit"
        class="btn btn-secondary login-btn"
        :disabled="!id || !password"
        @click="handleLogin"
      >
        로그인
      </button>
    </form>

    <div class="d-flex justify-content-center mt-3">
      <router-link to="/user/findid" class="join-link">아이디 찾기</router-link>
      <span class="mx-2"> | </span>
      <router-link to="/user/findpassword" class="join-link">비밀번호 찾기</router-link>
    </div>

    <div class="or-divider">또는</div>

    <div class="sns-buttons">
      <img src="https://via.placeholder.com/40?text=K" alt="Kakao" />
      <img src="https://via.placeholder.com/40?text=N" alt="Naver" />
    </div>

    <div class="mt-3">
      <span>Richable이 처음이에요?</span>
      <router-link to="/user/signup" class="join-link">가입하기</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const id = ref('')
const password = ref('')
const showPassword = ref(false)
const router = useRouter()

const togglePassword = () => {
  showPassword.value = !showPassword.value
}
const handleLogin = () => {
  if (id.value && password.value) {
    // Perform login logic here
    router.push({ name: 'Home' }) // Or any route you want to navigate to after login
  } else {
    alert('Please fill in both ID and password')
  }
}

const login = async () => {
  if (!id.value || !password.value) {
    alert('Please fill in both ID and password')
    return
  }

  try {
    console.log('ID:', id.value)
    console.log('Password:', password.value)

    const response = await axios.post('http://localhost:8080/member/login', {
      id: id.value,
      password: password.value
    })
    console.log('Token received:', response.data.token)

    if (response.status === 200) {
      alert('Login successful!')
      localStorage.setItem('authToken', response.data.token)
      router.push({ name: 'home' })
    }
  } catch (error) {
    console.error('Login failed:', error)
    alert('Login failed. Please check your credentials.')
  }
}
</script>

<style scoped>
body {
  width: 500px;
  font-family: 'Noto Sans KR', sans-serif;
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
  color: #0d6efd;
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
  width: 100%;
  margin-top: 1rem;
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
  box-shadow: none;
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
