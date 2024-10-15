<template>
  <div
    class="modal fade"
    id="assetDetailModal"
    tabindex="-1"
    aria-labelledby="assetDetailLabel"
    aria-hidden="true"
    ref="modal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="assetDetailLabel" style="font-weight: bold">자산 내역</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body" style="padding: 32px; padding-bottom: 12px">
          <!-- BankDTO 섹션 -->
          <div v-if="selectedAssetType === 'bank'" class="mb-3">
            <h6 style="font-weight: bold">은행 자산 내역</h6>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>은행명</th>
                  <th>계좌번호</th>
                  <th>상품 유형</th>
                  <th>잔액</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, index) in bankDataList" :key="index">
                  <td>{{ data.orgCode }}</td>
                  <td>{{ data.accountNum }}</td>
                  <td>{{ data.prodCategory }}</td>
                  <td>{{ formatCurrency(data.balanceAmt) }} 원</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- BondDTO 섹션 -->
          <div v-if="selectedAssetType === 'bond'" class="mb-3">
            <h6 style="font-weight: bold">채권 자산 내역</h6>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>채권명</th>
                  <th>보유 수량</th>
                  <th>가격</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, index) in bondDataList" :key="index">
                  <td>{{ data.name }}</td>
                  <td>{{ data.cnt }}</td>
                  <td>{{ formatCurrency(data.price) }} 원</td>
                  <td>
                    <button  @click="openEditModal(data,selectedAssetType)">
                      <font-awesome-icon icon="pen-to-square" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- CoinDTO 섹션 -->
          <div v-if="selectedAssetType === 'coin'" class="mb-3">
            <h6 style="font-weight: bold">코인 자산 내역</h6>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>통화</th>
                  <th>보유량</th>
                  <th>평균 구매가</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, index) in coinDataList" :key="index">
                  <td>{{ data.currency }}</td>
                  <td>{{ data.balance }}</td>
                  <td>{{ formatCurrency(data.avgBuyPrice) }} 원</td>
                  <td>
                    <button  @click="openEditModal(data,selectedAssetType)">
                      <font-awesome-icon icon="pen-to-square" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- StockDTO 섹션 -->
          <div v-if="selectedAssetType === 'stock'" class="mb-3">
            <h6 style="font-weight: bold">주식 자산 내역</h6>
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>종목명</th>
                  <th>보유 수량</th>
                  <th>평균 구매가</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, index) in stockDataList" :key="index">
                  <td>{{ data.prdtName }}</td>
                  <td>{{ data.hldgQty }}</td>
                  <td>{{ formatCurrency(data.avgBuyPrice) }} 원</td>
                  <td>
                    <button  @click="openEditModal(data,selectedAssetType)">
                      <font-awesome-icon icon="pen-to-square" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-secondary" 
            @click="handleClose"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  </div>

  <AssetUpdateModal 
  ref="updateModal"
  @update-asset="updateAsset"
  @delete-asset="deleteAsset"
/>


</template>

<script setup>
import { ref, onMounted, defineExpose, defineEmits } from 'vue'
import { Modal } from 'bootstrap'
import AssetUpdateModal from './AssetUpdateModal.vue'; // 수정 모달 컴포넌트

// AssetCheckModal.vue
const props = defineProps({
  selectedAssetType: String,
  bankDataList: { type: Array, default: () => [] },
  bondDataList: { type: Array, default: () => [] },
  coinDataList: { type: Array, default: () => [] },
  stockDataList: { type: Array, default: () => [] }
});

const emit = defineEmits(['open-edit-modal', 'update-asset', 'delete-asset', 'refreshData']);

const createModal = ref(null);
const updateModal = ref(null);
const selectedAsset = ref(null); // 선택된 자산 저장

const modal = ref(null)
let modalInstance = null

// 금액 포맷 함수
const formatCurrency = (amount) => {
  return amount.toLocaleString('ko-KR')
}

