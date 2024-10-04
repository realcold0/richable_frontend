<template>
  <div class="modal fade" id="editAssetModal" tabindex="-1" aria-labelledby="editAssetLabel" aria-hidden="true" ref="modal">
    <div class="modal-dialog">
      <!-- 삭제 모달이 열리면 수정 모달에 흐림 효과 적용 -->
      <div class="modal-content" :class="{ 'blur-background': isDeleteModalVisible }">
        <div class="modal-header">
          <h5 class="modal-title" id="editAssetLabel" style="font-weight: bold;">소비 수정</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="padding:32px; padding-bottom: 12px;">
          <!-- 분류 및 날짜 선택 -->
          <div class="mb-3" style="display: flex; justify-content: space-between; gap: 10px;">
            <!-- 분류 선택 -->
            <div style="flex: 1;">
              <label for="assetType" class="form-label" style="font-weight: bold;"></label>
              <select class="form-select" id="assetType" v-model="expCategory">
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
                <option value="외식 • 숙박">외식 • 숙박</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <!-- 날짜 선택 -->
            <div style="flex: 1;">
              <label for="expenseDate" class="form-label" style="font-weight: bold;"></label>
              <input type="date" class="form-control" id="expenseDate" v-model="date" placeholder="날짜를 선택해주세요">
            </div>
          </div>

          <!-- 가격 입력 -->
          <div class="mb-3" style="display: flex;">
            <label for="expenseAmount" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">가격</label>
            <div class="input-group">
              <input type="text" class="form-control" id="expenseAmount" v-model="amount" placeholder="가격을 입력해주세요">
              <span class="input-group-text">원</span>
            </div>
          </div>

          <!-- 내용 입력 -->
          <div class="mb-3" style="display: flex;">
            <label for="expenseContent" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">내용</label>
            <input type="text" class="form-control" id="expenseContent" v-model="descript" placeholder="내용을 입력해주세요">
          </div>

          <!-- 메모 입력 -->
          <div class="mb-3" style="display: flex;">
            <label for="expenseMemo" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">메모</label>
            <input type="text" class="form-control" id="expenseMemo" v-model="memo" placeholder="메모를 입력해주세요">
          </div>
        </div>
        <div class="modal-footer d-flex justify-content-between">
          <button type="button" class="btn" @click="showDeleteConfirmation">
            <font-awesome-icon icon="trash-can" />
          </button>
          <div>
            <button type="button" class="btn" data-bs-dismiss="modal"
              style="background-color: white; border: 1px solid #020202; color : #020202; font-weight: bold; margin-right: 12px; width: 62px;">취소</button>
            <button type="button" class="btn text-white"
              style="background-color: #FF0062; width: 62px;" @click="updateOutcome">수정</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 삭제 확인 모달 -->
    <div class="modal fade" id="deleteConfirmationModal" tabindex="-1" aria-labelledby="deleteConfirmationLabel" aria-hidden="true" ref="deleteModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteConfirmationLabel" style="font-weight: bold;">삭제 확인</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeDeleteModal"></button>
          </div>
          <div class="modal-body">
            정말로 삭제하시겠습니까?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeDeleteModal">아니오</button>
            <button type="button" class="btn text-white" 
              style="background-color: #FF0062;" @click="confirmDelete">예</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, defineExpose } from 'vue';
import axios from 'axios';
import { Modal } from 'bootstrap';


const modal = ref(null);
const deleteModal = ref(null);  // 삭제 확인 모달
let modalInstance = null;
let deleteModalInstance = null;  // 삭제 확인 모달 인스턴스
const isDeleteModalVisible = ref(false); // 삭제 모달 표시 여부

// 소비 데이터 바인딩
const index = ref('');  // index는 수정하지 않고 그대로 불러옴
const expCategory = ref('');
const date = ref('');
const amount = ref('');
const descript = ref('');
const memo = ref('');

// 모달 열기 함수
const show = (data) => {
  console.log("데이터 수신:", data);  // 데이터 확인 로그

  if (!modalInstance && modal.value) {
    modalInstance = new Modal(modal.value, {
      backdrop: 'static',
      keyboard: true,
    });
    modalInstance.show();
  } else if (modalInstance) {
    modalInstance.show();
  }

  // 모달을 연 후 값 설정
  setTimeout(() => {
    if (data) {
      index.value = data.index;  // index 값 불러오기만 함
      expCategory.value = data.expCategory;
      date.value = data.date;
      amount.value = data.amount;
      descript.value = data.descript;
      memo.value = data.memo;
    }
  }, 100);  // 100ms 딜레이 추가
};

// 삭제 확인 모달 열기
const showDeleteConfirmation = () => {
  isDeleteModalVisible.value = true; // 삭제 모달이 표시되면 상태 업데이트
  if (!deleteModalInstance && deleteModal.value) {
    deleteModalInstance = new Modal(deleteModal.value, {
      backdrop: 'static',
      keyboard: true,
    });
    deleteModalInstance.show();
  } else if (deleteModalInstance) {
    deleteModalInstance.show();
  }
};

// 삭제 모달 닫기 함수
const closeDeleteModal = () => {
  isDeleteModalVisible.value = false; // 삭제 모달이 닫히면 수정 모달의 흐림 효과 제거
};

// 삭제 확인 후 실제 삭제 동작
const confirmDelete = async () => {
  try {
    const indexValue = typeof index.value === 'object' ? index.value.id : index.value;

    const response = await axios.delete(`http://localhost:8080/outcome/delete/${indexValue}`);

    if (response.data.success) {
      console.log("소비 삭제 성공:", response.data.response.data);
      if (modalInstance) {
        modalInstance.hide();  // 삭제 후 수정 모달 닫기
      }
      if (deleteModalInstance) {
        deleteModalInstance.hide();  // 삭제 확인 모달 닫기
      }
      isDeleteModalVisible.value = false; // 삭제 모달 닫힘
    } else {
      console.error("소비 삭제 실패:", response.data.message);
    }
  } catch (error) {
    console.error("소비 삭제 실패:", error.response ? error.response.data : error);
  }
};

// 소비 수정 요청 (PUT)
const updateOutcome = async () => {
  try {
    const outcomeData = {
      index: index.value,  // index는 수정하지 않고 그대로 서버에 전달
      expCategory: expCategory.value,
      amount: parseInt(amount.value),
      descript: descript.value,
      memo: memo.value,
    };

    const response = await axios.put('http://localhost:8080/outcome/update', outcomeData);  // PUT 요청으로 데이터 전달

    if (response.data.success) {
      console.log("소비 수정 성공:", response.data.response.data);
      if (modalInstance) {
        modalInstance.hide();  // 수정 성공 후 모달 닫기
      }
    } else {
      console.error("소비 수정 실패:", response.data.message);
    }
  } catch (error) {
    console.error("소비 수정 실패:", error.response ? error.response.data : error);
  }
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
    if (deleteModal.value && !deleteModalInstance) {
      deleteModalInstance = new Modal(deleteModal.value, {
        backdrop: 'static',
        keyboard: true,
      });
    }
  }, 500);  // 500ms 딜레이
});

defineExpose({ show });
</script>

<style scoped>
.modal-content {
  border-radius: 10px;
}

.btn-pink {
    background-color: #ff007f;
}

/* 삭제 모달이 열리면 흐리게 표시 */
.blur-background {
  backdrop-filter: blur(5px);
  opacity: 0.6;
}
</style>
