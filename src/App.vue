<script setup>
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="main-template">
    <!-- 구분을 위해 임시로 blue로 설정 -->
    <SideBar />

    <div class="page-view">
      <!-- topbar의 text는 path 별로 달라지게 해야 함 -->
      <div class="topbar"><span style="margin-left: 12px">자산 현황</span></div>
      <RouterView />
    </div>

    <!-- 푸터 -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 Richable. All rights reserved.</p>
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
        <div class="social-icons">
          <a href="#"><img src="../src/assets/images/navbar-rich.png" alt="Facebook" /></a>
          <a href="#"><img src="../src/assets/images/navbar-rich.png" alt="Twitter" /></a>
          <a href="#"><img src="../src/assets/images/navbar-rich.png" alt="Instagram" /></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script></script>
<style scoped>
.main-template {
  min-height: 100vh; /* 화면 전체 높이를 차지 */
  position: relative;
  padding-bottom: 200px; /* 푸터 높이만큼 패딩 추가 */
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
  min-height: 100vh;
  border-spacing: 200px;
  margin-left: 56px;
}

/* 푸터 스타일 */
.footer {
  height: 200px; /* 푸터 높이 설정 */
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%; /* 화면 전체 너비 */
  background-color: #19181d;
  padding: 40px 0;
  text-align: center;
  color: white;
  transform: translateY(0);
}

.footer-content {
  max-width: 1200px;
  margin: auto;
}

.footer-links {
  margin: 20px 0;
}

.footer-links a {
  color: #fff;
  margin: 0 15px;
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
}

.social-icons a {
  margin: 0 10px;
}

.social-icons img {
  width: 24px;
  height: 24px;
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
