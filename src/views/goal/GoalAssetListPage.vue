<template>
  <div class="goal-asset-list-page">
    <!-- Top Section: Goal Asset Progress -->
    <section class="goal-progress-section goal-card">
      <div v-if="assetGoalDeleted" class="goal-card empty-goal-card" @click="openAssetGoalCreateModal">
        <!-- 빈 카드 -->
        <div>목표 자산을 추가하세요</div>
        <div>+</div>
      </div>

      <!-- 목표 자산이 남아 있을 때만 자산 현황을 표시 -->
      <div v-else-if="assetGoal && assetGoal.totalAmount" class="progress-bar-container" @click="openAssetGoalDetailModal">
        <p class="goal-description">
          김리치님의 목표 자산 현황<br />
          <strong>{{ assetGoal.totalAmount.toLocaleString() }}원</strong>까지 <strong>1234</strong>일 남았습니다 💪
        </p>
        <p>현재 <strong>{{ assetGoal.currentAmount.toLocaleString() }}</strong>원 모았습니다 😁</p>
        <div class="progress-bar">
          <div class="progress" :style="{ width: (assetGoal.currentAmount / assetGoal.totalAmount) * 100 + '%' }"></div>
        </div>
      </div>
    </section>

    <!-- Middle Section: Consumption Suggestion -->
    <section class="consumption-suggestion">
      <p>소비 목표를 세워 목표 자금을 형성할 수 있어요</p>
      <p>우선순위별로 소비 목표가 달성돼요 😁</p>
    </section>

    <!-- Bottom Section: Goal Cards with '+' icon for adding new goals -->
    <section class="goal-cards">
      <div
        v-for="(goal, index) in goals"
        :key="goal.id"
        class="goal-card"
        @click="openGoalDetailModal(goal)"
      >
        <p>{{ index + 1 }} {{ goal.title }}</p>
        <p>{{ goal.currentAmount }}원 / {{ goal.totalAmount }}원</p>
        <div class="progress-bar">
          <div class="progress" :style="{ width: goal.progress + '%' }"></div>
        </div>
        <p>{{ goal.progress }}% 달성</p>
      </div>

      <!-- Add Goal Button -->
      <div class="goal-card add-goal" @click="openCreateModal">
        <p>+</p>
      </div>
    </section>

    <!-- 모달 컴포넌트 연결 -->
    <ConsumeGoalCreateModal ref="goalCreateModal" @registerGoal="addNewGoal" />
    <ConsumeGoalDetailModal ref="goalDetailModal" @deleteGoal="deleteGoal" @achieveGoal="removeAchievedGoal" />
    <AssetGoalDetailModal ref="assetGoalDetailModal" @goalDeleted="onAssetGoalDeleted" />
    <AssetGoalCreateModal ref="assetGoalCreateModal" @registerGoal="addNewAssetGoal" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ConsumeGoalCreateModal from '../../components/modal/goal/ConsumeGoalCreateModal.vue'
import ConsumeGoalDetailModal from '../../components/modal/goal/ConsumeGoalDetailModal.vue'
import AssetGoalDetailModal from '../../components/modal/goal/AssetGoalDetailModal.vue'
import AssetGoalCreateModal from '../../components/modal/goal/AssetGoalCreateModal.vue'

// 목표 데이터
const goals = ref([
  { id: 1, title: '에어팟', totalAmount: 360000, currentAmount: 120000, progress: 33 },
  { id: 2, title: '아이패드', totalAmount: 500000, currentAmount: 250000, progress: 50 },
  { id: 3, title: '노트북', totalAmount: 1000000, currentAmount: 500000, progress: 50 },
  { id: 4, title: '맥북', totalAmount: 1000000, currentAmount: 1000000, progress: 100 }
])

// assetGoal 변수 정의 (새로운 자산 목표를 관리)
const assetGoal = ref({
  totalAmount: 100000000,
  currentAmount: 1234567
});  // 자산 목표 리스트

// 모달 제어를 위한 ref
const goalCreateModal = ref(null)
const goalDetailModal = ref(null)
const assetGoalDetailModal = ref(null)
const assetGoalCreateModal = ref(null)
const assetGoalDeleted = ref(false);  // 자산 목표가 삭제되었는지 여부

// 목표 추가 함수
const addNewGoal = (newGoal) => {
  const newId = goals.value.length + 1
  goals.value.push({
    id: newId,
    title: newGoal.title,
    totalAmount: newGoal.totalAmount,
    currentAmount: 0, // 신규 목표는 현재 금액 0으로 시작
    progress: 0
  })
  console.log('새 목표 추가:', newGoal)
}

// 새로운 자산 목표 추가 함수
const addNewAssetGoal = (newAssetGoal) => {
  // 새로운 자산 목표를 assetGoal에 반영
  assetGoal.value.totalAmount = newAssetGoal.amount;
  assetGoal.value.currentAmount = 0; // 새로 등록된 목표 자산이므로 현재 금액은 0으로 설정
  assetGoalDeleted.value = false;  // 삭제된 자산 목표를 다시 복원
  console.log('새 자산 목표 추가:', newAssetGoal);
};

// 목표 생성 모달 열기 함수
const openCreateModal = () => {
  if (goalCreateModal.value) {
    goalCreateModal.value.show()
  }
}

// 목표 세부 모달 열기 함수
const openGoalDetailModal = (goal) => {
  if (goalDetailModal.value) {
    goalDetailModal.value.show({
      id: goal.id,
      type: '소비',
      name: goal.title,
      amount: goal.totalAmount,
      progress: goal.progress
    })
  }
}

// 목표 자산 모달 열기 함수
const openAssetGoalDetailModal = () => {
  if (!assetGoalDeleted.value) {  // 목표 자산이 삭제되지 않았을 때만 열기
    const goalData = {
      type: '자산 형성',
      amount: 100000000,
    };
    if (assetGoalDetailModal.value) {
      assetGoalDetailModal.value.show(goalData);
    }
  }
};

// 새로운 자산 목표 추가 모달 열기 함수
const openAssetGoalCreateModal = () => {
  if (assetGoalCreateModal.value) {
    assetGoalCreateModal.value.show();
  }
}

const onAssetGoalDeleted = () => {
  assetGoalDeleted.value = true;  // 목표 삭제 후 빈 카드 표시
  console.log('Asset goal deleted, showing empty card.');
};

// 목표 달성 시 목표 삭제 함수
const removeAchievedGoal = (goalId) => {
  goals.value = goals.value.filter((goal) => goal.id !== goalId)
}

// 목표 삭제 함수
const deleteGoal = (goalId) => {
  goals.value = goals.value.filter((goal) => goal.id !== goalId)
}
</script>

<style scoped>
.goal-asset-list-page {
  padding: 20px;
}

.goal-card {
  flex: 1 1 calc(33.333% - 10px);
  background-color: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  font-size: 18px;
}

.progress-bar-container {
  margin: 10px 0;
}

.progress-bar {
  width: 100%;
  background-color: #f0f0f0;
  height: 15px;
  border-radius: 5px;
  margin: 10px 0;
}

.progress {
  background-color: #ff6584;
  height: 100%;
  border-radius: 5px;
}

.goal-description {
  font-size: 18px;
}

.consumption-suggestion {
  text-align: center;
  margin-bottom: 20px;
}

.goal-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.add-goal {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  border: 2px dashed #ccc;
  font-size: 24px;
  color: #ccc;
}
</style>
