<template>
  <div class="container">
    <!-- 탭 바 -->
    <div class="tab-bar">
      <ul class="nav nav-tabs">
        <li class="nav-item nav-link" @click="selectedTab = 'expense'" :class="{ active: selectedTab === 'expense' }">
          소비
        </li>
        <li class="nav-item nav-link" @click="selectedTab = 'income'" :class="{ active: selectedTab === 'income' }">
          소득
        </li>
      </ul>
    </div>

    <!-- 소비 탭 -->
    <div v-if="selectedTab === 'expense'">
      <div class="filter-bar">
        <label for="expenseCategory">소비 카테고리</label>
        <select id="expenseCategory" v-model="selectedExpenseCategory" class="form-select short-select">
          <option value="">전체</option>
          <option value="식료품">식료품</option>
          <option value="유흥">유흥</option>
          <option value="쇼핑">쇼핑</option>
          <option value="공과금">공과금</option>
          <option value="생활용품">생활용품</option>
          <option value="의료비">의료비</option>
          <option value="교통비">교통비</option>
          <option value="통신비">통신비</option>
          <option value="문화">문화</option>
          <option value="교육비">교육비</option>
          <option value="외식 · 숙박">외식 · 숙박</option>
          <option value="기타">기타</option>
        </select>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>날짜</th>
            <th>분류</th>
            <th>내용</th>
            <th>메모</th>
            <th>가격</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(expense, index) in paginatedExpenses" 
              :key="index" 
              @click="openDetailModal2(expense)" 
              @mouseover="hoverEffect(index)"
              @mouseleave="removeHoverEffect(index)"
              :class="{ 'hover-row': hoveredIndex === index }">
            <td>{{ expense.date }}</td>
            <td>{{ expense.expCategory }}</td>
            <td>{{ expense.descript }}</td>
            <td>{{ expense.memo }}</td>
            <td>{{ expense.amount.toLocaleString() }} 원</td>
          </tr>
        </tbody>
      </table>

      <!-- 페이지네이션 -->
      <Pagination :total="filteredExpenses.length" :page="currentPage" :perPage="itemsPerPage" @update:page="updatePage" />
    </div>

    <!-- 소득 탭 -->
    <div v-if="selectedTab === 'income'">
      <div class="filter-bar">
        <label for="incomeCategory">소득 카테고리</label>
        <select v-model="selectedIncomeCategory" id="incomeCategory" class="form-select short-select">
          <option value="">전체</option>
          <option value="월급">월급</option>
          <option value="비정기소득">비정기소득</option>
          <option value="보너스">보너스</option>
        </select>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>날짜</th>
            <th>분류</th>
            <th>내용</th>
            <th>메모</th>
            <th>가격</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(income, index) in paginatedIncomes" 
              :key="index" 
              @click="openDetailModal(income)" 
              @mouseover="hoverEffect(index)"
              @mouseleave="removeHoverEffect(index)"
              :class="{ 'hover-row': hoveredIndex === index }">
            <td>{{ income.incomeDate }}</td>
            <td>{{ income.type }}</td>
            <td>{{ income.contents }}</td>
            <td>{{ income.memo }}</td>
            <td>{{ income.price.toLocaleString() }} 원</td>
          </tr>
        </tbody>
      </table>

      <!-- 페이지네이션 -->
      <Pagination :total="filteredIncomes.length" :page="currentPage" :perPage="itemsPerPage" @update:page="updatePage" />
    </div>

    <!-- 등록 버튼 -->
    <button class="btn btn-pink" @click="selectedTab === 'expense' ? openCreateModal2() : openCreateModal()">
      <font-awesome-icon icon="square-plus" />
    </button>

    <!-- 소비/소득 등록 모달 -->
    <IncomeCreateModal ref="createModal"/>
    <IncomeDetailModal ref="detailModal" :detail="selectedDetail" @close="closeDetailModal"/>
    <IncomeUpdateModal ref="updateModal"/>

    <ConsumeCreateModal ref="createModal2"/>
    <ConsumeDetailModal ref="detailModal2" :detail="selectedDetail2" @close="closeDetailModal2"/>
    <ConsumeUpdateModal ref="updateModal2"/>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import Pagination from '@/components/modal/pagenation/Pagenation.vue';
import IncomeCreateModal from '@/components/modal/budget/IncomeCreateModal.vue'; 
import IncomeDetailModal from '@/components/modal/budget/IncomeDetailModal.vue';
import IncomeUpdateModal from '@/components/modal/budget/IncomeUpdateModal.vue'; 

import ConsumeCreateModal from '@/components/modal/budget/ConsumeCreateModal.vue'; 
import ConsumeDetailModal from '@/components/modal/budget/ConsumeDetailModal.vue';
import ConsumeUpdateModal from '@/components/modal/budget/ConsumeUpdateModal.vue';

const selectedTab = ref('expense');
const expenses = ref([]);
const incomes = ref([]);
const selectedExpenseCategory = ref('');
const selectedIncomeCategory = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(9);
const totalExpenses = computed(() => expenses.value.length);
const totalIncomes = computed(() => incomes.value.length);
const errorMessage = ref('');

