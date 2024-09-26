<template>
    <div id="findpassword2" class="find-pw-container">
      <h1 class="my-5">
        <i class="fa-solid fa-lock"></i>
        비밀번호 변경
      </h1>
      <form @submit.prevent="resetPassword">
        <div class="mb-4 text-start">
          <label for="newPassword" class="form-label">
            <i class="fa-solid fa-lock"></i>
            새 비밀번호:
          </label>
          <input
            type="password"
            class="form-control"
            id="newPassword"
            placeholder="새 비밀번호"
            v-model="newPassword"
            @input="resetError"
          />
        </div>
        <div class="mb-4 text-start">
          <label for="confirmPassword" class="form-label">
            <i class="fa-solid fa-lock"></i>
            새 비밀번호 확인:
          </label>
          <input
            type="password"
            class="form-control"
            id="confirmPassword"
            placeholder="새 비밀번호 확인"
            v-model="confirmPassword"
            @input="resetError"
          />
        </div>
        <div v-if="error" class="text-danger">{{ error }}</div>
        <button type="submit" class="btn btn-primary mt-4" :disabled="!newPassword || !confirmPassword">
          <i class="fa-solid fa-check"></i>
          확인
        </button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter