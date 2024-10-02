<template>
  <div class="modal fade" id="expenseModal" tabindex="-1" aria-labelledby="expenseLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="expenseLabel" style="font-weight: bold;">소비 등록</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="padding: 32px; padding-bottom: 12px;">
          <!-- 유형 선택 -->
          <div class="mb-3" style="display: flex;">
            <label for="expenseType" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">유형</label>
            <select class="form-select" id="expenseType" v-model="expense.type">
              <option value="식료품">식료품</option>
              <option value="유흥">유흥</option>
              <option value="쇼핑">쇼핑</option>
              <option value="공과금">공과금</option>
              <option value="생활용품">생활용품</option>
              <option value="의료비">의료비</option>
              <option value="교통비">교통비</option>
              <option value="통신비">통신비</option>
              <option value="문화">문화</option>
              <option value="교육비">교육비</option>
              <option value="외식 · 숙박">외식 · 숙박</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <!-- 날짜 입력 -->
          <div class="mb-3" style="display: flex;">
            <label for="expenseDate" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">날짜</label>
            <input type="date" class="form-control" id="expenseDate" v-model="expense.date">
          </div>

          <!-- 가격 입력 -->
          <div class="mb-3" style="display: flex;">
            <label for="expenseAmount" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">가격</label>
            <div class="input-group">
              <input type="text" class="form-control" id="expenseAmount" v-model="expense.amount">
              <span class="input-group-text">원</span>
            </div>
          </div>

          <!-- 내용 입력 -->
          <div class="mb-3" style="display: flex;">
            <label for="expenseContent" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">내용</label>
            <input type="text" class="form-control" id="expenseContent" v-model="expense.content">
          </div>

          <!-- 메모 입력 -->
          <div class="mb-3" style="display: flex;">
            <label for="expenseMemo" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">메모</label>
            <input type="text" class="form-control" id="expenseMemo" v-model="expense.memo">
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

// 소비 항목 데이터
const expense = ref({
  type: '',
  date: '',
  amount: '',
  content: '',
  memo: ''
});

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
  // 입력된 데이터 확인 (추후 서버로 전송하거나 처리하는 로직 추가 가능)
  console.log("등록된 소비 데이터:", expense.value);

  // 서버로 데이터를 보내거나 로컬 저장소에 저장할 수 있습니다.
  // 예: axios.post('/api/expenses', expense.value);

  // 모달 닫기
  if (modalInstance) {
    modalInstance.hide();
  }

  // 데이터 초기화
  expense.value = {
    type: '',
    date: '',
    amount: '',
    content: '',
    memo: ''
  };
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
