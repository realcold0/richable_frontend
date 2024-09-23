<template>
  <aside
    @mouseenter="expandSidebar"
    @mouseleave="collapseSidebar"
    :class="{ active: isSideBarActive }"
  >
    <div :class="isSideBarActive ? 'expanded-logo' : 'collapsed-logo'">
      <router-link to="/">
        <img
          :src="
            isSideBarActive
              ? '/src/assets/images/navbar-full-rich.png'
              : '/src/assets/images/navbar-rich.png'
          "
          alt="로고"
        />
      </router-link>
    </div>

    <div class="menu">

        <div  @mouseenter="toggleAssetMenu" @mouseleave="toggleAssetMenu" class="wrapButton">
            <div :class="isSideBarActive ? 'expanded-button' : 'collapsed-button'">
                <font-awesome-icon :icon="['fas', 'hand-holding-dollar']" class="icon" />
                <span v-if="isSideBarActive" class="text sideToggle">자산</span>
            </div>
            <transition name="slide-fade">
                <div v-if="isAssetMenuOpen" class="subButton">
                    <router-link to="/asset/analysis" class="button">
                        <span class="text">자산 분석</span>
                    </router-link>
                    <router-link to="/asset/comparison" class="button">
                        <span class="text">또래 자산 비교</span>
                    </router-link>
                    <router-link to="/asset/management" class="button">
                        <span class="text">자산 관리</span>
                    </router-link>
                </div>
            </transition>
        </div>
      

      
      
        <div @mouseenter="toggleIncomeMenu" @mouseleave="toggleIncomeMenu" class="wrapButton">
            <div :class="isSideBarActive ? 'expanded-button' : 'collapsed-button'">
                <font-awesome-icon :icon="['fas', 'money-bill']" class="icon" />
                <span v-if="isSideBarActive" class="text sideToggle">소득/소비</span>
            </div>

            <div v-if="isIncomeMenuOpen" class="subButton">
                <router-link to="/budget/list" class="button">
                <span class="text">소비 분석</span>
                </router-link>
                <router-link to="/budget/consume/compare" class="button">
                <span class="text">평균 소비 비교</span>
                </router-link>
                <router-link to="/budget/consume/analysis" class="button">
                <span class="text">소득/소비 관리</span>
                </router-link>
            </div>
        </div>

        <div @mouseenter="toggleInvestMenu" @mouseleave="toggleInvestMenu" class="wrapButton">
            <div :class="isSideBarActive ? 'expanded-button' : 'collapsed-button'">
                <font-awesome-icon :icon="['fas', 'chart-line']" class="icon" />
                <span v-if="isSideBarActive" class="text sideToggle">투자</span>
            </div>

            <div v-if="isInvestMenuOpen" class="subButton">
                <router-link to="/invest/advisor" class="button">
                <span class="text">투자 상품 추천</span>
                </router-link>
                <router-link to="/invest/return/top" class="button">
                <span class="text">수익률 상위 자산</span>
                </router-link>
            </div>
        </div>

        <router-link to="/goal/list">
            <div @click="toggleGoalMenu" :class="isSideBarActive ? 'expanded-button' : 'collapsed-button'">
                <font-awesome-icon :icon="['fas', 'bullseye']" class="icon" />
                <span v-if="isSideBarActive" class="text sideToggle">목표</span>
            </div>
        </router-link>
      

      <!-- <div v-if="isGoalMenuOpen" class="subButton">
                <router-link to="/" class="button">
                    <span class="text">목표 자산 관리</span>
                </router-link>
            </div> -->

        <router-link to="/knowhow/list">
            <div @click="toggleCommunityMenu" :class="isSideBarActive ? 'expanded-button' : 'collapsed-button'">
                <font-awesome-icon :icon="['fas', 'users']" class="icon" />
                <span v-if="isSideBarActive" class="text sideToggle">리치 노하우</span>
            </div>
        </router-link>
    <!-- <div v-if="isCommunityMenuOpen" class="subButton">
                <router-link to="/" class="button">
                    <span class="text">리치 노하우</span>
                </router-link>
            </div> -->
    </div>

    <div class="menu-bottom">
      <router-link to="/user/signin" :class="isSideBarActive ? 'expanded-button' : 'collapsed-button'">
        <font-awesome-icon :icon="['fas', 'right-to-bracket']" class="icon" />
        <span v-if="isSideBarActive" class="text">로그인</span>
      </router-link>
    </div>
  </aside>
