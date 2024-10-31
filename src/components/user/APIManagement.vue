<template>
  <section class="api-management box text-left">
    <h4 class="bold-text">API 관리</h4><br>
    <ul class="list-unstyled">
      <li class="d-flex align-items-center">
        <span>은행 api key</span>
        <span class="ms-3"  v-if="userProfile && userProfile.api" >{{ userProfile.api.bank }}</span>
        <button class="btn btn-link ms-auto" @click="openApiKeyInput('bank')">➡️</button>
      </li>
      <li class="d-flex align-items-center">
        <span>증권 api key</span>
        <span class="ms-3">{{ userProfile.api.stock.app }}</span>
        <button class="btn btn-link ms-auto" @click="openApiKeyInput('stock')">➡️</button>
      </li>
      <li class="d-flex align-items-center">
        <span>암호화폐 api key</span>
        <span class="ms-3">{{ userProfile.api.coin.app }}</span>
        <button class="btn btn-link ms-auto" @click="openApiKeyInput('crypto')">➡️</button>
      </li>
    </ul>

    <!-- API 키 입력 -->
    <div v-if="showApiKeyInput" class="mt-3">
      <input type="text" class="form-control mb-2" :placeholder="currentApiKeyLabel + ' API 키 입력'"
        v-model="newApiKey" />
      <button class="btn btn-primary" @click="saveApiKey">저장</button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  userProfile: {
    type: Object,
    required: true
  }
});

const showApiKeyInput = ref(false);
const currentApiKeyLabel = ref('');
const newApiKey = ref('');
const apiKeys = ref({
  bankApiKey: '',
  stockApiKey: '',
  cryptoApiKey: ''
});

const openApiKeyInput = (type) => {
  currentApiKeyLabel.value = type === 'bank' ? '은행' : type === 'stock' ? '증권' : type === 'crypto' ? '암호화폐' : '동의';
  showApiKeyInput.value = true;
};

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
</script>

<style scoped>
.api-management {
  text-align: left;
}

.api-management ul {
  list-style-type: none;
  padding: 0;
}

.api-management li {
  justify-content: flex-start;
}
</style>