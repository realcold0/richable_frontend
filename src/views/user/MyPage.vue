<<<<<<< HEAD
<!-- RC-P-05 -->
<template>
  <div>
    <!-- Your template content here -->
    마이페이지
  </div>
</template>

<script setup>
// You can define your Composition API logic here
</script>

<style scoped>
/* Your style here */
=======
<template>
  <div class="mypage-container">
    <!-- 프로필 및 API 관리 섹션 -->
    <div class="top-section d-flex justify-content-between">
      <!-- 프로필 섹션 -->
      <section class="profile-section box text-center">
        <h6 class="bold-text">나의 프로필</h6>
        <div class="profile">
          <img :src="profileImageUrl" alt="프로필 이미지" />
          <h2>{{ userProfile.name }}</h2>
          <button class="btn btn-danger mt-3" @click="openModal">프로필 수정</button>
        </div>
      </section>

      <!-- API 관리 섹션 -->
      <section class="api-management box text-left">
        <h6 class="bold-text">API 관리</h6><br>
        <ul class="list-unstyled">
          <li class="d-flex justify-content-between align-items-center">
            <span>은행 api key</span>
            <span>{{ apiKeys.bankApiKey }}</span>
            <button class="btn btn-link" @click="openApiKeyInput('bank')">➡️</button>
          </li>
          <li class="d-flex justify-content-between align-items-center">
            <span>증권 api key</span>
            <span>{{ apiKeys.stockApiKey }}</span>
            <button class="btn btn-link" @click="openApiKeyInput('stock')">➡️</button>
          </li>
          <li class="d-flex justify-content-between align-items-center">
            <span>암호화폐 api key</span>
            <span>{{ apiKeys.cryptoApiKey }}</span>
            <button class="btn btn-link" @click="openApiKeyInput('crypto')">➡️</button>
          </li>
          <li class="d-flex justify-content-between align-items-center">
            <span>동의여부</span>
            <span>{{ apiKeys.consentStatus }}</span>
            <button class="btn btn-link" @click="openApiKeyInput('consent')">➡️</button>
          </li>
        </ul>

        <!-- API 키 입력 창 -->
        <div v-if="showApiKeyInput" class="mt-3">
          <input type="text" class="form-control mb-2" :placeholder="currentApiKeyLabel + ' API 키 입력'" v-model="newApiKey" />
          <button class="btn btn-primary" @click="saveApiKey">저장</button>
        </div>
      </section>
    </div>

    <!-- 뱃지 섹션 -->
    <section class="badge-section box mt-5">
      <div class="d-flex justify-content-between align-items-center">
        <h1 class="badge-title bold-text">나의 뱃지</h1>
        <a href="#" class="text-end">전체보기</a>
      </div>
      
      <!-- 대표 뱃지 섹션 -->
      <div class="badges d-flex justify-content-between mt-4">
        <div class="representative-badge text-start">
          <h6 class="bold-text">대표 뱃지</h6><br>
          <div v-if="selectedBadge" class="text-center">
            <p>{{ selectedBadge.name }}</p>
            <img :src="selectedBadge.imageUrl" alt="대표 뱃지 이미지" class="badge-image" />
            <!-- 대표 뱃지 등록 체크박스 -->
            <label>
              <input type="checkbox" v-model="selectedBadge.isSelected" @change="toggleBadgeSelection(selectedBadge)"><p>대표 뱃지 등록</p>
            </label>
          </div>
          <div v-else>
            <p>뱃지</p>
          </div>                    
        </div>

        <!-- 획득한 뱃지 목록 -->
        <div class="d-flex flex-column align-items-start">
          <h6 class="bold-text">내가 획득한 뱃지</h6><br>
          <div class="d-flex justify-content-start">
            <div
              v-for="(badge, index) in badges"
              :key="badge.id"
              class="badge-item text-center"
              @click="selectBadge(badge)"
            >
              <!-- 뱃지 이름을 이미지 상단에 표시 -->
              <p class="badge-name">{{ badge.name }}</p>
              <img :src="badge.imageUrl" alt="뱃지 이미지" class="badge-image" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Bootstrap Modal -->
  <div class="modal fade" id="profileModal" tabindex="-1" aria-labelledby="profileModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="profileModalLabel">회원 정보 수정</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <!-- 프로필 수정 폼 -->
          <div class="profile-edit text-center">
            <div class="profile-image">
              <img :src="profileImageUrl" alt="프로필 이미지" class="img-thumbnail" />
              <button class="btn btn-outline-secondary mt-2" style="margin-top: 50px;" @click="triggerFileUpload">프로필 이미지 변경</button>
              <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" style="display: none" />
            </div>
            <!-- 회원 정보 수정 필드 -->
            <div class="form-group mt-2">
              <label for="nickname">닉네임</label>
              <input type="text" class="form-control" id="nickname" v-model="userProfile.name" />
            </div>
            <div class="form-group mt-2">
              <label for="email">이메일</label>
              <input type="email" class="form-control" id="email" v-model="userProfile.email" />
            </div>
            <div class="form-group mt-2">
              <label for="birthYear">생년</label>
              <input type="number" class="form-control" id="birthYear" v-model="userProfile.birthYear" />
            </div>
            <div class="form-group mt-2">
              <label for="gender">성별</label>
              <select class="form-control" id="gender" v-model="userProfile.gender">
                <option value="남성">남성</option>
                <option value="여성">여성</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" style="position: absolute; left: 10px;" @click="deleteAccount">회원 탈퇴</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
          <button type="button" class="btn btn-danger" @click="saveProfile">수정</button>
        </div>
      </div>
    </div>
  </div>    
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

