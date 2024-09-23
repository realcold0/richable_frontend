<!-- RC-P-03-1 -->
<template>
  <div id="findpassword2" class="find-pw-container">
    <h1 class="my-5">
      <i class="fa-solid fa-lock"></i>
      비밀번호 변경
    </h1>
    <form @submit.prevent="onSubmit">
      <div class="mb-4 text-start">
        <label for="password" class="form-label">
          <i class="fa-solid fa-lock"></i>
          새 비밀번호:
        </label>
        <input
          type="password"
          class="form-control"
          placeholder="새 비밀번호"
          v-model="changePassword.newPassword"
          @input="resetError"
        />
      </div>
      <div class="mb-4 text-start">
        <label for="password" class="form-label">
          <i class="fa-solid fa-lock"></i>
          새 비밀번호 확인:
        </label>
        <input
          type="password"
          class="form-control"
          placeholder="새 비밀번호 확인"
          v-model="changePassword.newPassword2"
          @input="resetError"
        />
      </div>
      <div v-if="error" class="text-danger">{{ error }}</div>
      <button type="submit" class="btn btn-primary mt-4" :disabled="disableSubmit">
        <i class="fa-solid fa-check"></i>
        확인
      </button>
    </form>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios' // Import axios directly

const router = useRouter()
// const auth = useAuthStore()
const changePassword = reactive({
  username: '', //auth.username
  oldPassword: '',
  newPassword: '',
  newPassword2: ''
})
const disableSubmit = computed(
  () => !changePassword.oldPassword || !changePassword.newPassword || !changePassword.newPassword2
)
const error = ref('')
</script>

<style scoped>
.find-pw-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-top: 5rem;
}
</style>
