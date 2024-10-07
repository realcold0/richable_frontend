<template>
  <div
    class="modal fade"
    id="consumeGoalCreateModal"
    tabindex="-1"
    aria-labelledby="consumeGoalCreateLabel"
    aria-hidden="true"
    ref="modal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="consumeGoalCreateLabel" style="font-weight: bold">
            소비 목표 등록
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body" style="padding: 32px; padding-bottom: 12px">
          <div class="mb-3">
            <label class="form-label" style="font-weight: bold">분류</label>
            <select v-model="newGoal.type" class="form-control">
              <option value="소비">소비</option>
              <option value="저축">저축</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label" style="font-weight: bold">목표명</label>
            <input
              v-model="newGoal.title"
              type="text"
              class="form-control"
              placeholder="목표명을 입력해주세요"
            />
          </div>
          <div class="mb-3">
            <label class="form-label" style="font-weight: bold">목표량</label>
            <input
              v-model="newGoal.totalAmount"
              type="number"
              class="form-control"
              placeholder="목표량을 입력해주세요"
            />
          </div>
        </div>
        <div class="modal-footer d-flex">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
          <button type="button" class="btn custom-register-btn" @click="submitGoal">등록</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Modal } from 'bootstrap'
// import axios from 'axios'
import Instance from '@/axiosInstance.js'

// 새 목표 정보
const newGoal = ref({
  type: '소비',
  title: '',
  totalAmount: 0
})

const modal = ref(null)
let modalInstance = null

const emit = defineEmits(['registerGoal'])

// 목표 생성 API 호출 함수
const submitGoal = async () => {
  if (newGoal.value.title && newGoal.value.totalAmount > 0) {
    try {
      const response = await Instance.post('/goal/set', {
        category: newGoal.value.type,
        title: newGoal.value.title,
        amount: newGoal.value.totalAmount
      })
      if (response.data.success) {
        emit('registerGoal', newGoal.value) // 부모 컴포넌트로 새로운 목표 전달
        if (modalInstance) {
          modalInstance.hide() // 모달 닫기
        }
        resetGoalForm() // 폼 초기화
      } else {
        console.error('Failed to submit goal:', response.data)
      }
    } catch (error) {
      console.error('Error submitting goal:', error)
    }
  } else {
    alert('모든 필드를 올바르게 입력해주세요.')
  }
}

// 모달 열기 함수
const show = () => {
  if (!modalInstance && modal.value) {
    modalInstance = new Modal(modal.value, {
      backdrop: 'static',
      keyboard: true
    })
    modalInstance.show()
  } else if (modalInstance) {
    modalInstance.show()
  }
}

// 폼 초기화 함수
const resetGoalForm = () => {
  newGoal.value = {
    type: '소비',
    title: '',
    totalAmount: 0
  }
}

// setup() 함수에서 외부에 함수 노출
defineExpose({
  show
})
</script>

<style scoped>
.modal-header {
  font-weight: bold;
}
.custom-register-btn {
  background-color: #ff007f;
  border-color: #ff007f;
  color: white;
}
.custom-register-btn:hover {
  background-color: #e60072;
  border-color: #e60072;
}
</style>
