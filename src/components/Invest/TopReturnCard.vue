<template>
    <div class="card-container">
      <div v-if="topAssets.length === 0">상위 자산이 없습니다.</div>
      <div v-else v-for="(asset, index) in topAssets" :key="index" class="custom-card">
        <div class="rank"> {{ index + 1 }} </div>
        <div style="margin-left:30px;">
          <div class="type">{{ asset.category }}</div>
          <div class="name">{{ asset.name }} </div>
          <div style="display: flex; flex-direction: row; justify-content: space-between;">
            <div style="font-size: 24px;" class="return-rate">{{ asset.rate }}%</div>
            <div class="price" style="margin-left: 45px;">{{ asset.price }}원</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  
  const props = defineProps({
    topAssets: Array
  })
  </script>
  
  <style scoped>
  .card-container {
    display: flex;
    gap: 30px;
    margin-top: 40px;
    justify-content: center;
  }
  
  .custom-card {
    text-align: left;
    height: 200px;
    width: 350px;
    display: flex;
    padding: 55px 20px;
    flex-direction: row;
    border-radius: 20px;
    background: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border: 1px solid #e0e0e0;
    font-size: 18px;
  }
  
  .rank {
    color: #414158;
    font-size: 48px;
    font-weight: 400;
  }
  
  .name {
    font-size: 20px;
    font-weight: 500;
  }
  
  .type {
    font-size: 16px;
    color: #8a8aa8;
  }
  
  .price,
  .return-rate {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .price {
    color: #8a8aa8;
    font-size: 18px;
  }
  
  .return-rate {
    font-size: 24px;
    color: #ff0062;
  }
  </style>
  