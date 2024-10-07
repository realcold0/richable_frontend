import axios from 'axios';

// Axios 인스턴스 생성 및 인터셉터 설정
const instance = axios.create({
  baseURL: 'http://localhost:8080', // Your API base URL
  timeout: 1000,
});

instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져옴
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Authorization 헤더에 토큰 추가
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
