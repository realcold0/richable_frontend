<template>
    <div class="table-card card">
      <table class="table">
        <thead class="thead-light">
          <tr>
            <th style="width: 10%;">순위</th>
            <th style="width:15%">종류</th>
            <th style="width:30%">자산명</th>
            <th style="width:25%">가격</th>
            <th style="width:25%">수익률</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(asset, index) in filteredAssets" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ asset.category }}</td>
            <td>{{ asset.name }}</td>
            <td>{{ asset.price }}원</td>
            <td class="return-rate">{{ asset.rate }} %</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  
  const props = defineProps({
    filteredAssets: Array
  })
  </script>
  
  <style scoped>
  .table-card {
    margin-top: 40px;
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    font-size: 18px;
  }
  
  .table th,
  .table td {
    text-align: center;
    padding: 20px;
  }
  
  table {
    font-family: pretendard;
    font-size: 18px;
    width: 100%;
    text-align: center;
  }
  
  th {
    border-radius: 10px;
    font-weight: 600;
    background-color: #f9f9f9;
    color: #333;
  }
  
  td {
    font-size: 16px;
    color: #555;
  }
  
  .return-rate {
    color: #ff0062;
    text-align: right;
    font-size: 18px;
    font-weight: 500;
  }
  </style>
  