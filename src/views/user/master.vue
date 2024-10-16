<template>
  <div class="container">
    <div>
      <h1>관리자 페이지</h1>
      <div>
        <p>접속 시간 : {{ currentTime }}</p>
      </div>
      <div>
        <button class="update-btn" @click="updateStock">주식 가격 update</button>
        <p v-if="stockUpdateTime" class="update-time">최근 업데이트: {{ stockUpdateTime }}</p>
      </div>
      <div>
        <button class="update-btn" @click="updateCoin">코인 가격 update</button>
        <p v-if="coinUpdateTime" class="update-time">최근 업데이트: {{ coinUpdateTime }}</p>
      </div>
      <div>
        <button class="update-btn">베지 추가</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axiosinstance from '@/AxiosInstance'

const currentTime = ref('')
const stockUpdateTime = ref('')
const coinUpdateTime = ref('')
const checkError = ref('')

const updateTime = () => {
  const now = new Date()
  return now.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    // second: '2-digit',
    hour12: false
  })
}

const updateStock = async () => {
  try {
    await axiosinstance.get(`/master/update/stock`)
    stockUpdateTime.value = updateTime()
    alert('주식 가격 업데이트 성공!')
  } catch (error) {
    console.error('주식 가격 업데이트 오류:', error)
    checkError.value = '주식 가격 업데이트에 실패했습니다. 다시 시도하세요.'
  }
}

const updateCoin = async () => {
  try {
    await axiosinstance.get(`/master/update/coin`)
    coinUpdateTime.value = updateTime()
    alert('코인 가격 업데이트 성공!')
  } catch (error) {
    console.error('코인 가격 업데이트 오류:', error)
    checkError.value = '코인 가격 업데이트에 실패했습니다. 다시 시도하세요.'
  }
}

onMounted(() => {
  currentTime.value = updateTime()
  setInterval(() => {
    currentTime.value = updateTime()
  }, 1000)
})
</script>

<style>
.container {
  width: 500px;
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: 5% auto;
}

.update-btn {
  border: none;
  color: white;
  border-radius: 5px;
  width: 100%;
  height: 40px;
  margin-top: 1rem;
  background-color: #ff0062;
}

.update-time {
  font-size: 0.8em;
  color: #666;
  margin-top: 0.5rem;
}

.login-btn {
  border: none;
  color: white;
  border-radius: 5px;
  width: 100%;
  height: 40px;
  margin-top: 1rem;
  background-color: #ff0062;
}

.input-group {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  width: 100%;
}

.input-group > .form-control {
  position: relative;
  flex: 1 1 auto;
  width: 1%;
  min-width: 0;
}

/* .pw-btn {
  border: none;
  color: white;
  border-radius: 5px;
} */
</style>
