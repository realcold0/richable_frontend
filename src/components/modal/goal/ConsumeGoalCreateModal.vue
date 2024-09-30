<!-- RC-P-29 -->
<template>
  <div class="modal fade" id="consumeGoalCreateModal" tabindex="-1" aria-labelledby="consumeGoalCreateLabel" aria-hidden="true"
      ref="modal">
      <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" id="consumeGoalCreateLabel" style="font-weight: bold;">소비 목표 등록</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body" style="padding:32px; padding-bottom: 12px;">
                  <!-- 분류 선택 -->
                  <div class="mb-3" style="display: flex;">
                      <label for="goalType" class="form-label"
                          style="font-weight: bold; width: 70px; letter-spacing: 13px; padding-top: 8px;">분류</label>
                      <select class="form-select" id="goalType" v-model="newGoal.type" placeholder="소비 유형을 선택해주세요">
                          <option value="소비">소비</option>
                          <option value="저축">저축</option>
                      </select>
                  </div>
                  <!-- 목표명 입력 -->
                  <div class="mb-3" style="display: flex;">
                      <label for="goalName" class="form-label"
                          style="font-weight: bold; width: 70px; padding-top: 8px;">목표명</label>
                      <div class="input-group">
                          <input type="text" class="form-control" id="goalName" v-model="newGoal.name" placeholder="목표명을 입력해주세요">
                      </div>
                  </div>
                  <!-- 목표량 입력 -->
                  <div class="mb-3" style="display: flex;">
                      <label for="goalAmount" class="form-label"
                          style="font-weight: bold; width: 70px; padding-top: 8px;">목표량</label>
                      <div class="input-group">
                          <input type="number" class="form-control" id="goalAmount" v-model="newGoal.amount" placeholder="목표량을 입력해주세요">
                          <span class="input-group-text">원</span>
                      </div>
                  </div>
                  <div class="mb-3" style="padding-top: 14px; color: #6C757D; font-size: 14px;">
                      <div>
                          소비 목표를 다음과 같이 등록하시겠습니까?
                      </div>
                  </div>
              </div>
              <div class="modal-footer d-flex">
                  <div>
                      <button type="button" class="btn" data-bs-dismiss="modal"
                          style="background-color: white; border: 1px solid #020202; color: #020202; font-weight: bold; margin-right: 12px; width: 62px;">취소</button>
                      <button type="button" class="btn text-white" @click="submitGoal"
                          style="background-color: #FF0062; width: 62px;">등록</button>
                  </div>
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

// 새 목표 데이터
const newGoal = ref({
type: '소비',
name: '',
amount: ''
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

// 모달 닫기 함수
const close = () => {
if (modalInstance) {
  modalInstance.hide();
}
resetForm(); // 폼 리셋
};

// 폼 리셋
const resetForm = () => {
newGoal.value = { type: '소비', name: '', amount: '' };
};

// 폼 제출
const submitGoal = () => {
// 목표를 제출하는 로직을 여기에 추가합니다.
console.log('새로운 목표:', newGoal.value);
close(); // 모달 닫기
};

// 컴포넌트가 마운트될 때 모달 초기화
onMounted(() => {
setTimeout(() => {
  if (modal.value && !modalInstance) {
    modalInstance = new Modal(modal.value, {
      backdrop: 'static',
      keyboard: true,
    });
  }
}, 500); // 500ms 정도 딜레이를 줌
});

// 외부에서 모달 열기를 가능하게 하기 위해 expose
defineExpose({ show });
</script>

<style scoped>
/* 커스텀 스타일 추가 */
.btn-pink {
  background-color: #ff007f;
}
</style>