</template>

<script>
export default {
  data() {
    return {
      isAssetMenuOpen: false,
      isIncomeMenuOpen: false,
      isInvestMenuOpen: false,
      isGoalMenuOpen: false,
      isCommunityMenuOpen: false,
      isSideBarActive: false // 초기값: 사이드바 축소 상태
    }
  },
  methods: {
    toggleAssetMenu() {
      this.isAssetMenuOpen = !this.isAssetMenuOpen
      this.isIncomeMenuOpen = false
      this.isInvestMenuOpen = false
      this.isGoalMenuOpen = false
      this.isCommunityMenuOpen = false
    },
    toggleIncomeMenu() {
      this.isIncomeMenuOpen = !this.isIncomeMenuOpen
      this.isAssetMenuOpen = false
      this.isInvestMenuOpen = false
      this.isGoalMenuOpen = false
      this.isCommunityMenuOpen = false
    },
    toggleInvestMenu() {
      this.isInvestMenuOpen = !this.isInvestMenuOpen
      this.isAssetMenuOpen = false
      this.isIncomeMenuOpen = false
      this.isGoalMenuOpen = false
      this.isCommunityMenuOpen = false
    },
    toggleGoalMenu() {
      this.isGoalMenuOpen = !this.isGoalMenuOpen
      this.isAssetMenuOpen = false
      this.isIncomeMenuOpen = false
      this.isInvestMenuOpen = false
      this.isCommunityMenuOpen = false
    },
    toggleCommunityMenu() {
      this.isCommunityMenuOpen = !this.isCommunityMenuOpen
      this.isAssetMenuOpen = false
      this.isIncomeMenuOpen = false
      this.isInvestMenuOpen = false
      this.isGoalMenuOpen = false
    },
    expandSidebar() {
      this.isSideBarActive = true // 사이드바 확장
    },
    collapseSidebar() {
      this.isSideBarActive = false // 사이드바 축소
      this.isAssetMenuOpen = false
      this.isIncomeMenuOpen = false
      this.isInvestMenuOpen = false
      this.isGoalMenuOpen = false
      this.isCommunityMenuOpen = false
    }
  }
}
</script>

<style scoped>
aside {
  position: fixed; /* 페이지 위로 열리도록 설정 */
  top: 0;
  left: 0;
  z-index: 1000; /* 다른 요소 위로 나오도록 설정 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  width: 56px; /* 축소된 상태의 너비 */
  transition: width 0.2s ease; /* 너비 변경 시 애니메이션 */
  border-radius: 0% 16px 16px 0%;
  border: 1px solid gray;
}

/* 사이드바 활성 상태일 때 확장 */
aside.active {
  transform: translateX(0); /* 페이지 위로 열리도록 */
  width: 320px; /* 확장된 상태의 너비 */
}

.expanded-logo {
  margin: 25px 0px 25px 24px;
  width: 220px;
  height: 58px;
}

.collapsed-logo {
  margin: 25px auto;
  width: 50px;
  height: 56px;
}

.expanded-logo img {
  height: 100%;
  width: 100%;
}
 
.collapsed-logo img {
  height: 100%;
  width: 100%;
}

.menu {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  height: 100%;
  padding: 20px 8px;
}

a {
  text-decoration: none;
  color: black;
}
.menu .wrapButton {
    display: flex;
    flex-direction: column;
}

.menu .expanded-button {
  margin: 20px 0;
  padding: 0 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.menu .expanded-button .icon {
  margin-right: 8px;
  height: 24px;
  width: 24px;
}

.menu .collapsed-button {
    margin: 20px 0;
    cursor: pointer;
    display: flex;
    padding: 0 5px;
}

.menu .collapsed-button .icon {
  height: 24px;
  width: 24px;
  align-items: center;
}

.subButton {
  display: flex;
  flex-direction: column;
}

.subButton .button {
    margin: 20px 0;
    padding: 0 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.menu-bottom {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 20%;
  padding: 8px;
}

.menu-bottom .expanded-button {
  margin: 20px 0;
  padding: 0 20px;
}

.menu-bottom .collapsed-button {
  margin: 20px 0;
  padding: 0 5px;
}

.menu-bottom .icon {
  margin-right: 8px;
  height: 24px;
  width: 24px;
}

/* 애니메이션 정의 (슬라이드 + 페이드 효과) */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
