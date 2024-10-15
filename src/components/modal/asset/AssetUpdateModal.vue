<template>
    <div class="modal fade" id="editAssetModal" tabindex="-1" aria-labelledby="editAssetLabel" aria-hidden="true" ref="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editAssetLabel" style="font-weight: bold;">금융 자산 항목 수정</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" style="padding: 32px; padding-bottom: 12px;">
            <!-- 자산 유형 선택 -->
            <div class="mb-3" style="display: flex;">
              <label for="assetType" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">분류</label>
              <select class="form-select" id="assetType" v-model="selectedAssetType">
                <option value="stock">주식</option>
                <option value="bond">채권</option>
                <option value="coin">코인</option>
                <option value="cash">현금</option>
              </select>
            </div>
  
              <!-- 자산 이름 선택 -->
              <div v-if="selectedAssetType === 'coin'" class="mb-3" style="display: flex;">
              <label for="assetName" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">이름</label>
              <select class="form-select" id="assetName" v-model="editedAsset.name" disabled>
                  <option>{{ editedAsset.name }}</option>
              </select>
              </div>
  
              <div v-if="selectedAssetType === 'stock'" class="mb-3" style="display: flex;">
              <label for="assetName" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">이름</label>
              <select class="form-select" id="assetName" v-model="editedAsset.name" disabled >
                  <option>{{ editedAsset.name }}</option> <!-- 현재 선택된 주식의 이름 표시 -->
              </select>
              </div>
  
  
              <div v-if="selectedAssetType === 'bond'" class="mb-3" style="display: flex;">
              <label for="assetName" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">이름</label>
              <select class="form-select" id="assetName" v-model="editedAsset.name" disabled>
                  <option>{{ editedAsset.name }}</option>
              </select>
              </div>
  
              <!-- 자산 가격 입력 -->
              <div class="mb-3" style="display: flex;">
              <label for="assetAmount" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">평단가</label>
              <div class="input-group">
                  <input type="text" class="form-control" id="assetAmount" v-model="editedAsset.price" disabled/>
                  <span class="input-group-text">원</span>
              </div>
              </div>
  
              <!-- 추가 자산량 입력 -->
              <div v-if="showAdditionalInput" class="mb-3" style="display: flex;">
              <label for="additionalAmount" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">수량</label>
              <div class="input-group">
                  <input type="text" class="form-control" id="additionalAmount" v-model="editedAsset.quantity" />
                  <span class="input-group-text">개</span>
              </div>
              </div>
  
              <!-- 총액 계산 -->
              <div v-if="selectedAssetType !== 'cash'" class="mb-3" style="display: flex;">
              <label for="assetTotalAmount" class="form-label" style="font-weight: bold; width: 70px; padding-top: 8px;">총액</label>
              <div class="input-group">
                  <input type="text" id="assetTotalAmount" class="form-control" :value="formattedTotalAmount" disabled />
                  <span class="input-group-text">원</span>
              </div>
  
  
              </div>
  
  
            <div class="mb-3" style="padding-top: 14px; color: #6C757D; font-size: 14px;">
              <div>자산 항목을 다음과 같이 수정하시겠습니까?</div>
            </div>
          </div>
          <div class="modal-footer d-flex justify-content-between">
            <button type="button" class="btn" @click="deleteData">
              <font-awesome-icon icon="trash-can" />
            </button>
            <div>
              <button type="button" class="btn" data-bs-dismiss="modal" style="background-color: white; border: 1px solid #020202; color: #020202; font-weight: bold; margin-right: 12px; width: 62px;">
                취소
              </button>
              <button type="button" class="btn text-white" style="background-color: #FF0062; width: 62px;" @click="submitData">등록</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed, defineExpose } from 'vue';
  import { Modal } from 'bootstrap';
  import axiosInstance from '@/AxiosInstance';
  
  const modal = ref(null);
  let modalInstance = null;
  const editedAsset = ref({
    index: 0,
    category: '',
    name: '',
    price: 0,
    quantity: 0 // 수량 추가
  });
  const originalAsset = ref({}); // originalAsset 정의
  const selectedAssetType = ref(''); // 자산 유형 정의
  
  // 추가 입력 필드 표시 여부 계산 속성
  const showAdditionalInput = computed(() => {
    return selectedAssetType.value === 'stock' || selectedAssetType.value === 'bond' || selectedAssetType.value === 'coin';
  });
  
  // 총액 계산 computed property
  const formattedTotalAmount = computed(() => {
    const total = editedAsset.value.price * editedAsset.value.quantity;
    return total.toLocaleString(); // 천 단위 쉼표 추가
  });
  
  const show = (asset, assetType) => {
    if (!asset) {
      console.warn('수정할 자산 정보가 없습니다.');
      return;
    }
  
    selectedAssetType.value = assetType; // 자산 유형 설정
    const { addDate, ...rest } = asset; // addDate를 제외하고 나머지를 rest로 받음
  
    console.log("Asset data:", asset); // 자산 데이터 확인
    console.log("Asset index:", asset.index); // 인덱스 확인
  
    // editedAsset 값 설정
    if (assetType === 'stock') {
      editedAsset.value = {
        index: asset.index,
        category: 'stock',
        name: asset.prdtName, // 주식 이름
        price: asset.avgBuyPrice, // 평균 구매가
        quantity: asset.hldgQty // 보유 수량
      };
    } else if (assetType === 'bond') {
      editedAsset.value = {
        index: asset.index,
        category: 'bond',
        name: asset.name, // 채권 이름
        price: asset.price, // 채권 가격
        quantity: asset.cnt // 보유 수량
      };
    } else if (assetType === 'coin') {
      editedAsset.value = {
        index: asset.index,
        category: 'coin',
        name: asset.currency, // 코인 통화
        price: asset.avgBuyPrice, // 평균 구매가
        quantity: asset.balance // 보유량
      };
    }
  
    // 모달 표시
    if (!modalInstance && modal.value) {
      modalInstance = new Modal(modal.value, {
        backdrop: 'static',
        keyboard: true
      });
      modalInstance.show();
    } else if (modalInstance) {
      modalInstance.show();
    }
  };
  
  // 이벤트를 상위 컴포넌트로 전달하기 위한 emit 정의
  const emit = defineEmits(['update-asset', 'delete-asset']);
  
  const submitData = async () => {
    let payload = {}; // payload 변수를 함수 시작 부분에서 정의
  
    try {
      // 선택한 자산 유형에 따라 payload 구성
      if (selectedAssetType.value === 'stock') {
        payload = {
          index: editedAsset.value.index, // 주식의 고유 ID
          prdtName: editedAsset.value.name, // 주식 이름
          hldgQty: editedAsset.value.quantity, // 보유 수량
          avgBuyPrice: parseInt(editedAsset.value.price, 10) // 평균 구매가를 정수형으로 변환
        };
      } else if (selectedAssetType.value === 'bond') {
        payload = {
          index: editedAsset.value.index,
          name: editedAsset.value.name, // 채권 이름
          cnt: editedAsset.value.quantity, // 보유 수량
          price: parseInt(editedAsset.value.price, 10) // 채권 가격을 정수형으로 변환
        };
      } else if (selectedAssetType.value === 'coin') {
        payload = {
          index: editedAsset.value.index,
          currency: editedAsset.value.name, // 코인 통화
          balance: editedAsset.value.quantity, // 보유량
          avgBuyPrice: parseInt(editedAsset.value.price, 10) // 평균 구매가를 정수형으로 변환
        };
      }
  
      // payload가 비어있는지 확인
      if (Object.keys(payload).length === 0) {
        console.error('Payload가 정의되지 않았습니다.');
        return; // 더 이상 진행하지 않음
      }
  
      console.log('Payload 전송:', payload); // payload 출력
  
      // 데이터 전송 (Axios 사용)
      const response = await axiosInstance.put(`/asset/${selectedAssetType.value}/update`, payload);
      
      console.log('등록 성공:', response.data);
  
      // 성공시 부모 컴포넌트에 이벤트 전달
      emit('update-asset', selectedAssetType.value, payload); // payload로 수정된 자산 데이터를 전달
  
      // 성공시 모달 닫기
      modalInstance.hide(); // 모달 닫기
    } catch (error) {
      console.error('데이터 전송 중 오류 발생:', error);
      if (error.response) {
        console.error('응답 데이터:', error.response.data); // 오류 응답 데이터 출력
      }
    }
  };
  
  
  
  // 자산 삭제 함수
  const deleteData = async () => {
    try {
      console.log(selectedAssetType.value);
      console.log(editedAsset.value.index);
  
      const response = await axiosInstance.delete(`/asset/${selectedAssetType.value}/delete/${editedAsset.value.index}`);
      console.log('삭제 성공:', response.data);
  
       // 삭제 후 부모 컴포넌트에 이벤트 전달 (자산 유형과 index 전달)
      emit('delete-asset', selectedAssetType.value, editedAsset.value.index);
  
      // 성공시 모달 닫기
      modalInstance.hide(); 
    } catch (error) {
      console.error('데이터 전송 중 오류 발생:', error);
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
  
  