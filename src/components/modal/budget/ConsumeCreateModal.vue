<!-- RC-P-21 -->
<template>
    <div class="modal fade" id="expenseModal" tabindex="-1" aria-labelledby="expenseLabel" aria-hidden="true" ref="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="expenseLabel" style="font-weight: bold;">소득 등록</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" style="padding: 32px; padding-bottom: 12px;">
            <!-- 유형 선택 -->
            <div class="mb-3" style="display: flex;">
              <label for="expenseType" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">유형</label>
              <select class="form-select" id="expenseType" placeholder="유형을 선택해주세요">
                <option value="월급">월급</option>
                <option value="비정기소득">비정기 소득</option>
                <option value="보너스">보너스</option>
              </select>
            </div>
  
            <!-- 날짜 입력 -->
            <div class="mb-3" style="display: flex;">
              <label for="expenseDate" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">날짜</label>
              <input type="date" class="form-control" id="expenseDate" placeholder="날짜를 선택해주세요">
            </div>
  
            <!-- 가격 입력 -->
            <div class="mb-3" style="display: flex;">
              <label for="expenseAmount" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">가격</label>
              <div class="input-group">
                <input type="text" class="form-control" id="expenseAmount" placeholder="가격을 입력해주세요">
                <span class="input-group-text">원</span>
              </div>
            </div>
  
            <!-- 내용 입력 -->
            <div class="mb-3" style="display: flex;">
              <label for="expenseContent" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">내용</label>
              <input type="text" class="form-control" id="expenseContent" placeholder="내용을 입력해주세요">
            </div>
  
            <!-- 메모 입력 -->
            <div class="mb-3" style="display: flex;">
              <label for="expenseMemo" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">메모</label>
              <input type="text" class="form-control" id="expenseMemo" placeholder="메모를 입력해주세요">
            </div>
          </div>
  
          <div class="modal-footer d-flex justify-content-between">
            <button type="button" class="btn" data-bs-dismiss="modal"
              style="background-color: white; border: 1px solid #020202; color: #020202; font-weight: bold; margin-right: 12px; width: 62px;">
              취소
            </button>
            <button type="button" class="btn text-white" style="background-color: #FF0062; width: 62px;" @click="registerExpense">
              완료
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, defineExpose } from 'vue';
  import { Modal } from 'bootstrap';
  
  const modal = ref(null);
  let modalInstance = null;
  
  // 모달 열기 함수
  const show = () => {
    if (!modalInstance && modal.value) {
      modalInstance = new Modal(modal.value, {
        backdrop: 'static', // 명시적으로 backdrop 설정
        keyboard: true, // 키보드 이벤트 처리 허용
      });
      modalInstance.show(); // 모달 표시
    } else if (modalInstance) {
      modalInstance.show(); // 이미 초기화된 경우 다시 표시
    }
  };
  
  // 컴포넌트가 마운트될 때 모달 초기화
  onMounted(() => {
    if (modal.value && !modalInstance) {
      modalInstance = new Modal(modal.value, {
        backdrop: 'static',
        keyboard: true
      });
    }
  });
  
  // 완료 버튼 클릭 시 동작
  const registerExpense = () => {
    // 데이터를 처리하거나 서버에 전송하는 코드 추가 가능
    console.log("Expense 등록 완료!");
  
    // 모달 닫기
    if (modalInstance) {
      modalInstance.hide();
    }
  };
  
  defineExpose({ show });
  </script>
  
  <style scoped>
  /* 모달 창 스타일 추가 */
  .modal-content {
    border-radius: 10px;
  }
  
  .btn-pink {
    background-color: #ff007f;
  }
  </style>
  