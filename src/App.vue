<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="main-template">
    <!-- 구분을 위해 임시로 blue로 설정 -->
    <SideBar />

    <div class="page-view">
      <!-- topbar의 text는 path 별로 달라지게 해야 함 -->
      <div class="topbar">자산 현황</div>
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.main-template {
  display: flex;
}
.topbar {
  height: 70px;
  line-height: 70px;
  border-bottom: 2px solid #e4ebf0;
  padding-left: 60px;
  font-weight: bold;
  font-size: 18px;
}

/* .sidebar {
  position: fixed;
  /* background-color: #F9F9F9; 
  background-color: blue;
  width : 56px;
  height: 100vh;
} */

.page-view {
  height: 1024px;
  margin-left : 56px;
  width: 100vw;
  background-color: blue;
}

/* @media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
