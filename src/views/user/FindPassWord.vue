<!-- RC-P-03-1 -->
<template>
  <div id="findpassword" class="find-pw-container">
    <h2 class="text-center mb-4">비밀번호 재설정</h2>

    <form @submit.prevent="submitForm">
      <!-- Email Input Field -->
      <div class="mb-4 text-start">
        <label for="id" class="form-label">아이디</label>
        <div class="input-group">
          <input
            type="text"
            v-model="id"
            class="form-control"
            id="id"
            placeholder="아이디를 입력해 주세요"
            required
          />
        </div>
      </div>
      <div class="mb-4 text-start">
        <label for="email" class="form-label">이메일</label>
        <div class="input-group">
          <input
            type="email"
            v-model="email"
            class="form-control"
            id="email"
            placeholder="이메일 주소를 입력해주세요"
            required
          />
          <button
            type="button"
            class="btn btn-secondary"
            @click="sendVerificationCode"
            :disabled="!email"
          >
            인증번호
          </button>
        </div>
      </div>

      <!-- Verification Code Input Field -->
      <div class="mb-5 text-start">
        <label for="verificationCode" class="form-label">인증코드</label>
        <div class="input-group">
          <input
            type="text"
            v-model="verificationCode"
            class="form-control"
            id="verificationCode"
            placeholder="인증 코드 6자를 입력하세요."
            required
          />
          <button
            type="button"
            class="btn btn-secondary"
            @click="verifyCode"
            :disabled="!verificationCode"
          >
            확인
          </button>
        </div>
      </div>

      <!-- Continue Button -->
      <div class="mb-5">
        <button
          type="button"
          class="btn btn-secondary w-100 mb-3"
          :disabled="!isCodeSent || !verificationCode"
          @click="goNext"
        >
          계속
        </button>
      </div>

      <!-- Additional Links -->
      <div class="mb-5 text-center">
        <router-link to="/user/findid" class="join-link">아이디 찾기</router-link>
        <br /><br />
        <router-link to="/user/signin" class="join-link">다른 방법으로 로그인</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePasswordResetStore } from '@/stores/passwordResetStore'
import axios from 'axios'

const router = useRouter()
const passwordResetStore = usePasswordResetStore()

const id = ref('')
const email = ref('')
const verificationCode = ref('')
const isCodeSent = ref(false)
const isVerified = ref(false)

const BASE_URL = 'http://localhost:8080/member'

const sendVerificationCode = async () => {
  if (email.value && id.value) {
    try {
      const response = await axios.post(`${BASE_URL}/find/pw/auth`, {
        email: email.value,
        id: id.value
      })
      alert(response.data.message)
      isCodeSent.value = true
    } catch (error) {
      alert(error.response?.data?.message || '오류가 발생했습니다.')
    }
  } else {
    alert('아이디와 이메일을 모두 입력해주세요.')
  }
}

const verifyCode = async () => {
  if (verificationCode.value) {
    try {
      const response = await axios.post(`${BASE_URL}/find_pw_auth`, {
        email: email.value,
        id: id.value,
        code: verificationCode.value
      })
      isVerified.value = true
      alert('이메일 인증 성공')
    } catch (error) {
      alert(error.response?.data?.message || '인증 코드가 일치하지 않습니다.')
    }
  } else {
    alert('인증 코드를 입력해주세요.')
  }
}

const goNext = async () => {
  if (isVerified.value) {
    passwordResetStore.setVerified(true)
    passwordResetStore.setUserId(id.value)
    router.push({ name: 'findpassword2' })
  } else {
    alert('먼저 이메일 인증을 완료해주세요.')
  }
}

const submitForm = () => {
  if (isVerified.value) {
    goNext()
  } else {
    verifyCode()
  }
}
</script>

<style scoped>
.find-pw-container {
  width: 500px;
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-top: 5rem;
  margin-bottom: 5rem;
}

.join-link {
  font-size: 0.9rem;
  color: #0d6efd;
  text-decoration: none;
}

.input-group .btn {
  width: 100px;
}
</style>
