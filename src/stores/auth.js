import { defineStore } from 'pinia';
import axiosInstance from '@/AxiosInstance'; // Axios 인스턴스를 불러옵니다

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userProfile: null,
    isLoggedIn: false,
  }),
  actions: {
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

      sessionStorage.clear();
    },
  },
});
