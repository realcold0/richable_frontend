<!-- RC-P-25 -->
<template>
  <div class="goal-asset-list-page">
    <!-- Top Section: Goal Asset Progress -->
    <section class="goal-progress-section">
      <div class="progress-bar-container">
        <p class="goal-description">
          김리치님의 목표 자산 현황<br />
          <strong>100,000,000원</strong>까지 <strong>1234</strong>일 남았습니다 💪
        </p>
        <p>현재 <strong>40,023,150</strong>원 모았습니다 😁</p>
        <div class="progress-bar">
          <div class="progress" :style="{ width: '40%' }"></div>
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
      <div v-for="(goal, index) in goals" :key="index" class="goal-card" @click="openGoalDetailModal(goal)">
        <p>{{ index + 1 }} {{ goal.title }}</p>
        <p>{{ goal.currentAmount }}원 / {{ goal.totalAmount }}원</p>
        <div class="progress-bar">
          <div class="progress" :style="{ width: goal.progress + '%' }"></div>
        </div>
        <p>{{ goal.progress }}% 달성</p>
      </div>

      <!-- Add Goal Button: 클릭하면 모달이 열리도록 연결 -->
      <div class="goal-card add-goal" @click="openModal">
        <p>+</p>
      </div>
    </section>

    <!-- 모달 컴포넌트 연결 -->
    <ConsumeGoalCreateModal ref="goalModal" />

    <!-- Detail Goal Modal -->
    <ConsumeGoalDetailModal ref="goalDetailModal" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ConsumeGoalCreateModal from '../../components/modal/goal/ConsumeGoalCreateModal.vue';
import ConsumeGoalDetailModal from '../../components/modal/goal/ConsumeGoalDetailModal.vue';

// 목표 데이터
const goals = ref([
  { title: '에어팟', totalAmount: 360000, currentAmount: 120000, progress: 33 },
  { title: '아이패드', totalAmount: 500000, currentAmount: 250000, progress: 50 },
  { title: '노트북', totalAmount: 1000000, currentAmount: 500000, progress: 50 },
  { title: '노트북', totalAmount: 1000000, currentAmount: 500000, progress: 50 },
  { title: '노트북', totalAmount: 1000000, currentAmount: 500000, progress: 50 },

]);

// 모달 제어를 위한 ref
const goalModal = ref(null);
const goalDetailModal = ref(null);

// 목표 생성 모달 열기 함수
const openModal = () => {
  if (goalModal.value) {
    goalModal.value.show(); // 목표 생성 모달 표시
  }
};

// 목표 세부 모달 열기 함수
const openGoalDetailModal = (goal) => {
  if (goalDetailModal.value) {
    goalDetailModal.value.show({
      type: '소비',
      name: goal.title,
      amount: goal.totalAmount,
    });
  }
};
</script>

<style scoped>
.goal-asset-list-page {
  padding: 20px;
}

.goal-progress-section {
  text-align: center;
  margin-bottom: 20px;
}

.goal-description {
  font-size: 18px;
}

.progress-bar-container {
  margin: 10px 0;
}

.progress-bar {
  width: 100%;
  background-color: #f0f0f0;
  height: 10px;
  border-radius: 5px;
  margin: 10px 0;
}

.progress {
  background-color: #ff6584;
  height: 100%;
  border-radius: 5px;
}

.consumption-suggestion {
  text-align: center;
  margin-bottom: 20px;
}

.goal-cards {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.goal-card {
  flex: 1 1 calc(33.333% - 10px);
  background-color: #ffffff;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
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
