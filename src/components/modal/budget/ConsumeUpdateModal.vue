<template>
    <div class="modal fade" id="editAssetModal" tabindex="-1" aria-labelledby="editAssetLabel" aria-hidden="true"
        ref="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editAssetLabel" style="font-weight: bold;">소득 수정</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="padding:32px; padding-bottom: 12px;">
                    <!-- 분류 및 날짜 선택 -->
                    <div class="mb-3" style="display: flex; justify-content: space-between; gap: 10px;">
                        <!-- 분류 선택 -->
                        <div style="flex: 1;">
                            <label for="assetType" class="form-label" style="font-weight: bold;"></label>
                            <select class="form-select" id="assetType">
                                <option value="월급">월급</option>
                                <option value="비정기소득">비정기소득</option>
                                <option value="보너스">보너스</option>
                         
                            </select>
                        </div>

                        <!-- 날짜 선택 -->
                        <div style="flex: 1;">
                            <label for="expenseDate" class="form-label" style="font-weight: bold;"></label>
                            <input type="date" class="form-control" id="expenseDate" placeholder="날짜를 선택해주세요">
                        </div>
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
                    <button type="button" class="btn">
                        <font-awesome-icon icon="trash-can" />
                    </button>
                    <div>
                        <button type="button" class="btn" data-bs-dismiss="modal"
                            style="background-color: white; border: 1px solid #020202; color : #020202; font-weight: bold; margin-right: 12px; width: 62px;">취소</button>
                        <button type="button" class="btn text-white"
                            style="background-color: #FF0062; width: 62px;">수정</button>
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
  // setTimeout을 사용하여 DOM이 완전히 준비된 후 모달 초기화
  setTimeout(() => {
    if (modal.value && !modalInstance) {
      modalInstance = new Modal(modal.value, {
        backdrop: 'static',
        keyboard: true,
      });
    }
  }, 500); // 500ms 정도 딜레이를 줌
});

defineExpose({ show });
</script>

<style scoped>
/* 커스텀 스타일 추가 */
.btn-pink {
    background-color: #ff007f;
}
</style>
