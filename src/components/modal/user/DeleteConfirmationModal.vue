<template>
  <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteModalLabel">회원 탈퇴 확인</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>정말로 회원 탈퇴하시겠습니까?</p><br>
          <p>모든 정보가 삭제됩니다.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="cancelDeletion">아니오</button>
          <button type="button" class="btn btn-danger" @click="confirmDeletion">예</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['confirmDeletion', 'cancelDeletion']);

const confirmDeletion = () => {
  emit('confirmDeletion');
};

const cancelDeletion = () => {
  emit('cancelDeletion');
};
</script>