// 이미지 import
import badge1 from '@/assets/images/badge-apple-rich.png';
import badge2 from '@/assets/images/badge-car-rich.png';
import badge3 from '@/assets/images/badge-coin-box-rich.png';
import badge4 from '@/assets/images/badge-luxury-rich.png';

// 사용자 정보
const userProfile = ref({
  name: '강혜린',
  email: 'test01@gmail.com',
  birthYear: '2006',
  gender: '여성',
  profileImage: '/images/profile.jpg', // 기본 프로필 이미지
});

const profileImageUrl = ref(userProfile.value.profileImage);
const showApiKeyInput = ref(false); // API 등록 입력 필드 표시 여부
const currentApiKeyLabel = ref(''); // 현재 입력하는 API 키의 라벨
const newApiKey = ref(''); // 입력된 새로운 API 키

const toggleApiKeyInput = () => {
  showApiKeyInput.value = !showApiKeyInput.value;
};

// API 키 입력 창 열기
const openApiKeyInput = (type) => {
  if (type === 'bank') {
    currentApiKeyLabel.value = '은행';
  } else if (type === 'stock') {
    currentApiKeyLabel.value = '증권';
  } else if (type === 'crypto') {
    currentApiKeyLabel.value = '암호화폐';
  } else if (type === 'consent') {
    currentApiKeyLabel.value = '동의';
  }
  showApiKeyInput.value = true;
};

// API 키 저장 함수
const saveApiKey = () => {
  if (currentApiKeyLabel.value === '은행') {
    apiKeys.value.bankApiKey = newApiKey.value;
  } else if (currentApiKeyLabel.value === '증권') {
    apiKeys.value.stockApiKey = newApiKey.value;
  } else if (currentApiKeyLabel.value === '암호화폐') {
    apiKeys.value.cryptoApiKey = newApiKey.value;
  }
  showApiKeyInput.value = false;
};

// 파일 선택을 트리거하는 함수
const triggerFileUpload = () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.click();

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        profileImageUrl.value = e.target.result; // 프로필 이미지 업데이트
      };
      reader.readAsDataURL(file);
    }
  });
};

// 회원 탈퇴 기능
const deleteAccount = () => {
  // 실제 회원 탈퇴 처리는 API 요청으로 구현할 수 있음
  alert("회원 탈퇴가 완료되었습니다.");
  // 추가적으로 탈퇴 처리 로직을 구현
};

// Bootstrap 모달을 열기 위한 함수
const openModal = () => {
  const modal = new bootstrap.Modal(document.getElementById('profileModal'));
  modal.show();
};

// 프로필 변경 저장 처리
const saveProfile = () => {
  console.log('프로필 저장:', userProfile.value);
};

// API 데이터 가져오기 (프로필 및 API 키)
const apiKeys = ref({
  bankApiKey: '설정되지 않음',
  stockApiKey: '설정되지 않음',
  cryptoApiKey: '설정됨',
  consentStatus: '설정됨',
});

const badges = ref([
  { id: 1, name: '사과러버 리치', imageUrl: badge1, isSelected: false },
  { id: 2, name: '부릉부릉 리치', imageUrl: badge2, isSelected: false },
  { id: 3, name: '저금통 리치', imageUrl: badge3, isSelected: false },
  { id: 4, name: '럭셔리 리치', imageUrl: badge4, isSelected: false },
]);

const selectedBadgeId = ref(null);

// 선택된 뱃지 객체를 계산하여 가져오기
const selectedBadge = computed(() => {
  return badges.value.find(badge => badge.id === selectedBadgeId.value);
});

// 뱃지를 클릭하면 해당 뱃지를 대표 뱃지로 선택
const selectBadge = (badge) => {
  selectedBadgeId.value = badge.id;
};

// 체크박스에 따라 대표 뱃지 등록
const toggleBadgeSelection = (badge) => {
  if (!badge.isSelected) {
    selectedBadgeId.value = null;
  }
};

onMounted(() => {
  axios.get('/api/user/profile').then((response) => {
    userProfile.value = response.data;
    profileImageUrl.value = userProfile.value.profileImage; // 프로필 이미지 초기화
  });

  axios.get('/api/user/api-keys').then((response) => {
    apiKeys.value = response.data;
  });
});
</script>

<style scoped>
.mypage-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.top-section {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

.box {
  background-color: #f9f9f9;
  padding: 40px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.profile img {
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-bottom: 200px;
  border: 3px solid #ddd;
}


.api-management ul {
  list-style-type: none;
  padding: 0;
}

.api-management li {
  margin: 10px 0;
  font-size: 18px;
}

.badge-section {
  margin-top: 40px;
}

.badge-title {
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 20px;
}

.badges {
  display: flex;
  justify-content: space-around;
}

.bold-text {
  font-weight: bold;
}

.badge-item, .representative-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
}

.badge-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
}

.badge-item .badge-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.modal-body .profile-edit {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-body .profile-image img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
}
>>>>>>> 075fb0d (마이페이지 전체 틀 구현 및 부분 모달 나머진 수정필요)
</style>
