<template>
    <div class="modal fade" id="editAssetModal" tabindex="-1" aria-labelledby="editAssetLabel" aria-hidden="true"
        ref="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editAssetLabel" style="font-weight: bold;">현물 자산 항목 수정</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="padding:32px; padding-bottom: 12px;">
                    <!-- 분류 선택 -->
                    <div class="mb-3" style="display: flex;">
                        <label for="assetType" class="form-label"
                            style="font-weight: bold; width: 70px; letter-spacing: 13px; padding-top: 8px;">분류</label>
                        <select class="form-select" id="assetType" v-model="editedAsset.category">
                            <option value="asset">금융 자산</option>
                            <option value="tech">전자기기</option>
                            <option value="brand">브랜드</option>
                            <option value="luxury">명품</option>
                            <option value="etc">기타</option>
                        </select>
                    </div>
                    <!-- 자산명 입력 -->
                    <div class="mb-3" style="display: flex;">
                        <label for="assetName" class="form-label"
                            style="font-weight: bold; width: 70px; padding-top: 8px;">자산명</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="assetName" v-model="editedAsset.name">
                        </div>
                    </div>
                    <!-- 자산량 입력 -->
                    <div class="mb-3" style="display: flex;">
                        <label for="assetAmount" class="form-label"
                            style="font-weight: bold; width: 70px; padding-top: 8px;">자산량</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="assetAmount" v-model="editedAsset.price">
                            <span class="input-group-text">원</span>
                        </div>
                    </div>
                    <div class="mb-3" style="padding-top: 14px; color : #6C757D; font-size: 14px;">
                        <div>자산 항목을 다음과 같이 수정하시겠습니까?</div>
                    </div>
                </div>
                <div class="modal-footer d-flex justify-content-between">
                    <button type="button" class="btn" @click="deleteAsset">
                        <font-awesome-icon icon="trash-can" />
                    </button>
                    <div>
                        <button type="button" class="btn" data-bs-dismiss="modal"
                            style="background-color: white; border: 1px solid #020202; color : #020202; font-weight: bold; margin-right: 12px; width: 62px;">취소</button>
                        <button type="button" class="btn text-white"
                            style="background-color: #FF0062; width: 62px;" @click="updateAsset">수정</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Modal } from 'bootstrap';

// 이벤트를 상위 컴포넌트로 전달하기 위한 emit 정의
const emit = defineEmits(['update-asset', 'delete-asset']);

const modal = ref(null);
let modalInstance = null;
const editedAsset = ref({
  id: '',
  category: '',
  name: '',
  price: ''
});

// 모달 열기 함수 (선택된 자산 데이터를 받음)
const show = (asset) => {
  editedAsset.value = { ...asset }; // 선택한 자산 데이터를 editedAsset에 복사하여 입력 필드에 바인딩

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

// 자산 수정 함수
const updateAsset = () => {
  // 수정된 자산 데이터를 상위 컴포넌트로 전달
  emit('update-asset', { ...editedAsset.value });
  modalInstance.hide(); // 수정 후 모달 닫기
};

// 자산 삭제 함수
const deleteAsset = () => {
  // 삭제된 자산의 id를 상위 컴포넌트로 전달
  emit('delete-asset', { id: editedAsset.value.id });
  modalInstance.hide(); // 삭제 후 모달 닫기
};

// 모달 표시 함수 내보내기
defineExpose({ show });

</script>

<style scoped>
/* 커스텀 스타일 추가 */
.btn-pink {
  background-color: #ff007f;
}
</style>
