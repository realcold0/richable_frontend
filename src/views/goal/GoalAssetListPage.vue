<template>
  <div class="goal-asset-list-page">
    <!-- Top Section: Goal Asset Progress -->
    <section class="goal-progress-section goal-card">
      <!-- 빈 카드 표시 -->
      <div
      v-if="!assetGoal || assetGoalDeleted || assetGoal.totalAmount === 0"
        class="goal-card empty-goal-card"
        @click="openAssetGoalCreateModal"
      >
        <div>목표 자산을 추가하세요</div>
        <div>+</div>
      </div>

      <!-- 목표 자산이 있을 때 자산 현황 표시 -->
      <div
        v-else
        class="progress-bar-container"
        @click="openAssetGoalDetailModal"
      >
        <p class="goal-description">
          김리치님의 목표 자산 현황<br />
          <strong>{{ assetGoal.totalAmount.toLocaleString() }}원</strong>까지
          <strong>{{ assetGoal.remaindate }}</strong>일 남았습니다 💪
        </p>
        <p>
          현재 <strong>{{ assetGoal.currentAmount.toLocaleString() }}</strong>원 모았습니다 😁
        </p>
        <div class="progress-bar">
          <div
            class="progress"
            :style="{ width: (assetGoal.currentAmount / assetGoal.totalAmount) * 100 + '%' }"
          ></div>
        </div>
      </div>
    </section>

    <!-- Middle Section: Consumption Suggestion -->
    <section class="consumption-suggestion">
      <p>소비 목표를 세워 목표 자금을 형성할 수 있어요</p>
      <p>우선순위별로 소비 목표가 달성돼요 😁</p>
    </section>

    <!-- 목표 카드 리스트 -->
    <section class="goal-cards">
      <div
        v-for="(goal, index) in goals"
        :key="goal.id"
        class="goal-card"
        @click="openGoalDetailModal(goal)"
      >
        <p>{{ index + 1 }}. {{ goal.title }}</p>
        <p>{{ goal.totalAmount.toLocaleString() }}원 / {{ goal.gather.toLocaleString() }}원</p>
        <div class="progress-bar">
          <div class="progress" :style="{ width: (goal.gather / goal.totalAmount) * 100 + '%' }"></div>
        </div>
        <p>{{ ((goal.gather / goal.totalAmount) * 100).toFixed(2) }}% 달성</p>
      </div>

      <!-- Add Goal Button -->
      <div class="goal-card add-goal" @click="openCreateModal">
        <p>+</p>
      </div>
    </section>

    <!-- 모달 컴포넌트 -->
    <ConsumeGoalCreateModal ref="goalCreateModal" @registerGoal="addNewGoal" />
    <ConsumeGoalDetailModal
      ref="goalDetailModal"
      @deleteGoal="deleteGoal"
      @achieveGoal="achieveGoal"
    />
    <AssetGoalDetailModal ref="assetGoalDetailModal" @goalDeleted="onAssetGoalDeleted" />
    <AssetGoalCreateModal ref="assetGoalCreateModal" @registerGoal="addNewAssetGoal" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ConsumeGoalCreateModal from '../../components/modal/goal/ConsumeGoalCreateModal.vue'
import ConsumeGoalDetailModal from '../../components/modal/goal/ConsumeGoalDetailModal.vue'
import AssetGoalDetailModal from '../../components/modal/goal/AssetGoalDetailModal.vue'
import AssetGoalCreateModal from '../../components/modal/goal/AssetGoalCreateModal.vue'

// 목표 데이터
const goals = ref([])

// assetGoal 변수 정의 (자산 목표 데이터를 관리)
const assetGoal = ref(null)
const assetGoalDeleted = ref(false) // 자산 목표 삭제 여부

// 모달 제어를 위한 ref
const goalCreateModal = ref(null)
const goalDetailModal = ref(null)
const assetGoalDetailModal = ref(null)
const assetGoalCreateModal = ref(null)

