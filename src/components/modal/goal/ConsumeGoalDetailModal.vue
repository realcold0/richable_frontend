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
            style="background-color: white; border: 1px solid #020202; color: #020202; font-weight: bold; margin-right: 12px;"
          >
            <font-awesome-icon icon="trash" />
          </button>
          <button
            type="button"
            class="btn"
            data-bs-dismiss="modal"
            style="background-color: white; border: 1px solid #020202; color: #020202; font-weight: bold; margin-right: 12px;"
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
import { ref, onMounted, computed, defineEmits, defineExpose } from 'vue'
import { Modal } from 'bootstrap'

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
const formattedAmount = computed(() => goalDetail.value.amount.toLocaleString())

const modal = ref(null)
let modalInstance = null

// 모달 열기 함수
const show = (goalData) => {
  console.log("goalData:", goalData); // goalData 로그 확인

  // progress 값이 undefined가 아닌지 확인
  if (typeof goalData.progress === 'undefined') {
    console.error("progress 값이 없습니다!");
    return;
  }

  goalDetail.value = { 
    ...goalData,
    progress: goalData.progress || 0 // progress 값도 포함
 
  }  // goalData를 전체 복사하여 goalDetail에 설정
  console.log("goalDetail after setting:", goalDetail.value); // goalDetail 설정 후 로그 확인
  
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

// 목표 삭제 핸들러
const deleteGoalHandler = () => {
  emit('deleteGoal', goalDetail.value.id) // 부모 컴포넌트로 목표 ID 전송
  if (modalInstance) {
    modalInstance.hide() // 목표 삭제 후 모달 닫기
  }
}

// 목표 달성 핸들러
const achieveGoal = () => {
  const progress = Number(goalDetail.value.progress);  // progress 값을 숫자로 변환
  console.log("goalDetail.progress (as number):", progress);  // 숫자로 변환한 후 로그 확인

  // 비교 시 정확하게 100인지 확인
  if (progress !== 100) {  
    alert("아직 달성되지 않았습니다.");
    return;
  }

  emit('achieveGoal', goalDetail.value.id);
  modalInstance.hide();
  alert('목표가 달성되었습니다.');
};



// 이벤트 emit 정의
const emit = defineEmits(['deleteGoal', 'achieveGoal'])

// 컴포넌트 마운트 시 모달 초기화
onMounted(() => {
  if (modal.value && !modalInstance) {
    modalInstance = new Modal(modal.value, {
      backdrop: 'static',
      keyboard: true
    })
  }
})

defineExpose({
  show
})
</script>

<style scoped>
.modal-header {
  font-weight: bold;
}
</style>
