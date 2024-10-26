<template>
  <div class="asset-list">
    <div class="list-title">
      금융 자산 목록
      <font-awesome-icon icon="square-plus" style="color: #c30044" @click="$emit('open-create')" />
    </div>

    <div class="list-box">
      <div class="asset-item" @click="$emit('open-check', 'bank')">
        <div class="asset-header">
          <div class="asset-name">예/적금</div>
        </div>
        <div class="asset-amount">
          <div class="amount">{{ bankAmount.toLocaleString() }}</div>
          <div class="currency">원</div>
        </div>
        <div class="asset-icon">
          <font-awesome-icon icon="piggy-bank" />
        </div>
      </div>

      <div class="asset-item" @click="$emit('open-check', 'stock')">
        <div class="asset-header">
          <div class="asset-name">주식</div>
        </div>
        <div class="asset-amount">
          <div class="amount">{{ stockAmount.toLocaleString() }}</div>
          <div class="currency">원</div>
        </div>
        <div class="asset-icon">
          <font-awesome-icon icon="chart-line" />
        </div>
      </div>

      <div class="asset-item" @click="$emit('open-check', 'bond')">
        <div class="asset-header">
          <div class="asset-name">채권</div>
        </div>
        <div class="asset-amount">
          <div class="amount">{{ bondAmount.toLocaleString() }}</div>
          <div class="currency">원</div>
        </div>
        <div class="asset-icon">
          <font-awesome-icon icon="money-check-dollar" />
        </div>
      </div>

      <div class="asset-item" @click="$emit('open-check', 'coin')">
        <div class="asset-header">
          <div class="asset-name">코인</div>
        </div>
        <div class="asset-amount">
          <div class="amount">{{ coinAmount.toLocaleString() }}</div>
          <div class="currency">원</div>
        </div>
        <div class="asset-icon">
          <font-awesome-icon icon="fa-brands fa-bitcoin" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  bankAmount: {
    type: Number,
    required: true
  },
  stockAmount: {
    type: Number,
    required: true
  },
  bondAmount: {
    type: Number,
    required: true
  },
  coinAmount: {
    type: Number,
    required: true
  }
})

defineEmits(['open-create', 'open-check'])
</script>

<style scoped>
.asset-list {
  margin-top: 117px;
}

.list-title {
  margin: 24px auto;
  font-size: 20px;
  font-weight: bold;
}

.list-box {
  display: flex;
  background-color: #fff2f6;
  border-radius: 10px;
  max-width: 1704px;
  height: 244px;
  margin-bottom: 44px;
  justify-content: space-between;
  align-items: center;
  padding: 0 27px;
}

.asset-item {
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 190px;
  background-color: white;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));
  border-radius: 20px;
  padding-top: 28px;
  cursor: pointer;
}

.asset-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.asset-name {
  font-weight: bold;
  font-size: 18px;
}

.asset-amount {
  display: flex;
  justify-content: center;
  align-items: center;
}

.amount {
  font-weight: bold;
  font-size: 24px;
  color: #ff0062;
}

.currency {
  font-weight: bold;
  font-size: 18px;
  color: #8a8aa8;
  margin-left: 4px;
}

.asset-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 60px;
  margin-top: 8px;
}
</style>
