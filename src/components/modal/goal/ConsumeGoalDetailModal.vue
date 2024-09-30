<!-- RC-P-28 -->
<template>
    <div class="modal fade" id="consumeGoalDetailModal" tabindex="-1" aria-labelledby="consumeGoalDetailLabel" aria-hidden="true" ref="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="consumeGoalDetailLabel" style="font-weight: bold;">목표 자산 항목 조회</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" style="padding:32px; padding-bottom: 12px;">
            <!-- 분류 선택 -->
            <div class="mb-3" style="display: flex;">
              <label class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">분류</label>
              <div>{{ goalDetail.type }}</div>
            </div>
            <!-- 목표명 입력 -->
            <div class="mb-3" style="display: flex;">
              <label class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">목표명</label>
              <div>{{ goalDetail.name }}</div>
            </div>
            <!-- 목표량 입력 -->
            <div class="mb-3" style="display: flex;">
              <label class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">목표량</label>
              <div class="input-group">
                <div>{{ formattedAmount }}</div>
                <span class="input-group-text">원</span>
              </div>
            </div>
          </div>
          <div class="modal-footer d-flex">
            <button type="button" class="btn" @click="deleteGoal" style="background-color: white; border: 1px solid #020202; color: #020202; font-weight: bold; margin-right: 12px;">
              <font-awesome-icon icon="trash" />
            </button>
            <button type="button" class="btn" data-bs-dismiss="modal" style="background-color: white; border: 1px solid #020202; color: #020202; font-weight: bold; margin-right: 12px;">취소</button>
            <button type="button" class="btn text-white" style="background-color: #FF0062;">달성</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted, defineExpose, computed } from 'vue'; // computed 추가
  import { Modal } from 'bootstrap';
  
  // 목표 세부 정보를 위한 데이터
  const goalDetail = ref({
    type: '소비',  // 분류
    name: '에어팟',  // 목표명
    amount: 360000, // 목표량
  });
  
  // 목표량을 포맷팅
  const formattedAmount = computed(() => {
    return goalDetail.value.amount.toLocaleString();  // "360,000"
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
  </style>
  