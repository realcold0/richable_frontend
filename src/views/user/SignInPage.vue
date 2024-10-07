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
      <button type="submit" class="login-btn" :disabled="!id || !password">
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
      <button @click="naverLogin" class="btn btn-secondary naver-btn" style><img src="../../assets/images/naver_logo.png" alt="naver"/></button>

    <div class="mt-3">
      <span>Richable이 처음이에요?</span>
      <router-link to="/user/signup" class="join-link">가입하기</router-link>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const id = ref('')
const password = ref('')
const showPassword = ref(false)
const router = useRouter()

const BASE_URL = 'http://localhost:8080/member'

// 네이버 로그인 설정
const NAVER_CLIENT_ID = '6lCwElPsJ16_JoPQSjSA'
const NAVER_CALLBACK_URL = 'http://localhost:8080/member/naverCallback'

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const naverLogin = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/naverlogin`);
    if (response.data.redirectUrl) {
      // 받은 state를 세션 스토리지에 저장
      sessionStorage.setItem('naverState', response.data.state);
      window.location.href = response.data.redirectUrl;
    }
  } catch (error) {
    console.error('Naver login initiation failed:', error);
    alert('네이버 로그인을 시작하는 데 문제가 발생했습니다.');
  }
}

const login = async () => {
  if (!id.value || !password.value) {
    alert('아이디와 비밀번호를 모두 입력해주세요')
    return
  }

  try {
    const response = await axios.post('http://localhost:8080/member/login', {
      id: id.value,
      password: password.value
    })
    console.log('Token received:', response.data.token)

    if (response.status === 200) {
      alert('Login successful!')
      localStorage.setItem('authToken', response.data.token)
      // 리디렉션 경로 처리 (기본값으로 '/'로 이동)
      const redirectPath = router.currentRoute.value.query.redirect || '/asset/analysis';
      router.push(redirectPath);
    }
  } catch (error) {
    console.error('Login failed:', error)
    alert('Login failed. Please check your credentials.')
  }
}

const handleNaverCallback = async (code, state) => {
  try {
    const response = await axios.get(`${BASE_URL}/naverCallback`, {
      params: { code, state }
    })
    if (response.status === 200) {
      console.log('Naver login success:', response.data)
      // 여기서 받은 사용자 정보를 처리 (예: 로컬 스토리지에 저장)
      alert('네이버 로그인 성공!')
      router.push({ name: 'home' })
    }
  } catch (error) {
    console.error('Naver login callback failed:', error)
    alert('네이버 로그인 처리 중 오류가 발생했습니다.')
  }
}

onMounted(() => {
  // Check for Naver login callback
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  const state = urlParams.get('state')

  // 네이버 로그인 스크립트 로드
  const naverScript = document.createElement('script');
        naverScript.src = 'https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js';
        naverScript.charset = 'utf-8';
        document.head.appendChild(naverScript);
  
        // jQuery 스크립트 로드
        const jqueryScript = document.createElement('script');
        jqueryScript.src = 'http://code.jquery.com/jquery-1.11.3.min.js';
        document.head.appendChild(jqueryScript);

        // 스크립트 로드 완료 후 네이버 로그인 초기화
    naverScript.onload = () => {
      jqueryScript.onload = () => {
        const naver_id_login = new window.naver_id_login(NAVER_CLIENT_ID, NAVER_CALLBACK_URL);
        naver_id_login.setButton("white", 1, 40);
        naver_id_login.init_naver_id_login();
      };
    };
  if (code && state) {
    handleNaverCallback(code, state)
  }
})


</script>

<style scoped>
body {
  width: 500px;
  font-family: 'pretendard', sans-serif;
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
  color: #777777;
  font-weight: 500;
  text-decoration: underline; /* 밑줄 추가 */
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
  border: none;
  color : white;
  border-radius: 5px;
  width: 100%;
  height: 40px;
  margin-top: 1rem;
  background-color: #FF0062;
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
  border-color: #FF0062; /* 원하는 테두리 색상 */
  box-shadow: none;
  outline: none; /* 기본 아웃라인 제거 */
}
.naver-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

a {
  text-decoration: none;
  color: inherit;
}
#naver_id_login {
  display: inline-block;
  vertical-align: middle;
}

::placeholder {
  color: #999999; /* 원하는 색상으로 변경 */
  opacity: 1; /* 투명도 조절 */
}
</style>
