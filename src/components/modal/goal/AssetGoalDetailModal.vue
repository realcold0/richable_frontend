<!-- RC-P-26 -->
<template>
  <div class="modal fade" 
  id="assetGoalDetailModal" 
  tabindex="-1" 
  aria-labelledby="assetGoalDetailLabel" 
  aria-hidden="true" 
  ref="modal">
    
  <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="assetGoalDetailLabel" style="font-weight: bold;">목표 자산 항목 조회</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="padding:32px; padding-bottom: 12px;">
          <div class="mb-3" style="display: flex; justify-content: space-between;">
            <label class="form-label" style="font-weight: bold;">분 류</label>
            <div>{{ goalDetail.type }}</div>
          </div>
          <div class="mb-3" style="display: flex; justify-content: space-between;">
            <label class="form-label" style="font-weight: bold;">목표량</label>
            <div class="input-group" style="text-align: right;">
              <div>{{ formattedAmount }}</div>
              <span class="input-group-text">원</span>
            </div>
          </div>
        </div>
        <div class="modal-footer d-flex justify-content-between">
          <button type="button" class="btn" @click="deleteGoal" style="background-color: white; border: 1px solid #020202; color: #020202; font-weight: bold;">
            <font-awesome-icon icon="trash" />
          </button>
          <div>
            <button type="button" class="btn" data-bs-dismiss="modal" style="background-color: white; border: 1px solid #020202; color: #020202; font-weight: bold; margin-right: 12px;">취소</button>
            <button type="button" class="btn text-white" style="background-color: #FF0062;">달성</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineExpose } from 'vue';
import { Modal } from 'bootstrap';


// emit 함수 정의 (Vue 3)
const emit = defineEmits(['goalDeleted']);

// 목표 세부 정보를 위한 데이터
const goalDetail = ref({
  type: '자산 형성',  // 분류
  amount: 100000000, // 목표량
});

// 목표량을 포맷팅
const formattedAmount = computed(() => {
  return goalDetail.value.amount.toLocaleString();  // 포맷: "100,000,000"
});

const modal = ref(null);
let modalInstance = null;

// 모달 열기 함수
const show = (goalData) => {
  goalDetail.value = goalData;
  if (!modalInstance && modal.value) {
    modalInstance = new Modal(modal.value, {
      backdrop: 'static',
      keyboard: true,
    });
    modalInstance.show();
  } else if (modalInstance) {
    modalInstance.show();
  }
};

// 목표 삭제 함수
const deleteGoal = () => {
  modalInstance.hide();
  emit('goalDeleted');  // 부모 컴포넌트로 삭제 이벤트 전달
};

defineExpose({ show });
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
  
  .modal-footer .btn {
    border-radius: 6px;
    padding: 8px 16px;
  }
  </style>
  