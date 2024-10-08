import axios from 'axios';
// Axios 인스턴스 생성 (공통 헤더에 토큰 추가)
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,  // .env 파일에서 가져온 값 사용
  headers: {
    'Content-Type': 'application/json',
  }
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // 로컬 스토리지에서 토큰 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 토큰을 Authorization 헤더에 추가
      console.log("Authorization Token:", token); // 토큰 값이 출력되는지 확인
    } else {
      console.error('Authorization header is missing');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
