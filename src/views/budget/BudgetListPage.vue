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
        <select  id="expenseCategory" class="form-select short-select">
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
          <tr v-for="(expense, index) in paginatedExpenses" 
              :key="index" 
              @click="openDetailModal(expense)" 
              @mouseover="hoverEffect(index)"
              @mouseleave="removeHoverEffect(index)"
              :class="{ 'hover-row': hoveredIndex === index }">
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
          <tr v-for="(income, index) in paginatedIncomes" 
              :key="index" 
              @click="openDetailModal2(income)" 
              @mouseover="hoverEffect(index)"
              @mouseleave="removeHoverEffect(index)"
              :class="{ 'hover-row': hoveredIndex === index }">
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
import { ref, computed } from 'vue';
import Pagination from '@/components/modal/pagenation/Pagenation.vue'; 
import IncomeCreateModal from '@/components/modal/budget/IncomeCreateModal.vue'; 
import ConsumeCreateModal from '@/components/modal/budget/ConsumeCreateModal.vue'; 
import IncomeDetailModal from '@/components/modal/budget/IncomeDetailModal.vue';
import ConsumeDetailModal from '@/components/modal/budget/ConsumeDetailModal.vue';
import IncomeUpdateModal from '@/components/modal/budget/IncomeUpdateModal.vue'; 
import ConsumeUpdateModal from '@/components/modal/budget/ConsumeUpdateModal.vue';

const selectedTab = ref('expense');

// 소비 및 소득 데이터
const expenses = ref([
  { date: '2022.02.11', category: '식비', content: '땅땅포차', memo: '돈아끼자..', amount: 20000 },
]);

const incomes = ref([
  { date: '2022.02.11', category: '월급', content: '멀티잇', memo: '드디어 월급이...', amount: 350000 },
]);

// 하버 상태 관리
const hoveredIndex = ref(null);
const hoverEffect = (index) => {
  hoveredIndex.value = index;
};
const removeHoverEffect = () => {
  hoveredIndex.value = null;
};

// 페이지네이션 상태 관리
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalExpenses = computed(() => expenses.value.length);
const totalIncomes = computed(() => incomes.value.length);

// 모달 상태 관리
const createModal = ref(null);
const detailModal = ref(null);
const createModal2 = ref(null);
const detailModal2 = ref(null);
const selectedDetail = ref({}); 
const selectedDetail2 = ref({}); 

// 모달 열기/닫기 함수
const openCreateModal = () => createModal.value?.show(); // 소비 모달 열기
const openDetailModal = (detail) => {
  //alert("**");
  selectedDetail.value = detail;
  detailModal.value?.show(); // 소비 상세 모달 열기
};

const openCreateModal2 = () => createModal2.value?.show(); // 소득 모달 열기
const openDetailModal2 = (detail) => {
  selectedDetail2.value = detail;
  detailModal2.value?.show(); // 소득 상세 모달 열기
};

const closeDetailModal = () => detailModal.value?.hide(); // 소비 상세 모달 닫기
const closeDetailModal2 = () => detailModal2.value?.hide(); // 소득 상세 모달 닫기

// 페이지네이션 계산
const paginatedExpenses = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return expenses.value.slice(start, start + itemsPerPage.value);
});

const paginatedIncomes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return incomes.value.slice(start, start + itemsPerPage.value);
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
  margin-top: 20px;
  text-align: center;
}
</style>