// 자산 수정 모달 열기
const openEditModal = (asset, assetType) => {
  // asset이 null이 아닌 경우에만 수정 모달을 연다
  if (asset) {
    selectedAsset.value = asset; // 선택된 자산 저장
    if (updateModal.value) {
      updateModal.value.show(selectedAsset.value, assetType); // 수정 모달 열기
    }
  } else {
    console.warn('수정할 자산 정보가 없습니다.');
  }
}

// 자산 수정 모달에서 자산을 수정한 후 이벤트 발생
const updateAsset = (assetType, updatedAsset) => {
  let targetList;

  if (assetType === 'bank') {
    targetList = props.bankDataList;
  } else if (assetType === 'bond') {
    targetList = props.bondDataList;
  } else if (assetType === 'coin') {
    targetList = props.coinDataList;
  } else if (assetType === 'stock') {
    targetList = props.stockDataList;
  }

  if (!targetList || !Array.isArray(targetList)) {
    console.error(`해당 자산 유형에 대한 데이터 리스트가 없습니다: ${assetType}`);
    return;
  }

  const index = targetList.findIndex(asset => asset.index === updatedAsset.index);
  if (index === -1) {
    console.error(`해당 인덱스를 가진 자산을 찾을 수 없습니다: ${updatedAsset.index}`);
    return;
  }

  targetList[index] = { ...updatedAsset };
  console.log(`자산 업데이트 성공: ${updatedAsset.index}`);

  // 변경 사항을 상위 컴포넌트에 전달 (emit)
  emit('update-asset', assetType, updatedAsset);
};

// 자산 삭제 시 상위 컴포넌트에 알림
const deleteAsset = (assetType, assetIndex) => {
  let targetList;

  // 자산 유형에 따라 해당 리스트 할당
  if (assetType === 'bank') {
    targetList = props.bankDataList;
  } else if (assetType === 'bond') {
    targetList = props.bondDataList;
  } else if (assetType === 'coin') {
    targetList = props.coinDataList;
  } else if (assetType === 'stock') {
    targetList = props.stockDataList;
  }

  // targetList가 존재하는지 확인하고, 없는 경우 빈 배열로 초기화
  if (!targetList || !Array.isArray(targetList.value)) {
    console.error(`${assetType} 자산 리스트가 정의되지 않았습니다.`);
    return;
  }

  // 삭제할 자산을 필터링하여 제외
  targetList.value = targetList.value.filter(asset => asset.index !== assetIndex);
  console.log(`${assetType} 자산이 삭제되었습니다.`);

  // 삭제 사항을 상위 컴포넌트에 전달 (emit)
  emit('delete-asset', assetType, assetIndex);
};


// 모달 열기 함수
const show = () => {
  if (!modalInstance && modal.value) {
    modalInstance = new Modal(modal.value, {
      backdrop: 'static',
      keyboard: true
    })
    modalInstance.show()
  } else if (modalInstance) {
    modalInstance.show()
  }
}

// 닫기 버튼 클릭 시 호출할 함수
const handleClose = () => {
  if (modalInstance) {
    modalInstance.hide(); // 모달 닫기
    emit('refreshData');  // 상위 컴포넌트에 데이터 갱신 요청
  }
}


// 컴포넌트가 마운트될 때 모달 초기화
onMounted(() => {
  setTimeout(() => {
    if (modal.value && !modalInstance) {
      modalInstance = new Modal(modal.value, {
        backdrop: 'static',
        keyboard: true
      })
    }
  }, 500)
  console.log('selectedAssetType:', props.selectedAssetType);
  console.log('bankDataList:', props.bankDataList);
  console.log('bondDataList:', props.bondDataList);
  console.log('coinDataList:', props.coinDataList);
  console.log('stockDataList:', props.stockDataList);
})

defineExpose({ show, openEditModal })
</script>


<style scoped>
.modal-body {
  padding: 20px;
}
</style>

