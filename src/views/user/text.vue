<template>
  <div id="signin" class="login-container">
    <img class="title" src="../../assets/images/navbar-full-rich.png" alt="Richable Logo" />
    <form @submit.prevent="login">
      <div class="mb-3 text-start">
        <label for="id" class="form-label">아이디</label>
        <input
          type="text"
          v-model="id"
          class="form-control"
          id="id"
          placeholder="아이디를 입력해주세요"
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
          <!-- 여기에 비밀번호 표시/숨김 아이콘을 추가할 수 있습니다 -->
        </span>
      </div>
      <button type="submit" class="btn btn-secondary login-btn" :disabled="!id || !password">
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

const login = async () => {
  if (!id.value || !password.value) {
    alert('아이디와 비밀번호를 모두 입력해주세요.')
    return
  }

  try {
    const response = await axios.post('http://localhost:8080/member/login', {
      id: id.value,
      password: password.value
    })

    if (response.data && response.data.token) {
      localStorage.setItem('authToken', response.data.token)
      alert('로그인 성공!')
      router.push({ name: 'home' })
    } else {
      alert('로그인 실패. 서버 응답이 올바르지 않습니다.')
    }
  } catch (error) {
    console.error('로그인 실패:', error)
    if (error.response) {
      // 서버가 응답을 반환한 경우
      alert(`로그인 실패: ${error.response.data.message || '알 수 없는 오류가 발생했습니다.'}`)
    } else if (error.request) {
      // 요청이 전송되었지만 응답을 받지 못한 경우
      alert('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.')
    } else {
      // 요청 설정 중에 오류가 발생한 경우
      alert('로그인 처리 중 오류가 발생했습니다.')
    }
  }
}
</script>

<style scoped>
/* ... 기존 스타일 유지 ... */
</style>
