<template>
  <head></head>
  <body>
    <div class="wrap">
      <div class="intro_bg">
        <div>
          <button id="start-btn">시작하기</button>
        </div>
      </div>

      <div class="mid">
        <ul class="mid-nav">
          <li :class="{ active: activeIndex === 0 }" @click="setActive(0, '#section1')">
            <div>자산</div>
          </li>
          <li :class="{ active: activeIndex === 1 }" @click="setActive(1, '#section2')">
            <div>소득/소비</div>
          </li>
          <li :class="{ active: activeIndex === 2 }" @click="setActive(2, '#section3')">
            <div>투자</div>
          </li>
          <li :class="{ active: activeIndex === 3 }" @click="setActive(3, '#section4')">
            <div>목표</div>
          </li>
          <li :class="{ active: activeIndex === 4 }" @click="setActive(4, '#section5')">
            <div>커뮤니티</div>
          </li>
        </ul>
      </div>

      <!-- 스크롤될 섹션들 -->
      <div id="section1" class="section">
        <div class="content-wrapper">
          <div class="text-content">
            <h2 class="title">자산</h2>
            <p class="description">나의 자산을 등록해요.</p>
          </div>
          <div class="image-content"></div>
        </div>
      </div>

      <div id="section2" class="section">소득/소비 섹션</div>
      <div id="section3" class="section">투자 섹션</div>
      <div id="section4" class="section">목표 섹션</div>
      <div id="section5" class="section">커뮤니티 섹션</div>
    </div>
  </body>
</template>

<script setup>
import { ref } from 'vue';

const activeIndex = ref(0); // 선택된 항목의 인덱스를 관리하는 상태

// 클릭 시 해당 항목을 활성화하고 스크롤 이동
function setActive(index, sectionId) {
  activeIndex.value = index;
  const section = document.querySelector(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' }); // 해당 섹션으로 부드럽게 스크롤
  }
}
</script>

<style scoped>
* {
  font-family: pretendard;
  list-style: none;
  text-decoration: none;
  margin: 0px;
  padding: 0px;
  text-align: center;
}

html {
  scroll-behavior: smooth; /* 부드러운 스크롤 */
}

.intro_bg {
  background-image: url('@/assets/images/home-bg(1).png');
  background-size: cover;
  width: 100%;
  height: 640px;
  position: relative;
}

#start-btn {
  width: 200px;
  height: 60px;
  background: #FF0062;
  border-radius: 50px;
  font-size: 20px;
  color: #fff;
  border: none;
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
}

.mid {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  width: 100%;
  height: 100px;
  position: sticky; /* 페이지 스크롤 시 상단에 고정 */
  top: 0; /* 상단에서 0px 떨어진 위치에 고정 */
  background-color: white; /* 고정 시 배경색을 흰색으로 설정 */
  z-index: 1000; /* 다른 요소 위에 표시되도록 설정 */
}

.mid-nav {
  display: flex;
  justify-content: center;
  width: 100%;
  color: #666C77;
}

.mid-nav > li {
  margin: 0 30px;
  font-size: 16px;
  color: #666C77;
  cursor: pointer; /* 클릭 가능한 커서 스타일 추가 */
}

.mid-nav > li.active div {
  color: #19181d;
  font-weight: bold; /* 선택된 항목의 폰트 굵게 */
}

.section {
  display: flex;
  justify-content: center; /* 가로로 가운데 정렬 */
  align-items: flex-start; /* 위에서부터 시작 (세로 정렬) */
  height: 100vh; /* 섹션 높이 100%로 설정 */
  background-color: #fff;
}

.content-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px; /* 중앙에 위치하도록 최대 너비 설정 */
  width: 100%;
  padding: 20px;
  margin-top: 120px; /* 위에서 120px 떨어진 위치에서 시작 */
}

.text-content {
  flex: 1;
  padding-right: 20px;
  display: flex;
  flex-direction: column; /* 요소들을 세로로 정렬 */
  align-items: flex-start; /* 요소들을 왼쪽으로 정렬 */
}

.title {
  color: #FF0062;
  font-size: 18px;
  font-weight: bold;
  text-align: left; /* 텍스트를 왼쪽 정렬 */
}

.description {
  color: #333;
  font-size: 30px;
  margin-top: 10px;
  text-align: left; /* 텍스트를 왼쪽 정렬 */
}

.image-content {
  flex: 1;
  text-align: right;
  background-image: url("../assets/images/laptop-rich.png");
  background-size: cover;
  height: 350px;
  width: 585px;
  /* border: 2px solid #d1d1d1; */
  box-shadow: 0px 4px 8px rgba(25, 24, 29, 0.5);
  border-radius: 20px;
}
</style>
