<template>
  <nav aria-label="Page navigation">
    <ul class="pagination">
      <!-- 이전 버튼 -->
      <li class="page-item" :class="{ disabled: page === 1 }">
        <a class="page-link no-btn" href="#" @click.prevent="changePage(page - 1)">
          < 이전
        </a>
      </li>

      <!-- 페이지 번호 -->
      <li
        class="page-item"
        v-for="pageNumber in pageNumbers"
        :key="pageNumber"
        :class="{ active: page === pageNumber }"
      >
        <a class="page-link" href="#" @click.prevent="changePage(pageNumber)">
          {{ pageNumber }}
        </a>
      </li>

      <!-- 다음 버튼 -->
      <li class="page-item" :class="{ disabled: page === totalPages }">
        <a class="page-link no-btn" href="#" @click.prevent="changePage(page + 1)">
          다음 >
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed, watch } from 'vue';

const props = defineProps({
  total: Number,  // 전체 아이템 수
  page: Number,   // 현재 페이지 번호
  perPage: Number,  // 페이지당 아이템 수
});

const emit = defineEmits(['update:page']);

// 전체 페이지 수 계산
const totalPages = computed(() => Math.ceil(props.total / props.perPage));

// 페이지 번호 배열 계산
const pageNumbers = computed(() => {
  const maxPageRange = 7;  // 보여줄 페이지 번호의 최대 수
  const halfRange = Math.floor(maxPageRange / 2);
  let start = Math.max(1, props.page - halfRange);
  let end = Math.min(start + maxPageRange - 1, totalPages.value);

  if (end - start + 1 < maxPageRange) {
    start = Math.max(1, end - maxPageRange + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// 페이지 변경 함수
const changePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    emit('update:page', newPage);
  }
};

// 디버깅을 위한 로그 확인
watch([pageNumbers, totalPages], () => {
  console.log('총 페이지 수:', totalPages.value);
  console.log('페이지 번호들:', pageNumbers.value);
});
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.page-item {
  margin: 0 10px;
  overflow : auto;
}
.page-item.active .page-link {
  background-color: #FF0062;
  color: white;
  border-radius: 12px;
}
.page-link {
  color: #414158;
  cursor: pointer;
}
.page-link.no-btn {
  background: none;
  border: none;
  padding: 0;
}
.page-item.disabled .page-link.no-btn {
  color: #ccc;
  pointer-events: none;
}
</style>
