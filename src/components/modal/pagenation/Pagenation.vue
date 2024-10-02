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
  import { computed } from 'vue';
  
  // 부모 컴포넌트에서 받을 props 정의
  const props = defineProps({
    total: Number, // 전체 항목 수
    page: Number, // 현재 페이지 번호
    perPage: Number, // 페이지당 항목 수
  });
  
  // 부모 컴포넌트로 페이지 변경 이벤트 전송
  const emit = defineEmits(['update:page']);
  
  // 총 페이지 수 계산
  const totalPages = computed(() => Math.ceil(props.total / props.perPage));
  
  // 현재 페이지에 따른 페이지 번호 계산
  const pageNumbers = computed(() => {
    const maxPageRange = 7; // 최대 보여줄 페이지 번호 수
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
      emit('update:page', newPage); // 페이지 변경 이벤트 전송
    }
  };
  </script>
  
  <style scoped>
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  
  .page-item {
    margin: 0 10px; /* 페이지 간격을 조정 (양쪽에 10px씩 간격 추가) */
  }
  
  .page-item.active .page-link {
    background-color: #FF0062; /* 활성화된 페이지의 배경색 */
    border-color: #babad6;
    color: white; /* 활성화된 페이지의 텍스트 색상 */
    border-radius:12px;
  }
  
  .page-link {
    color: #414158;
    text-decoration: none;
    cursor: pointer;
  }
  
  .page-link.no-btn {
    background: none;
    border: none;
    padding: 0;
    color: #414158;
    cursor: pointer;
  }
  
  .page-item.disabled .page-link.no-btn {
    color: #ccc;
    pointer-events: none;
  }
  </style>
  