<template>
  <section class="goal-progress-section goal-card" style="position: relative">
    <!-- 빈 카드 표시 -->
    <div class="tooltip-box" style="position: absolute; right: 10px; top: 10px">
      <button class="tool-btn" ref="tooltipButton1" type="button" data-bs-toggle="tooltip" data-bs-placement="left"
        :title="tooltipMessage1">
        <font-awesome-icon icon="circle-question" style="font-size: 25px" />
      </button>
    </div>
    <div v-if="!assetGoal || assetGoalDeleted || assetGoal.totalAmount === 0" class="goal-card empty-goal-card"
      @click="openAssetGoalCreateModal">
      <div>목표 자산을 추가하세요</div>
      <div>+</div>
    </div>

    <!-- 목표 자산이 있을 때 자산 현황 표시 -->
    <div v-else class="progress-bar-container" @click="openAssetGoalDetailModal">
      <p class="goal-description">
        {{ auth.userProfile.data.nickname }}님의 목표 자산 현황<br />
        <strong>{{ assetGoal.title }} : {{ assetGoal.totalAmount.toLocaleString() }}원</strong>까지 <strong>{{
          assetGoal.remaindate }}</strong>일 남았습니다 💪
      </p>
      <p class="current-amount">
        현재 <strong>{{ assetGoal.currentAmount.toLocaleString() }}</strong>원 모았습니다 😁
      </p>
      <div class="progress-bar">
        <div class="progress" :style="{ width: (assetGoal.currentAmount / assetGoal.totalAmount) * 100 + '%' }"></div>
      </div>
    </div>


  </section>
  <!-- 모달 컴포넌트 -->
  <AssetGoalDetailModal ref="assetGoalDetailModal" @goalDeleted="onAssetGoalDeleted" />
  <AssetGoalCreateModal ref="assetGoalCreateModal" @registerGoal="addNewAssetGoal" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Tooltip as BootstrapTooltip } from 'bootstrap';
import AssetGoalDetailModal from '@/components/modal/goal/AssetGoalDetailModal.vue';
import AssetGoalCreateModal from '@/components/modal/goal/AssetGoalCreateModal.vue';
import Instance from '@/AxiosInstance.js'
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore(); // 유저 프로필 접근

// 목표 자산 관련 데이터
const assetGoal = ref(null);
const assetGoalDeleted = ref(false); // 자산 목표 삭제 여부

// 툴팁 버튼과 메시지
const tooltipButton1 = ref(null);
const tooltipMessage1 = ref('모은 돈은 목표 자산 설정 이후의 소득입니다.');

// 모달 제어를 위한 ref
const assetGoalDetailModal = ref(null)
const assetGoalCreateModal = ref(null)

// 자산 목표를 API에서 가져오는 함수
const fetchAssetGoal = async () => {
  try {
    const response = await Instance.get('/goal/')
    if (response.data && response.data.response && response.data.response.data) {
      const assetGoalData = response.data.response.data
      assetGoal.value = {
        index: assetGoalData.index,
        totalAmount: assetGoalData.amount,
        currentAmount: assetGoalData.gather,
        remaindate: assetGoalData.remaindate,
        category: '자산'
      }
    } else {
      console.error('자산 목표를 불러오지 못했습니다.')
    }
  } catch (error) {
    console.error('자산 목표 로드 중 오류가 발생했습니다.', error)
  }
}

// 툴팁 초기화
// 페이지 로드 시 목표 데이터를 가져옴
onMounted(async () => {
  auth.fetchUserProfile();
  try {
    await fetchAssetGoal()

    if (tooltipButton1.value) {
      new BootstrapTooltip(tooltipButton1.value, {
        trigger: 'hover',
        placement: 'left',
        template: `
        <div class="tooltip" role="tooltip">
          <div class="tooltip-arrow"></div>
          <div class="tooltip-inner" style="max-width: none; width: auto; padding: 10px; font-size: 14px; white-space: normal;"></div>
        </div>
      `
      })
    }
  } catch (error) {
    console.error('툴팁 초기화 실패:', error)
  }
})

// 자산 목표 세부 모달 열기 함수
const openAssetGoalDetailModal = () => {
  const goalData = {
    type: '자산',
    amount: assetGoal.value.totalAmount,
    index: assetGoal.value.index,
    category: assetGoal.value.category,
  };
  assetGoalDetailModal.value.show(goalData);
};

// 자산 목표 추가 모달 열기 함수
const openAssetGoalCreateModal = () => {
  if (assetGoalCreateModal.value) {
    assetGoalCreateModal.value.show();
  }
};

// 새로운 자산 목표 추가 함수
const addNewAssetGoal = (newAssetGoal) => {
  assetGoal.value = {
    totalAmount: newAssetGoal.amount,
    currentAmount: newAssetGoal.gather || 0, // gather 값이 있으면 그 값을 설정하고, 없으면 0으로 설정
    remaindate: newAssetGoal.remaindate || 0, // 나머지 날짜도 설정
  };
  assetGoalDeleted.value = false;
  console.log('자산 목표가 추가되었습니다!');
};

// 자산 목표 삭제 후 처리
const onAssetGoalDeleted = () => {
  assetGoalDeleted.value = true;
  console.log('자산 목표가 삭제되었습니다.');
};
</script>

<style scoped>
.goal-card {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  font-size: 18px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.goal-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.progress-bar-container {
  margin: 20px 0;
  padding: 15px;
  border-radius: 10px;
  background: #fafafb;
}

.goal-description {
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
}

.current-amount {
  font-size: 18px;
  font-weight: bold;
  color: #ff6584;
}

.progress-bar {
  width: 100%;
  background-color: #e0e0e0;
  height: 20px;
  border-radius: 10px;
  margin: 15px 0;
}

.progress {
  background: linear-gradient(90deg, #ffb9c9, #ff6584);
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.tooltip-box {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 1000;
}

.tooltip-box button {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  outline: none;
}

.tooltip-inner {
  max-width: none;
  width: auto;
  padding: 10px;
  white-space: normal;
  font-size: 14px;
  font-family: 'Pretendard';
}
</style>