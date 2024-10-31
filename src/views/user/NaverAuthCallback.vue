<template>
  <div class="login-container">
    <div v-if="loading" class="text-center">
      <p>네이버 로그인을 처리 중입니다...</p>
    </div>
    <div v-if="error" class="text-center text-red-500">
      <p>{{ error }}</p>
      <button @click="redirectToLogin" class="login-btn mt-4">
        로그인 페이지로 돌아가기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
//import axiosinstance from '@/AxiosInstance'

const router = useRouter()
const authStore = useAuthStore()
const error = ref(null)
const loading = ref(true)

const redirectToLogin = () => {
  router.push('/user/signin')
}

const handleNaverCallback = async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const savedState = localStorage.getItem('naverState')
    
    if (!token) {
      throw new Error('토큰을 찾을 수 없습니다.')
    }

    // 네이버 state 검증
    const currentState = urlParams.get('state')
    if (savedState !== currentState) {
      throw new Error('Invalid state parameter')
    }

    // 기존 인증 정보 초기화
    localStorage.removeItem('naverState')
    await authStore.handleNaverLogin(token)
    
    // 프로필 정보 가져오기 성공 시 리다이렉트
    router.push({ name: 'assetAnalysis' })
  } catch (e) {
    console.error('Error in handleNaverCallback:', e)
    error.value = '로그인 처리 중 오류가 발생했습니다.'
    loading.value = false
  }
}

onMounted(() => {
  handleNaverCallback()
})
</script>