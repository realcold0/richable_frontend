<!-- RC-P-03.vue -->
<template>
  <div id="signup" class="signup-container">
    <h2 class="mb-4">회원가입</h2>

    <form @submit.prevent="join">
      <!-- id Field -->
      <div class="mb-3 text-start">
        <label for="id" class="form-label">
          <i class="fa-solid fa-user"></i> 사용자 ID
          <button
            type="button"
            class="btn btn-success py-0 me-2 m-0 p-0 check_dupl"
            style="font-size: 0.75rem"
            @click="checkId"
          >
            중복확인
          </button>
        </label>
        <div class="d-flex align-items-center">
          <input
            type="text"
            v-model="member.id"
            @input="changeId"
            class="form-control me-2"
            id="id"
            placeholder="사용자명을 입력하세요"
            required
          />
        </div>
        <p :class="disableSubmit ? 'text-danger' : 'text-primary'">{{ checkError }}</p>
      </div>

      <!-- Nickname Field -->
      <div class="mb-3 text-start">
        <label for="nickname" class="form-label">별명</label>
        <input
          type="text"
          v-model="member.nickname"
          class="form-control"
          id="nickname"
          placeholder="별명을 입력하세요"
          required
        />
      </div>

      <!-- Gender Field -->
      <div class="mb-3 text-start">
        <label class="form-label">성별</label>
        <div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              v-model="member.gender"
              id="male"
              value="M"
            />
            <label class="form-check-label" for="male">남성</label>
          </div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              v-model="member.gender"
              id="female"
              value="F"
            />
            <label class="form-check-label" for="female">여성</label>
          </div>
        </div>
      </div>

      <!-- Email Field -->
      <div class="mb-3 text-start">
        <label for="email" class="form-label">이메일</label>
        <input
          type="email"
          v-model="member.email"
          class="form-control"
          id="email"
          placeholder="이메일을 입력하세요"
          required
        />
      </div>

      <!-- Password Fields -->
      <div class="mb-3 text-start">
        <label for="password" class="form-label">비밀번호</label>
        <input
          type="password"
          v-model="member.password"
          class="form-control"
          id="password"
          placeholder="비밀번호를 입력하세요"
          required
        />
      </div>
      <div class="mb-3 text-start">
        <label for="password2" class="form-label">비밀번호 확인</label>
        <input
          type="password"
          v-model="member.password2"
          class="form-control"
          id="password2"
          placeholder="비밀번호를 다시 입력하세요"
          required
        />
        <p v-if="member.password !== member.password2" class="error-message">
          비밀번호가 일치하지 않습니다.
        </p>
      </div>

      <!-- Birthday Field -->
      <div class="row mb-3 text-start">
        <label for="birthday">생년월일:</label>
        <Datepicker
          v-model="member.birthday"
          :format="'yyyy-MM-dd'"
          :monday-first="true"
          placeholder="생년월일을 선택하세요"
          class="form-control"
        />
      </div>

      <!-- Buttons -->
      <div class="d-flex justify-content-center">
        <router-link to="/user/signin" class="join-link btn btn-light"> 취소</router-link>
        <span class="mx-2"></span>
        <button type="submit" class="btn btn-pink" :disabled="disableSubmit">다음</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Datepicker from 'vue3-datepicker'

const router = useRouter()
const checkError = ref('')
const disableSubmit = ref(true)
const member = reactive({
  id: '',
  email: '',
  password: '',
  password2: '',
  nickname: '',
  gender: '',
  birthday: null
})

const BASE_URL = 'http://localhost:8080/member'

// Check id availability
const checkId = async () => {
  if (!member.id) {
    return alert('사용자 ID를 입력하세요.')
  }
  try {
    const { data } = await axios.get(`${BASE_URL}/checkDupl/${member.id}`)
    disableSubmit.value = data.exists
    checkError.value = data.exists ? '이미 사용중인 ID입니다.' : '사용가능한 ID입니다.'
  } catch (error) {
    console.error('Error checking id:', error)
    checkError.value = '중복 체크에 실패했습니다. 다시 시도하세요.'
  }
}

// Handle id input
const changeId = () => {
  disableSubmit.value = true
  checkError.value = member.id ? 'ID 중복 체크를 하셔야 합니다.' : ''
}

/// Form submission logic
const join = async () => {
  if (member.password !== member.password2) {
    return alert('비밀번호가 일치하지 않습니다.')
  }

  // Create memberToSend inside the join function to capture the latest data
  const memberToSend = {
    id: member.id,
    password: member.password,
    nickname: member.nickname,
    gender: member.gender,
    email: member.email,
    birthday: member.birthday // Ensure this matches the DTO in your backend
  }

  try {
    const { data } = await axios.post(`${BASE_URL}/register`, memberToSend)
    console.log('Signup successful:', data)
    router.push({ name: 'home' })
  } catch (error) {
    console.error('Error during signup:', error)
    alert('회원가입에 실패했습니다. 다시 시도하세요.')
  }
}
</script>

<style scoped>
body {
  font-family: 'Noto Sans KR', sans-serif;
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
  align-items: center;
}

.signup-container {
  width: 80%;
  max-width: 500px;
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: 5% auto;
}

.btn {
  width: 80px;
  margin-top: 1rem;
}

.error-message {
  color: #ff4444;
  font-weight: bold;
}
</style>
