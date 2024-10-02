<template>
    <div class="modal fade" id="detailModal" tabindex="-1" aria-labelledby="detailModalLabel" aria-hidden="true" ref="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="detailModalLabel" style="font-weight: bold;">소득 상세 조회</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" style="padding:20px; padding-bottom: 12px;">
            <!-- 분류 -->
            <div class="mb-3" style="display: flex; align-items: center;">
  <label for="expenseType" class="form-label" style="font-weight: bold; width: 70px; padding-top: 0;">분류</label>
  <input type="text" class="form-control" readonly v-model=props.detail.category />
</div>

<div class="mb-3" style="display: flex; align-items: center;">
  <label for="expenseDate" class="form-label" style="font-weight: bold; width: 70px; padding-top: 0;">날짜</label>
  <input type="text" class="form-control" readonly v-model=props.detail.date />
</div>

            <!-- 가격 -->
            <div class="mb-3" style="display: flex;">
              <label class="form-label" style="font-weight: bold; width: 70px;">가격</label>
              <div class="input-group" style="flex-grow: 1;">
                <input type="text" class="form-control" readonly v-model=props.detail.amount />
                <span class="input-group-text">원</span>
              </div>
            </div>
  
            <!-- 내용 -->
            <div class="mb-3" style="display: flex;">
              <label class="form-label" style="font-weight: bold; width: 70px;">내용</label>
              <input type="text" class="form-control" readonly v-model=props.detail.content />
            </div>
  
            <!-- 메모 -->
            <div class="mb-3" style="display: flex;">
              <label class="form-label" style="font-weight: bold; width: 70px;">메모</label>
              <input type="text" class="form-control" readonly v-model=props.detail.memo />
            </div>
          </div>
  
          <!-- 모달 하단 버튼 -->
          <div class="modal-footer d-flex justify-content-between">
            <button type="button" class="btn" @click="editEntry" style="background-color: white; border: 1px solid #020202;">
              <font-awesome-icon :icon="['fas', 'pen-to-square']" />
            </button>
            <div>
              <button type="button" class="btn" data-bs-dismiss="modal" style="background-color: white; border: 1px solid #020202; color: #020202; font-weight: bold; width: 62px;">취소</button>
              <button type="button" class="btn text-white" style="background-color: #FF0062; width: 62px;">완료</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ConsumeUpdateModal ref="updateModal2" />
  </template>
  
  <script setup>
  import { ref, onMounted, defineExpose,defineProps,defineEmits } from 'vue';
  import { Modal } from 'bootstrap';
  import ConsumeUpdateModal from '@/components/modal/budget/ConsumeUpdateModal.vue';

  const props = defineProps({ detail: { type: Object, required: true } }); 
  
  const modal = ref(null);
  let modalInstance = null;
  const updateModal2 = ref(null);
  
  const show = () => {
    if (!modalInstance && modal.value) {
      modalInstance = new Modal(modal.value, {
        backdrop: 'static', 
        keyboard: false, 
      });
      modalInstance.show(); 
    } else if (modalInstance) {
      modalInstance.show(); 
    }
  };
  
  onMounted(() => {
    console.log( props );
    setTimeout(() => {
      if (modal.value && !modalInstance) {
        modalInstance = new Modal(modal.value, {
          backdrop: 'static',
          keyboard: true,
        });
      }
    }, 500);
  });
  
  const editEntry = () => {
  // 수입 상세 모달 (IncomeDetailModal)을 닫기
  if (modalInstance) {
    modalInstance.hide(); // IncomeDetailModal 모달 닫기
  }

  // 수입 수정 모달 (IncomeUpdateModal)을 열기 
  if (updateModal2.value && updateModal2.value.show) {
    updateModal2.value.show(); // IncomeUpdateModal 모달 열기 힘들었어 
  } else {
    console.log('Consume이 로드되지 않음');
  }
};
  
  defineExpose({ show });
  </script>
  
  <style scoped>
  .modal-header {
    border-bottom: none;
  }
  
  .modal-footer {
    border-top: none;
  }
  
  .btn {
    font-weight: bold;
  }
  
  .btn-pink {
    background-color: #ff007f;
    color: white;
  }
  
  .input-group-text {
    background-color: white;
  }
  
  .input-group-text i {
    font-size: 1.2em;
  }
  </style>
  