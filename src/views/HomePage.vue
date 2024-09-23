<template>
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

    <!-- 섹션 1: 자산 -->
    <div id="section1" class="section">
      <div class="content-wrapper">
        <div class="text-content">
          <h2 class="title">자산</h2>
          <p class="description">나의 자산을 한 눈에 <br />모아볼 수 있어요.</p>
          <p class="description-sub">예/적금, 주식, 채권, 코인, 현물자산 등<br/> 나의 모든 자산을 확인하세요.</p>
        </div>
        <div class="image-content"></div>
      </div>
    </div>

    <!-- 섹션 2: 소득/소비 -->
    <div id="section2" class="section">
      <div class="content-wrapper">
        <div class="text-content">
          <h2 class="title">소득/소비</h2>
          <p class="description">
            나의 소비를 <br />
            분석하고 절약해요.
          </p>
          <p class="description-sub">
            한 달 동안의 소비를 확인하고 <br> 줄여야 될 소비를 볼 수 있어요.
          </p>
        </div>
        <div class="image-content"></div>
      </div>
    </div>

    <!-- 섹션 3: 투자 -->
    <div id="section3" class="section">
      <div class="content-wrapper">
        <div class="text-content">
          <h2 class="title">투자</h2>

          <p class="description">나의 투자현황을 <br /> 확인해보세요.</p>
          <p class="description-sub">
            나의 여유자금을 확인하고 <br> 투자유형에 맞는 투자상품을 추천받아요.
          </p>
        </div>
        <div class="image-content"></div>
      </div>
    </div>

    <!-- 섹션 4: 목표 -->
    <div id="section4" class="section">
      <div class="content-wrapper">
        <div class="text-content">
          <h2 class="title">목표</h2>
          <p class="description">나의 목표를 설정해요.</p>
          <p class="description-sub">
            나의 자산/소비 목표를 설정하고 <br> 이를 관리해요.
          </p>
        </div>
        <div class="image-content"></div>
      </div>
    </div>

    <!-- 섹션 5: 커뮤니티! -->
    <div id="section5" class="section">
      <div class="content-wrapper">
        <div class="text-content">
          <h2 class="title">커뮤니티</h2>

          <p class="description">
            다른 사람들은 어떻게  <br /> 자산을 모을까요?
          </p>
          
          <p class="description-sub">
            1억 이상의 자산을 가진 리치들의 <br> 자산 관리 노하우를 들어봐요!
          </p>

        </div>
        <div class="image-content"></div>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { ref } from 'vue';

const activeIndex = ref(0);

function setActive(index, sectionId) {
  activeIndex.value = index;
  const section = document.querySelector(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}
</script>

<style scoped>
* {
  font-family: 'Pretendard', sans-serif;
  list-style: none;
  text-decoration: none;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

.intro_bg {
  background-image: url('../assets/images/home-bg(1).png');
  background-size: cover;
  width: 100%;
  height: 640px;
  position: relative;
}

#start-btn {
  width: 150px;
  height: 60px;
  background: #ff0062;
  border-radius: 50px;
  font-size: 18px;
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
  height: 80px;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1000;
}

.mid-nav {
  display: flex;
  justify-content: center;
  width: 100%;
  color: #666c77;
}

.mid-nav > li {
  margin: 0 25px;
  font-size: 16px;
  color: #666c77;
  cursor: pointer;
}

.mid-nav > li.active div {
  color: #19181d;
  font-weight: bold;
}

.section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding:  0;
  background-color: #fff;
}

.content-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  padding: 20px;
  margin-top: px; /* 상단에서 150px 떨어지게 설정 */
}


.text-content {
  flex: 1;
  padding-right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.title {
  color: #ff0062;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}

.description {
  color: #19181d;
  font-size: 32px;
  line-height: 1.5;
  font-weight: bold;
  margin-top: 10px;
}

.description-sub {
  font-size: 24px;
  color: #414158;
  margin-top: 30px;
  line-height: 1.5;
}

.image-content {
  flex: 1;
  text-align: right;
  background-image: url('../assets/images/laptop-rich.png');
  background-size: cover;
  height: 350px;
  width: 585px;
  box-shadow: 0px 4px 8px rgba(25, 24, 29, 0.1);
  border-radius: 20px;
}

</style>
