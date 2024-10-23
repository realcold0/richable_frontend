<template>
    <div class="compare-table">
      <table>
        <thead>
          <tr>
            <th>종목</th>
            <th>나의 자산</th>
            <th>평균 자산</th>
            <th>비교</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in assetList" :key="index">
            <td><strong>{{ getCategoryName(item.category) }}</strong></td>
            <td>{{ formatAmount(item.myAsset) }}만원</td>
            <td>{{ formatAmount(item.averageAsset) }}만원</td>
            <td>
              <span v-if="item.difference > 0" class="positive">
                {{ formatAmount(item.difference) }}만원
                <font-awesome-icon style="color:#FF0062" :icon="['fas', 'caret-up']" />
              </span>
              <span v-else-if="item.difference < 0" class="negative">
                {{ formatAmount(item.difference) }}만원
                <font-awesome-icon style="color:#2768FF" :icon="['fas', 'caret-down']" />
              </span>
              <span v-else>차이 없음</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
const categoryMapping = {
  bond: '채권',
  deposit: '예금',
  saving: '적금',
  subscription: '청약',
  withdrawal: '입출금',
  stock: '주식',
  cash: '현금',
  coin: '코인'
};

const getCategoryName = (category) => {
  return categoryMapping[category.toLowerCase()] || category;
};

  const props = defineProps({
    assetList: Array,
  });
  
  const formatAmount = (amount) => Math.floor(amount / 10000).toLocaleString();
  </script>
  
  <style scoped>
  .compare-table {
    margin-top: 150px;
  }
  
  table {
    font-family: 'Pretendard', sans-serif;
    font-size: 18px;
    width: 100%;
    text-align: center;
    border-collapse: collapse;
  }
  
  th, td {
    font-size: 18px;
    height: 35px;
    padding: 15px;
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
  }
  
  th {
    font-weight: 600;
    background-color: #f9f9f9;
    color: #333;
  }
  
  td {
    font-size: 16px;
    color: #555;
  }
  
  .positive {
    color: #FF0062;
  }
  
  .negative {
    color: #2768FF;
  }
  </style>
  