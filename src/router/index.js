import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import HomePage from '@/views/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    // Richable
    // 회원 관리 /user
    {
      path: '/user/signin',
      name: 'signIn',
      component: () => import('../views/user/SignInPage.vue')
    },
    {
      path: '/user/signin/naver',
      name: 'naver',
      component: () => import('../views/user/SignInNaver.vue')
    },
    {
      path: '/user/signup',
      name: 'signUp',
      component: () => import('../views/user/SignUpPage.vue')
    },
    {
      path: '/user/findpassword',
      name: 'findpassword',
      component: () => import('../views/user/FindPassWord.vue')
    },
    {
      path: '/user/findpassword2',
      name: 'findpassword2',
      component: () => import('../views/user/FindPassWord2.vue')
    },
    {
      path: '/user/findid',
      name: 'findid',
      component: () => import('../views/user/FindId.vue')
    },
    {
      path: '/user/findid2/:id',
      name: 'findid2',
      component: () => import('../views/user/FindId2.vue')
    },
    {
      path: '/user/terms/:id',
      name: 'terms',
      component: () => import('../views/user/UserTermsPage.vue')
    },
    {
      path: '/user/mypage',
      name: 'myPage',
      component: () => import('../views/user/MyPage.vue')
    },
    // 자산 관리 /asset
    {
      path: '/asset/analysis',
      name: 'assetAnalysis',
      component: () => import('../views/asset/AssetAnalysisPage.vue')
    },
    {
      path: '/asset/comparison',
      name: 'assetComparison',
      component: () => import('../views/asset/AssetComparisonPage.vue')
    },
    {
      path: '/asset/management',
      name: 'assetManagement',
      component: () => import('../views/asset/AssetManagementPage.vue')
    },
    // 소득 소비 관리 /budget
    {
      path: '/budget/list',
      name: 'budgetList',
      component: () => import('../views/budget/BudgetListPage.vue')
    },
    {
      path: '/budget/consume/compare',
      name: 'compareConsume',
      component: () => import('../views/budget/CompareConsumePage.vue')
    },
    {
      path: '/budget/consume/analysis',
      name: 'consumeAnalysis',
      component: () => import('../views/budget/ConsumeAnalysisPage.vue')
    },
    // 투자 관리 /invest
    {
      path: '/invest/advisor',
      name: 'investAdvisor',
      component: () => import('../views/invest/ProductAdvisorPage.vue')
    },
    {
      path: '/invest/return/top',
      name: 'topReturn',
      component: () => import('../views/invest/TopReturnAssetPage.vue')
    },
    // 목표 관리 /goal
    {
      path: '/goal/list',
      name: 'goalList',
      component: () => import('../views/goal/GoalAssetListPage.vue')
    },
    // 커뮤니티 관리 /knowhow
    {
      path: '/knowhow/list',
      name: 'knowhowList',
      component: () => import('../views/knowhow/KnowHowListPage.vue')
    },
    {
      path: '/knowhow/detail',
      name: 'knowhowDetail',
      component: () => import('../views/knowhow/KnowHowDetailPage.vue')
    },
    {
      path: '/knowhow/write',
      name: 'knowhowWrite',
      component: () => import('../views/knowhow/KnowHowWritePage.vue')
    },
    {
      path: '/knowhow/update',
      name: 'knowhowUpdate',
      component: () => import('../views/knowhow/KnowHowUpdatePage.vue')
    }
  ]
})

export default router
