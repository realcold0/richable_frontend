<!-- RC-P-26 -->
<template>
    <div class="modal fade" id="assetGoalDetailModal" tabindex="-1" aria-labelledby="assetGoalDetailLabel" aria-hidden="true" ref="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="assetGoalDetailLabel" style="font-weight: bold;">목표 자산 항목 조회</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" style="padding:32px; padding-bottom: 12px;">
            <!-- 분류 -->
            <div class="mb-3" style="display: flex; justify-content: space-between;">
              <label class="form-label" style="font-weight: bold;">분 류</label>
              <div>{{ goalDetail.type }}</div>
            </div>
            <!-- 목표량 -->
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
  import { ref, computed, onMounted, defineExpose } from 'vue';
  import { Modal } from 'bootstrap';
  
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
  
  // 목표 삭제 함수 (임시)
  const deleteGoal = () => {
    alert('삭제 기능 구현 필요');
  };
  
  // 컴포넌트가 마운트될 때 모달 초기화
  onMounted(() => {
    if (modal.value && !modalInstance) {
      modalInstance = new Modal(modal.value, {
        backdrop: 'static',
        keyboard: true,
      });
    }
  });
  
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
  