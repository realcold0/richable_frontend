<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TheWelcome from '../components/TheWelcome.vue'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const token = route.query.token
  if (token) {
    // 토큰을 로컬 스토리지에 저장
    localStorage.setItem('authToken', token)
    
    // URL에서 토큰 제거
    router.replace({ query: {} })
    
    // 여기에 로그인 성공 후 추가 로직을 구현할 수 있습니다.
    // 예: 사용자 정보 가져오기, 상태 업데이트 등
    console.log('로그인 성공!')
  }
})
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
