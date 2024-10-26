<template>
  <div class="modal fade" id="profileModal" tabindex="-1" aria-labelledby="profileModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="profileModalLabel">회원 정보 수정</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="profile-edit text-center">
            <img :src="profileImageUrl" alt="프로필 이미지" class="img-thumbnail" style="width: 400px; height: 400px;" /><br>
            <button class="btn btn-outline-secondary mt-1 bold-text" @click="triggerFileUpload">프로필 이미지 변경</button>
            <input type="file" ref="fileInput" @change="onFileChange" accept="image/*" style="display: none" />

            <div class="form-group mt-2 d-flex align-items-center">
              <label for="nickname" class="me-2" style="white-space: nowrap;">닉네임</label>
              <input type="text" class="form-control" id="nickname" v-model="localProfile.nickname"
                style="width: auto; flex-grow: 1;" />
            </div>
            <div class="form-group mt-2 d-flex align-items-center">
              <label for="email">E-Mail</label>
              <input type="email" class="form-control" id="email" v-model="localProfile.email"
                style="width: auto; flex-grow: 1;" />
            </div>
            <div class="form-group mt-2 d-flex align-items-center">
              <label for="birthYear">생년월일</label>
              <input type="number" class="form-control" id="birthYear" v-model="localProfile.birthYear"
                style="width: auto; flex-grow: 1;" />
            </div>
            <div class="form-group mt-2 d-flex align-items-center">
              <label for="gender">성별</label>
              <input class="form-control" id="gender" :value="genderLabel" style="width: auto;flex-grow: 1;" readonly />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" @click="openDeleteModal"
            style="position: absolute; left: 10px; background-color: #FF0062;">회원 탈퇴</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
          <button type="button" class="btn btn-danger" @click="saveProfile"
            style="background-color: #FF0062; border-color: #FF0062;">수정</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  localProfile: Object,
  profileImageUrl: String
});

const emit = defineEmits(['saveProfile', 'openDeleteModal']);

// 성별 표시용 computed
const genderLabel = computed(() => props.localProfile.gender === 'M' ? '남자' : props.localProfile.gender === 'F' ? '여자' : '성별 정보 없음');

// 이미지 파일 업로드 트리거
const triggerFileUpload = () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.click();

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => emit('updateProfileImage', e.target.result);
      reader.readAsDataURL(file);
    }
  });
};

// 프로필 저장 기능
const saveProfile = () => {
  emit('saveProfile', props.localProfile);
};

// 탈퇴 모달 열기
const openDeleteModal = () => {
  emit('openDeleteModal');
};
</script>