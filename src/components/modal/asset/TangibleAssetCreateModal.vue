<template>
    <div class="modal fade" id="editAssetModal" tabindex="-1" aria-labelledby="editAssetLabel" aria-hidden="true"
        ref="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editAssetLabel" style="font-weight: bold;">현물 자산 항목 등록</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="padding:32px; padding-bottom: 12px;">
                    <!-- 분류 선택 -->
                    <div class="mb-3" style="display: flex;">
                        <label for="assetType" class="form-label"
                            style="font-weight: bold; width: 70px; letter-spacing: 13px; padding-top: 8px; ">분류</label>
                        <select class="form-select" id="assetType" v-model="selectedCategory" placeholder="자산 유형을 선택해주세요">
                            <option value="금융 자산">금융 자산</option>
                            <option value="전자기기">전자기기</option>
                            <option value="브랜드">브랜드</option>
                            <option value="명품">명품</option>
                            <option value="기타">기타</option>
                        </select>
                    </div>
                    <!-- 자산명 입력 -->
                    <div class="mb-3" style="display: flex;">
                        <label for="assetName" class="form-label"
                            style="font-weight: bold; width: 70px; padding-top: 8px;">자산명</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="assetName" v-model="editedAsset.name" placeholder="자산명을 입력해주세요">
                        </div>
                    </div>
                    <!-- 자산량 입력 -->
                    <div class="mb-3" style="display: flex;">
                        <label for="assetAmount" class="form-label"
                            style="font-weight: bold; width: 70px; padding-top: 8px;">자산량</label>
                        <div class="input-group">
                            <input type="text" class="form-control" id="assetAmount" v-model="editedAsset.price" placeholder="자산량을 입력해주세요">
                            <span class="input-group-text">원</span>
                        </div>
                    </div>
                    <div class="mb-3" style="padding-top: 14px; color : #6C757D; font-size: 14px;">
                        <div>
                            자산 항목을 다음과 같이 등록하시겠습니까?
                        </div>
                    </div>
                </div>
                <div class="modal-footer d-flex">
                    <div>
                        <button type="button" class="btn" data-bs-dismiss="modal"
                            style="background-color: white; border: 1px solid #020202; color : #020202; font-weight: bold; margin-right: 12px; width: 62px;">취소</button>
                        <button type="button" class="btn text-white"
                            style="background-color: #FF0062; width: 62px;" @click="createAsset">등록</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineExpose } from 'vue';
import { Modal } from 'bootstrap';

const emit = defineEmits(['create-asset']);

const modal = ref(null);
let modalInstance = null;

// 선택한 카테고리를 저장하는 ref
const selectedCategory = ref('');

// 자산 정보
const editedAsset = ref({
  id: '',
  category: '',
  name: '',
  price: ''
});


// 숫자에 쉼표를 추가하는 함수
const formatCurrency = (value) => {
  if (!value) return '';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};


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

// 자산 등록 함수
const createAsset = () => {
  // 선택된 카테고리 값을 자산 정보에 적용
  editedAsset.value.category = selectedCategory.value;

  // 입력된 자산 데이터를 상위 컴포넌트로 전달
  emit('create-asset', { ...editedAsset.value });
  modalInstance.hide(); // 등록 후 모달 닫기

  // 자산 정보 초기화 (다음 등록을 위해)
  editedAsset.value = {
    id: '',
    category: '',
    name: '',
    price: ''
  };
  selectedCategory.value = ''; // 카테고리도 초기화
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
/* 커스텀 스타일 추가 */
.btn-pink {
    background-color: #ff007f;
}
</style>
