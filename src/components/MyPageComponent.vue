<template>
    <div>
      <h1>My Page</h1>
      <div v-if="myPage">
        <h2>{{ myPage.username }}</h2>
        <p>Email: {{ myPage.email }}</p>
        <p>Bio: {{ myPage.bio }}</p>
        <img :src="myPage.profileImageUrl" alt="Profile Image" />
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        myPage: null,
      };
    },
    methods: {
      async fetchMyPage() {
        try {
          const response = await axios.get('http://localhost:8080/user/mypage'); // Spring API 호출
          this.myPage = response.data;
        } catch (error) {
          console.error('Failed to fetch my page:', error);
        }
      },
    },
    mounted() {
      this.fetchMyPage(); // 컴포넌트가 마운트될 때 사용자 정보 가져오기
    },
  };
  </script>
  
  <style scoped>
  /* 스타일 추가 가능 */
  </style>
  