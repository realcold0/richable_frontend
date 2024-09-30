<template>
  <div>
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
        <select v-model="selectedExpenseCategory" id="expenseCategory" class="form-select short-select">
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
          <option value="외식 • 숙박">외식 • 숙박</option>
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
          <tr v-for="(expense, index) in paginatedExpenses" :key="index">
            <td>{{ expense.date }}</td>
            <td>{{ expense.category }}</td>
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
          <tr v-for="(income, index) in paginatedIncomes" :key="index">
            <td>{{ income.date }}</td>
            <td>{{ income.category }}</td>
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
    <button class="btn btn-pink" @click="openModal">
      <font-awesome-icon icon="square-plus" />
    </button>

    <!-- 소비/소득 등록 모달 -->
    <ExpenseModal v-if="selectedTab === 'expense'" ref="modalRef" />
    <ConsumeCreateModal v-if="selectedTab === 'income'" ref="consumeModalRef" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Pagination from '@/components/modal/pagenation/Pagenation.vue'; // 페이지네이션 컴포넌트 가져오기
import ExpenseModal from '@/components/modal/budget/IncomeCreateModal.vue'; // 소비 모달 컴포넌트
import ConsumeCreateModal from '@/components/modal/budget/ConsumeCreateModal.vue'; // 소득 모달 컴포넌트

// 탭 상태 관리
const selectedTab = ref('expense');

// 소비 및 소득 데이터
const expenses = ref([
  { date: '2022.02.11', category: '식비', content: '땅땅포차', memo: '돈아끼자..', amount: 20000 },
  // 더미 데이터 추가 가능
]);

const incomes = ref([
  { date: '2022.02.11', category: '월급', content: '멀티잇', memo: '드디어 월급이...', amount: 350000 },
  // 더미 데이터 추가 가능
]);

// 페이지네이션 관련 상태
const currentPage = ref(1);
const itemsPerPage = ref(10); // 한 페이지에 보여줄 항목 수
const totalExpenses = ref(expenses.value.length);
const totalIncomes = ref(incomes.value.length);

// 카테고리 필터 관리
const selectedExpenseCategory = ref('전체');
const selectedIncomeCategory = ref('전체');

// 모달 열기 함수
const modalRef = ref(null); // 소비 모달 참조
const consumeModalRef = ref(null); // 소득 모달 참조

const openModal = () => {
  if (selectedTab.value === 'expense' && modalRef.value) {
    modalRef.value.show(); // 소비 모달 열기
  } else if (selectedTab.value === 'income' && consumeModalRef.value) {
    consumeModalRef.value.show(); // 소득 모달 열기
  }
};

// 페이지네이션 계산
const paginatedExpenses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return expenses.value.slice(start, end);
});

const paginatedIncomes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return incomes.value.slice(start, end);
});
</script>

<style scoped>
.short-select {
  width: 150px; /* 원하는 너비로 설정 */
}
.filter-bar {
  margin-top: 10px;
  margin-left: 20px;
}

.short-select {
  width: 150px; /* 여기서 너비를 조정할 수 있습니다 */
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

.btn-pink {
  background-color: #ff007f;
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.filter-bar {
  margin-top: 10px;
  margin-left: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
