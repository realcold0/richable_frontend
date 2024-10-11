<template>
  <div
    class="modal fade"
    id="consumeGoalDetailModal"
    tabindex="-1"
    aria-labelledby="consumeGoalDetailLabel"
    aria-hidden="true"
    ref="modal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="consumeGoalDetailLabel" style="font-weight: bold">
            목표 자산 항목 조회
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body" style="padding: 32px; padding-bottom: 12px">
          <div class="mb-3" style="display: flex">
            <label class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px"
              >분류</label
            >
            <div>{{ goalDetail.type }}</div>
          </div>
          <div class="mb-3" style="display: flex">
            <label class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px"
              >목표명</label
            >
            <div>{{ goalDetail.name }}</div>
          </div>
          <div class="mb-3" style="display: flex">
            <label class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px"
              >목표량</label
            >
            <div class="input-group">
              <div>{{ formattedAmount }}</div>
              <span class="input-group-text">원</span>
            </div>
          </div>
        </div>
        <div class="modal-footer d-flex">
          <button
            type="button"
            class="btn"
            @click="deleteGoalHandler"
            style="
              background-color: white;
              border: 1px solid #020202;
              color: #020202;
              font-weight: bold;
              margin-right: 12px;
            "
          >
            <font-awesome-icon icon="trash" />
          </button>
          <button
            type="button"
            class="btn"
            data-bs-dismiss="modal"
            style="
              background-color: white;
              border: 1px solid #020202;
              color: #020202;
              font-weight: bold;
              margin-right: 12px;
            "
          >
            취소
          </button>
          <button
            type="button"
            class="btn text-white"
            @click="achieveGoalHandler"
            style="background-color: #ff0062"
          >
            달성
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits, defineExpose } from 'vue'
import { Modal } from 'bootstrap'
// import axios from 'axios'
import Instance from '@/AxiosInstance.js'

// 목표 상세 데이터
const goalDetail = ref({
  id: null,
  type: '',
  name: '',
  amount: 0
})

// 목표량 포맷팅
const formattedAmount = computed(() => goalDetail.value.amount.toLocaleString())

const modal = ref(null)
let modalInstance = null

// 모달 열기 함수
// 모달 열기 함수
const show = (goalData) => {
  console.log('Received goalData:', goalData) // goalData가 정확한지 확인

  // index 값이 있는지 확인하고 추가
  goalDetail.value = {
    id: goalData.id,
    index: goalData.index || goalData.id, // index가 없으면 id를 사용
    type: goalData.type,
    name: goalData.name,
    amount: goalData.amount,
    progress: goalData.progress
  }

  if (!modalInstance && modal.value) {
    modalInstance = new Modal(modal.value, {
      backdrop: 'static',
      keyboard: true
    })
    modalInstance.show()
  } else if (modalInstance) {
    modalInstance.show()
  }

  console.log('Goal detail set to:', goalDetail.value) // goalDetail 값 로그 출력
}

const deleteGoalHandler = async () => {
  try {
    console.log('Attempting to delete goal with index:', goalDetail.value.index) // 로그 출력

    const response = await Instance({
      method: 'delete',
      url: '/goal/delete',
      data: {
        index: goalDetail.value.index, // index 값 전송
        category: goalDetail.value.type // type을 category로 사용하여 전송
      }
    })

    if (response.data && response.data.success) {
      // UI에서 목표 삭제 처리
      emit('deleteGoal', goalDetail.value.id)
      modalInstance.hide()
    } else {
      console.error('Failed to delete goal:', response.data)
      alert('새로고침 후 다시 시도해주세요.')
    }
  } catch (error) {
    console.error('Error deleting goal:', error)
  }
}

const achieveGoalHandler = async () => {
  const progress = Number(goalDetail.value.progress)

  // 목표가 정확히 100% 달성되었는지 확인
  if (progress === 100) {
    try {
      // PUT 요청으로 목표 달성 상태를 업데이트
      const response = await Instance({
        method: 'put',
        url: '/goal/set', // 목표 달성 API 경로
        data: {
          index: goalDetail.value.index, // index 값을 전달
          isAchive: true // isAchive 값을 true로 설정
        }
      })

      if (response.data.success) {
        alert('목표가 달성되었습니다.')
        emit('achieveGoal', goalDetail.value.index) // 부모 컴포넌트로 목표 index 전달
        modalInstance.hide()
      } else {
        console.error('Goal achievement failed:', response.data)
        alert('목표 달성에 실패했습니다.')
      }
    } catch (error) {
      console.error('Error achieving goal:', error)
    }
  } else {
    alert('목표가 아직 달성되지 않았습니다.')
  }
}

// 이벤트 emit 정의
const emit = defineEmits(['deleteGoal', 'achieveGoal'])

defineExpose({ show })
</script>

<style scoped>
.modal-header {
  font-weight: bold;
}
</style>
