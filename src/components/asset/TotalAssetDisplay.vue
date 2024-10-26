<template>
  <div class="total-asset">
    <div class="asset-title">{{ userName }}님의 총 {{ assetType }} 자산 현황 😎</div>
    <div class="asset-amount">{{ amount.toLocaleString() }} 원</div>
  </div>
</template>

<script setup>
defineProps({
  userName: {
    type: String,
    default: '김리치'
  },
  assetType: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.total-asset {
  background-color: #f9f9f9;
  max-width: 1704px;
  height: 150px;
  border-radius: 20px;
  border: 1px solid #f8f8f8;
  text-align: center;
}

.asset-title {
  font-size: 20px;
  margin-top: 36px;
  margin-bottom: 10px;
}

.asset-amount {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 36.5px;
}
</style>
