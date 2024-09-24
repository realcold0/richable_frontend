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
          :disabled="!verificationCode || verificationCode !== '123456'"
          @click="navigateToPw2"
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

const router = useRouter()

const email = ref('')
const verificationCode = ref('')

const sendVerificationCode = () => {
  if (email.value) {
    alert(`인증번호가 ${email.value} 이메일로 발송되었습니다.`)
  } else {
    alert('이메일을 입력해주세요.')
  }
}

const verifyCode = () => {
  if (verificationCode.value === '123456') {
    alert('인증 코드가 확인되었습니다.')
  } else {
    alert('인증 코드가 일치하지 않습니다.')
  }
}

const submitForm = () => {
  if (verificationCode.value === '123456') {
    alert('아이디를 성공적으로 찾았습니다.')
  } else {
    alert('인증 코드가 필요합니다.')
  }
}

// Programmatic navigation
const navigateToPw2 = () => {
  if (verificationCode.value === '123456') {
    router.push('/user/findpassword2')
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
