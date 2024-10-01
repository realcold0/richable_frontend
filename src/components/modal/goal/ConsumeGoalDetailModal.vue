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
          <!-- 분류 선택 -->
          <div class="mb-3" style="display: flex">
            <label class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px"
              >분류</label
            >
            <div>{{ goalDetail.type }}</div>
          </div>
          <!-- 목표명 입력 -->
          <div class="mb-3" style="display: flex">
            <label class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px"
              >목표명</label
            >
            <div>{{ goalDetail.name }}</div>
          </div>
          <!-- 목표량 입력 -->
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
            @click="achieveGoal"
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
import { ref, onMounted, defineExpose, computed, defineEmits } from 'vue'
import { Modal } from 'bootstrap'

// 목표 리스트 상태
const goals = ref([
  { id: 1, title: '에어팟', totalAmount: 360000, currentAmount: 120000, progress: 33 },
  { id: 2, title: '아이패드', totalAmount: 500000, currentAmount: 250000, progress: 50 },
  { id: 3, title: '노트북', totalAmount: 1000000, currentAmount: 500000, progress: 50 }
])

// 선택한 목표 상세 데이터
const goalDetail = ref({
  id: null, // 목표 ID
  type: '', // 분류
  name: '', // 목표명
  amount: 0 // 목표량
})

// 목표 삭제를 위한 변수
let goalToDelete = ref(null)

// 목표량 포맷팅
const formattedAmount = computed(() => {
  return goalDetail.value.amount.toLocaleString() // "360,000"
})

const modal = ref(null)
let modalInstance = null

// 모달 열기 함수
const show = (goalData) => {
  goalDetail.value = goalData
  goalToDelete.value = goalData // 삭제를 위한 목표 저장
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

// 목표 삭제 함수
// const deleteGoal = () => {
//   if (goalToDelete.value) {
//     goals.value = goals.value.filter((goal) => goal.id !== goalToDelete.value.id) // 목표 삭제
//     goalToDelete.value = null
//     modalInstance.hide() // 모달 닫기
//   }
// }

const deleteGoalHandler = () => {
  emit('deleteGoal', goalDetail.value.id) // 부모 컴포넌트로 목표 ID를 함께 전송
  if (modalInstance) {
    modalInstance.hide() // 목표 삭제 후 모달 닫기
  }
}


// 이벤트 emit 정의
const emit = defineEmits(['deleteGoal'])

// 목표 달성 함수
const achieveGoal = () => {
  const goal = goals.value.find((goal) => goal.id === goalDetail.value.id)
  if (goal) {
    goal.progress = 100 // 목표 달성 100%로 변경
    modalInstance.hide() // 모달 닫기
    alert('목표가 달성되었습니다.')
  }
}

// 컴포넌트 마운트 시 모달 초기화
onMounted(() => {
  if (modal.value && !modalInstance) {
    modalInstance = new Modal(modal.value, {
      backdrop: 'static',
      keyboard: true
    })
  }
})

defineExpose({ show })
</script>

<style scoped>
.modal-header {
  font-weight: bold;
}

.input-group-text {
  border: none;
  background: transparent;
}

.modal-footer .btn-pink {
  background-color: #ff007f;
}
</style>
