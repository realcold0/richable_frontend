<!-- RC-P-03.vue -->
<template>
  <div id="signup" class="signup-container">
    <h2 class="mb-4">회원가입</h2>

    <form @submit.prevent="join">
      <!-- Username Field -->
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
            v-model="member.username"
            @input="changeUsername"
            class="form-control me-2"
            id="username"
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
              value="남성"
            />
            <label class="form-check-label" for="male">남성</label>
          </div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              v-model="member.gender"
              id="female"
              value="여성"
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

      <!-- Password Field -->
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

      <!-- Confirm Password Field -->
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

      <!-- Avatar Upload -->
      <!-- <div class="mb-3 text-start">
        <label for="avatar" class="form-label">프로필 사진</label>
        <input type="file" ref="avatar" class="form-control" id="avatar" />
      </div> -->

      <!-- Year, Month, Day Fields -->
      <div class="row mb-3 text-start">
        <div class="col-4">
          <label for="year" class="form-label">출생년도</label>
          <input
            type="text"
            v-model="member.year"
            class="form-control"
            id="year"
            placeholder="YYYY"
            required
          />
        </div>
        <div class="col-4">
          <label for="month" class="form-label">월</label>
          <input
            type="text"
            v-model="member.month"
            class="form-control"
            id="month"
            placeholder="MM"
            required
          />
        </div>
        <div class="col-4">
          <label for="day" class="form-label">일</label>
          <input
            type="text"
            v-model="member.day"
            class="form-control"
            id="day"
            placeholder="DD"
            required
          />
        </div>
      </div>

      <!-- Buttons -->
      <div class="d-flex justify-content-center">
        <router-link to="/user/signin" class="join-link btn btn-light"> 취소</router-link>
        <span class="mx-2"> </span>
        <router-link to="/user/terms" class="btn btn-pink" :disabled="disableSubmit">
          다음</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios' // Import axios directly

const router = useRouter()
// const avatar = ref(null);
const checkError = ref('')
const disableSubmit = ref(true)

// Reactive member object
const member = reactive({
  username: '',
  email: '',
  password: '',
  password2: '',
  nickname: '',
  gender: '',
  year: '',
  month: '',
  day: ''
  // avatar: null,
})

const BASE_URL = '/api/member'
const headers = { 'Content-Type': 'multipart/form-data' }

// Check username availability
const checkId = async () => {
  if (!member.id) {
    return alert('사용자 ID를 입력하세요.')
  }

  try {
    const { data } = await axios.get(`${BASE_URL}/checkusername/${member.username}`)
    console.log('AUTH GET CHECKUSERNAME', data)
    disableSubmit.value = data
    checkError.value = data ? '이미 사용중인 ID입니다.' : '사용가능한 ID입니다.'
  } catch (error) {
    console.error('Error checking username:', error)
    checkError.value = '중복 체크에 실패했습니다. 다시 시도하세요.'
  }
}

// Handle username input
const changeUsername = () => {
  disableSubmit.value = true
  if (member.username) {
    checkError.value = 'ID 중복 체크를 하셔야 합니다.'
  } else {
    checkError.value = ''
  }
}

// Form submission logic
const join = async () => {
  if (member.password !== member.password2) {
    return alert('비밀번호가 일치하지 않습니다.')
  }

  // if (avatar.value?.files?.length > 0) {
  //   member.avatar = avatar.value.files[0]
  // }

  try {
    const formData = new FormData()
    formData.append('username', member.username)
    formData.append('email', member.email)
    formData.append('password', member.password)
    formData.append('nickname', member.nickname)
    formData.append('gender', member.gender)
    formData.append('year', member.year)
    formData.append('month', member.month)
    formData.append('day', member.day)

    // if (member.avatar) {
    //   formData.append('avatar', member.avatar);
    // }

    const { data } = await axios.post(`${BASE_URL}/create`, formData, { headers })
    console.log('AUTH POST CREATE', data)
    router.push({ name: 'home' }) // Redirect after successful signup
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
  /* height: 100vh; */
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

.signup-btn {
  width: 100px;
  margin-top: 1rem;
}

.form-label {
  text-align: start;
  font-weight: bold;
}

.btn {
  width: 80px;
  margin-top: 1rem;
}

.username-check {
  color: #00c851;
  font-weight: bold;
}

.error-message {
  color: #ff4444;
  font-weight: bold;
}
</style>
