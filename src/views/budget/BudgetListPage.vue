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
              @click="openDetailModal(expense)" 
              @mouseover="hoverEffect(index)"
              @mouseleave="removeHoverEffect(index)"
              :class="{ 'hover-row': hoveredIndex === index }">
            <td>{{ expense.date }}</td>
            <td>{{ expense.type }}</td>
            <td>{{ expense.content }}</td>
            <td>{{ expense.memo }}</td>
            <td>{{ expense.amount }} 원</td>
          </tr>
        </tbody>
      </table>

      <!-- 페이지네이션 -->
      <Pagination :total="totalExpenses" :page.sync="currentPage" :perPage="itemsPerPage" />
    </div>

    <!-- 소득 탭 -->
    <div v-if="selectedTab === 'income'">
      <div class="filter-bar">
        <label for="incomeCategory">소득 카테고리</label>
        <select v-model="selectedIncomeCategory" id="incomeCategory" class="form-select short-select">
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
              @click="openDetailModal2(income)" 
              @mouseover="hoverEffect(index)"
              @mouseleave="removeHoverEffect(index)"
              :class="{ 'hover-row': hoveredIndex === index }">
            <td>{{ income.date }}</td>
            <td>{{ income.type }}</td>
            <td>{{ income.content }}</td>
            <td>{{ income.memo }}</td>
            <td>{{ income.amount }} 원</td>
          </tr>
        </tbody>
      </table>

      <!-- 페이지네이션 -->
      <Pagination :total="totalIncomes" :page.sync="currentPage" :perPage="itemsPerPage" />
    </div>

    <!-- 등록 버튼 -->
    <button class="btn btn-pink" @click="selectedTab === 'expense' ? openCreateModal() : openCreateModal2()">
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
import { ref, computed, watch } from 'vue';
import axios from 'axios';  // Axios 불러오기
// import Pagination from '@/components/Pagination.vue';  // Pagination 컴포넌트 임포트

// 모달 컴포넌트 임포트
import IncomeCreateModal from '@/components/modal/budget/IncomeCreateModal.vue'; 
import ConsumeCreateModal from '@/components/modal/budget/ConsumeCreateModal.vue'; 
import IncomeDetailModal from '@/components/modal/budget/IncomeDetailModal.vue';
import ConsumeDetailModal from '@/components/modal/budget/ConsumeDetailModal.vue';
import IncomeUpdateModal from '@/components/modal/budget/IncomeUpdateModal.vue'; 
import ConsumeUpdateModal from '@/components/modal/budget/ConsumeUpdateModal.vue';

const selectedTab = ref('expense');

// 소비 및 소득 데이터
const expenses = ref([]);
const incomes = ref([]);

// 카테고리 선택 상태
const selectedExpenseCategory = ref('');
const selectedIncomeCategory = ref('');

// 페이지네이션 상태 관리
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalExpenses = computed(() => expenses.value.length);
const totalIncomes = computed(() => incomes.value.length);

// 소득 및 소비 데이터 가져오기
const fetchExpenses = async () => {
  try {
    const response = await axios.get('http://localhost:8080/outcome/all');  // 올바른 API 경로
    // response.data.response.data를 통해 배열에 접근합니다.
    if (Array.isArray(response.data.response.data)) {
      expenses.value = response.data.response.data;  // 데이터 저장
    } else {
      console.error('응답이 배열이 아닙니다:', response.data);
    }
  } catch (error) {
    console.error('소비 리스트 불러오기 실패:', error);
  }
};

const fetchIncomes = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/income/all`);  // 인덱스를 사용하여 요청
    if (Array.isArray(response.data.response.data)) {
      incomes.value = response.data.response.data;  // 데이터 저장
    } else {
      console.error('소득 리스트가 없습니다:', response.data);
    }
  } catch (error) {
    console.error('소득 리스트 불러오기 실패:', error);
  }
};

// 예를 들어 특정 인덱스를 사용하여 호출
const indexToFetch = 1; // 실제 인덱스 값을 설정
fetchIncomes(indexToFetch);


// 탭 전환 시 데이터 다시 불러오기
watch(selectedTab, (newTab) => {
  if (newTab === 'expense') {
    fetchExpenses();
  } else if (newTab === 'income') {
    fetchIncomes();
  }
});

// 모달 상태 관리
const createModal = ref(null);
const detailModal = ref(null);
const createModal2 = ref(null);
const detailModal2 = ref(null);
const selectedDetail = ref({}); 
const selectedDetail2 = ref({}); 

// 모달 열기/닫기 함수
const openCreateModal = () => createModal.value?.show();  // 소비 모달 열기
const openDetailModal = (detail) => {
  selectedDetail.value = detail;
  detailModal.value?.show();  // 소비 상세 모달 열기
};

const openCreateModal2 = () => createModal2.value?.show();  // 소득 모달 열기
const openDetailModal2 = (detail) => {
  selectedDetail2.value = detail;
  detailModal2.value?.show();  // 소득 상세 모달 열기
};

const closeDetailModal = () => detailModal.value?.hide();  // 소비 상세 모달 닫기
const closeDetailModal2 = () => detailModal2.value?.hide();  // 소득 상세 모달 닫기

// 페이지네이션 계산
const paginatedExpenses = computed(() => {
  if (Array.isArray(expenses.value)) {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return expenses.value.slice(start, start + itemsPerPage.value);
  } else {
    return [];
  }
});

const paginatedIncomes = computed(() => {
  if (Array.isArray(incomes.value)) {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return incomes.value.slice(start, start + itemsPerPage.value);
  } else {
    return [];
  }
});
</script>

<style scoped>
.short-select {
  width: 150px;
}
.filter-bar {
  margin-top: 10px;
  margin-left: 20px;
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
}

.table tr.hover-row {
  background-color: #f0f0f0;
  cursor: pointer;
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
