<template>
    <div class="total-asset">
      <div class="asset-title">{{ nickname }}님의 자산 현황 😎</div>
      <div class="asset-amount">{{ assetAmount.toLocaleString() }}원</div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    nickname: String,
    assetAmount: Number,
  });
  </script>
  
  <style scoped>
  .total-asset {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 20px;
    margin-bottom: 40px;
    text-align: center;
  }
  
  .asset-title {
    font-size: 20px;
    font-weight: 500;
    margin-top: 10px;
    color: #19181d;
    font-family: 'Pretendard', sans-serif;
  }
  
  .asset-amount {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 10px;
    color: #19181d;
    font-family: 'Pretendard', sans-serif;
  }
  </style>
  