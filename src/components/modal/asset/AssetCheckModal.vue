<template>
    <div class="modal fade" id="assetDetailModal" tabindex="-1" aria-labelledby="assetDetailLabel" aria-hidden="true"
        ref="modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="assetDetailLabel" style="font-weight: bold;">자산 내역</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" style="padding:32px; padding-bottom: 12px;">
                    <!-- BankDTO 섹션 -->
                    <div v-if="selectedAssetType === 'bank'" class="mb-3">
                        <h6 style="font-weight: bold;">은행 자산 내역</h6>
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
                        <h6 style="font-weight: bold;">채권 자산 내역</h6>
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
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- CoinDTO 섹션 -->
                    <div v-if="selectedAssetType === 'coin'" class="mb-3">
                        <h6 style="font-weight: bold;">코인 자산 내역</h6>
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
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- StockDTO 섹션 -->
                    <div v-if="selectedAssetType === 'stock'" class="mb-3">
                        <h6 style="font-weight: bold;">주식 자산 내역</h6>
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
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">닫기</button>
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

// 목업 데이터 (실제 데이터로 대체 가능)
const bankDataList = [
    { orgCode: '국민은행', accountNum: 93800123456, prodCategory: '예금', balanceAmt: 1000000 },
    { orgCode: '신한은행', accountNum: 12345678910, prodCategory: '적금', balanceAmt: 1500000 },
    { orgCode: '하나은행', accountNum: 56789012345, prodCategory: '예금', balanceAmt: 2000000 }
];

const bondDataList = [
    { name: '국고채권 01500-5003(20-2)', cnt: 2, price: 7000 },
    { name: '국고채권 01200-4003(18-3)', cnt: 3, price: 8500 },
    { name: '국고채권 01300-5003(19-2)', cnt: 5, price: 9200 }
];

const coinDataList = [
    { currency: 'BTC', balance: 0.5, avgBuyPrice: 45000000 },
    { currency: 'ETH', balance: 2.0, avgBuyPrice: 1500000 },
    { currency: 'XRP', balance: 5000.0, avgBuyPrice: 1000 }
];

const stockDataList = [
    { prdtName: '삼성전자', hldgQty: 10, avgBuyPrice: 80000 },
    { prdtName: 'LG화학', hldgQty: 5, avgBuyPrice: 750000 },
    { prdtName: '카카오', hldgQty: 15, avgBuyPrice: 110000 }
];

// 선택된 자산 타입에 따라 다른 섹션 표시
const selectedAssetType = ref('bank');  // 초기값으로 'bank' 설정

// 금액 포맷 함수
const formatCurrency = (amount) => {
    return amount.toLocaleString('ko-KR');
};

// 모달 열기 함수 (자산 타입에 따라 데이터 변경)
const show = (assetType = 'bank') => {
  selectedAssetType.value = assetType;  // 자산 타입 업데이트
  
  if (!modalInstance && modal.value) {
    modalInstance = new Modal(modal.value, {
      backdrop: 'static', 
      keyboard: true, 
    });
    modalInstance.show(); 
  } else if (modalInstance) {
    modalInstance.show();
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
  }, 500); 
});

defineExpose({ show });
</script>

<style scoped>
/* 스타일을 원하는 대로 추가 가능 */
.modal-body {
  padding: 20px;
}
</style>