// 목표 추가 함수
const addNewGoal = (newGoal) => {
  const newId = goals.value.length + 1
  goals.value.push({
    id: newId,
    title: newGoal.title,
    totalAmount: newGoal.totalAmount,
    gather: 0 // 새로운 목표는 현재 모금액 0으로 시작
  })
}

// 새로운 자산 목표 추가 함수
const addNewAssetGoal = (newAssetGoal) => {
  assetGoal.value = {
    totalAmount: newAssetGoal.amount,
    currentAmount: newAssetGoal.gather || 0, // gather 값이 있으면 그 값을 설정하고, 없으면 0으로 설정
    remaindate: newAssetGoal.remaindate || 0 // 나머지 날짜도 설정
  };
  assetGoalDeleted.value = false;
}


// 목표 생성 모달 열기 함수
const openCreateModal = () => {
  if (goalCreateModal.value) {
    goalCreateModal.value.show()
  }
}

// 목표 세부 정보 모달 열기 함수
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

// 자산 목표 세부 모달 열기 함수
const openAssetGoalDetailModal = () => {
  const goalData = {
    type: '자산 형성',
    amount: assetGoal.value.totalAmount,
    index: assetGoal.value.index, // index 전달
    category: assetGoal.value.category // category 전달
  };
  assetGoalDetailModal.value.show(goalData);
};


// 자산 목표 추가 모달 열기 함수
const openAssetGoalCreateModal = () => {
  if (assetGoalCreateModal.value) {
    assetGoalCreateModal.value.show()
  }
}

// 자산 목표 삭제 후 처리
const onAssetGoalDeleted = () => {
  assetGoalDeleted.value = true
}

// 목표 달성 처리 (달성 시 목표 목록에서 제거)
const achieveGoal = (goalId) => {
  const goalIndex = goals.value.findIndex(goal => goal.id === goalId)
  
  if (goalIndex !== -1) {
    goals.value.splice(goalIndex, 1) // 목표 달성 시 목록에서 삭제
    console.log(`Goal with ID ${goalId} achieved and removed.`);
  }
}

// 목표 삭제 처리
const deleteGoal = (goalId) => {
  goals.value = goals.value.filter(goal => goal.id !== goalId)
}

// 자산 목표를 API에서 가져오는 함수
const fetchAssetGoal = async () => {
  try {
    const response = await axios.get('http://localhost:8080/goal');
    console.log("Asset goal API response:", response.data); // 응답 데이터 확인
    if (response.data && response.data.response && response.data.response.data) {
      const assetGoalData = response.data.response.data;
      assetGoal.value = {
        index: assetGoalData.index, // index 추가
        totalAmount: assetGoalData.amount,
        currentAmount: assetGoalData.gather || 0,
        remaindate: assetGoalData.remaindate,
        category: '자산' // category 추가 (혹은 적절한 값으로 대체)
      };
      console.log("Asset goal set to:", assetGoal.value); // assetGoal에 데이터가 제대로 할당되었는지 확인
    } else {
      console.error("Failed to fetch asset goal:", response.data);
    }
  } catch (error) {
    console.error('Error fetching asset goal:', error);
  }
};


// API를 통한 소비목표 데이터 가져오기
const fetchGoals = async () => {
  try {
    const response = await axios.get('http://localhost:8080/goal/outcome')
    if (response.data.success) {
      const fetchedGoals = response.data.response.data
        .map(goal => ({
          id: goal.index,
          title: goal.title,
          totalAmount: goal.amount,
          gather: goal.gather || 0,
          priority: goal.priority,
          progress: (goal.gather / (goal.amount || 1)) * 100
        }))
        // priority 순으로 정렬
        .sort((a, b) => a.priority - b.priority)
      
      goals.value = fetchedGoals
    }
  } catch (error) {
    console.error('Failed to fetch goals:', error)
  }
}

// 페이지 로드 시 목표 데이터를 가져옴
onMounted(async () => {
  await fetchAssetGoal()
  await fetchGoals()
})
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
