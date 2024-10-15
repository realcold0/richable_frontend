// Base64 디코딩 함수
function parseJwt(token) {
    const base64Url = token.split('.')[1]; // JWT 페이로드 부분만 추출
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
  
  // BadgeStore 구현
  import { defineStore } from "pinia";
  import { ref } from 'vue';
  import axiosInstance from "@/AxiosInstance";
  
  export const useBadgeStore = defineStore('badge', () => {
    const badges = ref([]);
  
    // localStorage에서 JWT 토큰 가져오기
    const token = localStorage.getItem('authToken');
    let nickname = null;
  
    if (token) {
      const decodedToken = parseJwt(token); // JWT 토큰을 디코딩
      nickname = decodedToken.nickname; // 토큰에서 nickname 추출
    }
  
    // API 호출 함수
    const fetchBadges = async () => {
      if (nickname) { // nickname이 있을 경우에만 API 호출
        try {
          const response = await axiosInstance.get(`http://localhost:8080/member/badge/having/${nickname}`);
          badges.value = response.data.response.data.map(badge => ({
            id: badge.badgeNo,
            name: badge.name,
            imageUrl: badge.img,
            description: badge.desc,
            having: badge.having,
            main: badge.main
          }));
        } catch (error) {
          console.error('Error fetching badges:', error);
        }
      } else {
        console.error('Nickname is not available.');
      }
    };
  
    return {
      badges,
      fetchBadges
    };
  });
  