import { defineStore } from 'pinia';
import axiosInstance from '@/AxiosInstance'; // Axios 인스턴스를 불러옵니다

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userProfile: null,
    isLoggedIn: false, 
  }),
  actions: {
    async handleNaverLogin(token) {
      try {
        // 기존 토큰 제거
        this.clearAuth()
        // 새 토큰 설정
        localStorage.setItem('authToken', token)
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
        // 사용자 정보 가져오기
        await this.fetchUserProfile()
        return true
      } catch (error) {
        console.error('Naver login handling error:', error)
        this.clearAuth()
        throw error
      }
    },
    async fetchUserProfile() {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const { data } = await axiosInstance.get('/member/info', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.userProfile = data.response.data; // 데이터를 제대로 저장
          this.isLoggedIn = true;
        } catch (error) {
          console.error('프로필을 가져오는 데 실패했습니다:', error);
          this.isLoggedIn = false;
        }
      } else {
        this.isLoggedIn = false;
      }
    },
    logout() {
      localStorage.removeItem('authToken');
      this.userProfile = null;
      this.isLoggedIn = false;
    },
  },
});