// Axios 인터셉터 설정 (JWT 토큰 포함)
axios.interceptors.request.use(
  config => {
    const authToken = localStorage.getItem('eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1bmRlcl9hdHRhY2siLCJ1aWQiOiJGelNzem1lVCtRbHhRWEVta1lnVXRBPT0iLCJuaWNrbmFtZSI6InJpY2hhYmxlbWFuYWdlckBnbWFpbC5jb20iLCJpYXQiOjE3MjgwOTYzNzcsImV4cCI6MTcyODA5OTk3N30.SLyYQIHvy8Wx2aKYsEwk8XxCyxqIEd-Vr1X6r8SYyUsUj0w-MRo3E-fcxKUCRbyFUEpbxE_zk33I_jaDbtaVog'); // JWT 토큰을 localStorage에서 가져옴
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`; // 요청 헤더에 토큰 포함
    }
    return config;
  },
  error => Promise.reject(error)
);

// 소비 데이터 불러오기
const fetchExpenses = async () => {
  try {
    const response = await axios.get('http://localhost:8080/outcome/all');
    if (Array.isArray(response.data.response.data)) {
      expenses.value = response.data.response.data;
    } else {
      console.error('응답이 배열이 아닙니다:', response.data);
    }
  } catch (error) {
    console.error('소비 리스트 불러오기 실패:', error);
    errorMessage.value = '소비 데이터를 불러오는 중 오류가 발생했습니다.';
  }
};

// 소득 데이터 불러오기
const fetchIncomes = async () => {
  try {
    const response = await axios.get('http://localhost:8080/income/all');
    if (Array.isArray(response.data.response.data)) {
      incomes.value = response.data.response.data;
    } else {
      console.error('소득 리스트가 없습니다:', response.data);
    }
  } catch (error) {
    console.error('소득 리스트 불러오기 실패:', error);
    errorMessage.value = '소득 데이터를 불러오는 중 오류가 발생했습니다.';
  }
};

// 탭 변경 시 데이터 로드
watch(selectedTab, (newTab) => {
  if (newTab === 'expense') {
    fetchExpenses();
  } else if (newTab === 'income') {
    fetchIncomes();
  }
});
onMounted(() => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    console.error('토큰이 없습니다. 로그인 페이지로 이동합니다.');
    window.location.href = '/login'; // 토큰이 없으면 로그인 페이지로 리다이렉트
  } else {
    fetchExpenses(); // 기본으로 소비 데이터를 먼저 로드
  }
});

// 모달 관련 상태
const createModal = ref(null);
const detailModal = ref(null);
const createModal2 = ref(null);
const detailModal2 = ref(null);
const selectedDetail = ref({}); 
const selectedDetail2 = ref({}); 

// 소득 모달 열기
const openCreateModal = () => createModal.value?.show();
const openDetailModal = (detail) => {
  selectedDetail.value = detail;
  detailModal.value?.show();
};

// 소비 모달 열기
const openCreateModal2 = () => { 
  createModal2.value?.show();
};
const openDetailModal2 = (detail) => {
  selectedDetail2.value = detail;
  detailModal2.value?.show();
};

// 모달 닫기
const closeDetailModal = () => detailModal.value?.hide();
const closeDetailModal2 = () => detailModal2.value?.hide();

// 소비 필터링 및 정렬
const filteredExpenses = computed(() => {
  let filtered = expenses.value;
  if (selectedExpenseCategory.value) {
    const selectedCategory = selectedExpenseCategory.value.trim().toLowerCase();
    filtered = filtered.filter(expense => expense.expCategory?.toLowerCase().includes(selectedCategory));
  }
  return filtered;
});

// 페이지네이션 적용된 최신순 소비 데이터
const paginatedExpenses = computed(() => {
  const sortedExpenses = [...filteredExpenses.value].sort((a, b) => new Date(b.date) - new Date(a.date));
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return sortedExpenses.slice(start, start + itemsPerPage.value);
});

// 소득 필터링 및 정렬
const filteredIncomes = computed(() => {
  let filtered = incomes.value;
  if (selectedIncomeCategory.value) {
    const selectedCategory = selectedIncomeCategory.value.trim().toLowerCase();
    filtered = filtered.filter(income => income.type?.toLowerCase().includes(selectedCategory));
  }
  return filtered;
});

// 페이지네이션 적용된 최신순 소득 데이터
const paginatedIncomes = computed(() => {
  const sortedIncomes = [...filteredIncomes.value].sort((a, b) => new Date(b.incomeDate) - new Date(a.incomeDate));
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return sortedIncomes.slice(start, start + itemsPerPage.value);
});

// 페이지 변경
const updatePage = (newPage) => {
  currentPage.value = newPage;
};
</script>

<style scoped>
.short-select {
  width: 150px;
} 
.filter-bar {
  margin-top: 10px;
  margin-left: 20px;
  overflow: auto;
  position: sticky;
}

.tab-bar {
  margin-top: 20px;
  margin-left: 20px;
}

.nav-tabs {
  border-bottom: 2px solid #414158;
}

.nav-item {
  color: #CCCCD6;
  width: 150px;
  height: 45px;
  text-align: center;
  font-size: 18px;
  line-height: 30px;
  border: 1px solid #CCCCD6;
  border-bottom: 1px solid #414158;
}

.nav-item.active {
  background-color: #414158;
  color: white;
  border-bottom: 2px solid #414158;
}

.table {
  margin-top: 20px;
  width: 100%;
  text-align: center;
  border-collapse: separate;
  border-spacing: 0 10px;
}

.table th, .table td {
  padding: 15px;
  border: none;
}

.table thead th {
  background-color: #f9f9f9;
  font-weight: bold;
  color: #414158;
  width: 180px;
}

.table tbody tr {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.table tbody tr:hover {
  background-color: #f0f0f0;
}

.table td {
  padding: 15px;
  color: #414158;
}

.btn-pink {
  background-color: #ff007f;
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  color: white;
  border: none;
}

.pagination {
  margin-top: 10px;
  text-align: center;
}

.container {
  margin-left: 15%;
}
</style>
