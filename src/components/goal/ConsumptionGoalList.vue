<template>
  <div>
    <!-- Middle Section: Consumption Suggestion -->
    <section class="text-left" style="position: relative">
      <div class="main-title">소비 목표를 세워 목표 자금을 형성할 수 있어요</div>
      <div class="sub_title">
        우선순위별로 소비 목표가 달성돼요 😁
        <div class="tooltip-box" style="display: inline-block; position: absolute; right: 0; top: 0">
          <button class="tool-btn" ref="tooltipButton2" type="button" data-bs-toggle="tooltip" data-bs-placement="top"
            :title="tooltipMessage2">
            <font-awesome-icon icon="circle-question" style="font-size: 26px" />
          </button>
        </div>
      </div>
    </section>

    <!-- 목표 카드 리스트 -->
    <section class="goal-cards">
      <ConsumptionGoalCard v-for="(goal, index) in goals" :key="goal.id" :goal="goal" :index="index"
        @dragstart="onDragStart" @drop="onDrop" @openDetail="openGoalDetailModal" />

      <!-- Add Goal Button -->
      <div class="goal-card add-goal" @click="openCreateModal">
        <p>+</p>
      </div>
    </section>

    <!-- 달성된 목표 축하 메시지 -->
    <div v-if="goalAchieved" class="goal-achieved-message">
      🎉 목표를 달성했습니다! 축하합니다! 🎉
    </div>

    <!-- 모달 컴포넌트 -->
    <ConsumeGoalCreateModal ref="goalCreateModal" @registerGoal="addNewGoal" />
    <ConsumeGoalDetailModal ref="goalDetailModal" @deleteGoal="deleteGoal" @achieveGoal="achieveGoal" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ConsumptionGoalCard from '@/components/goal/ConsumptionGoalCard.vue'
import ConsumeGoalCreateModal from '@/components/modal/goal/ConsumeGoalCreateModal.vue'
import ConsumeGoalDetailModal from '@/components/modal/goal/ConsumeGoalDetailModal.vue'
import Instance from '@/AxiosInstance.js'
import { Tooltip as BootstrapTooltip } from 'bootstrap'

// 모달 제어를 위한 ref
const goalCreateModal = ref(null)
const goalDetailModal = ref(null)

const tooltipButton2 = ref(null)
const tooltipMessage2 = ref('소비 등록 이후 모은 돈이 계산됩니다.')

const goals = ref([])
const goalAchieved = ref(false)
let draggedGoal = null

const onDragStart = (goal, event) => {
  draggedGoal = goal
}

const onDrop = async (targetGoal) => {
  const draggedIndex = goals.value.indexOf(draggedGoal)
  const targetIndex = goals.value.indexOf(targetGoal)
  goals.value.splice(draggedIndex, 1)
  goals.value.splice(targetIndex, 0, draggedGoal)

  for (let i = 0; i < goals.value.length; i++) {
    goals.value[i].priority = i + 1
  }

  try {
    await Promise.all(
      goals.value.map((goal) => {
        return Instance.put('/goal/priority', { index: goal.id, priority: goal.priority }, { headers: { 'Content-Type': 'application/json' } })
      })
    )
  } catch (error) {
    console.error('우선순위 업데이트에 실패했습니다.', error)
  }

  draggedGoal = null
  await fetchGoals()
}

const openCreateModal = () => {
  if (goalCreateModal.value) {
    goalCreateModal.value.show()
  }
}

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

const addNewGoal = (newGoal) => {
  const newId = goals.value.length + 1
  goals.value.push({
    id: newId,
    title: newGoal.title,
    totalAmount: newGoal.totalAmount,
    gather: 0
  })
}

const achieveGoal = (goalId) => {
  const goalIndex = goals.value.findIndex((goal) => goal.id === goalId)
  if (goalIndex !== -1) {
    goals.value.splice(goalIndex, 1)
    goalAchieved.value = true
    setTimeout(() => {
      goalAchieved.value = false
    }, 3000)
  }
}

const deleteGoal = (goalId) => {
  if (confirm('정말로 이 목표를 삭제하시겠습니까?')) {
    goals.value = goals.value.filter((goal) => goal.id !== goalId)
  }
}

const fetchGoals = async () => {
  try {
    const response = await Instance.get('/goal/outcome')
    if (response.data.success) {
      const fetchedGoals = response.data.response.data
        .map((goal) => ({
          id: goal.index,
          title: goal.title,
          totalAmount: goal.amount,
          gather: goal.gather || 0,
          priority: goal.priority,
          progress: (goal.gather / (goal.amount || 1)) * 100
        }))
        .sort((a, b) => a.priority - b.priority)

      goals.value = fetchedGoals
    }
  } catch (error) {
    console.error('소비 목표를 불러오지 못했습니다.', error)
  }
}

onMounted(async () => {
  try {
    await fetchGoals()

    if (tooltipButton2.value) {
      new BootstrapTooltip(tooltipButton2.value, {
        trigger: 'hover',
        placement: 'top',
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.goal-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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

.goal-cards {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.add-goal {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border: 2px dashed #ccc;
  font-size: 28px;
  color: #aaa;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.add-goal:hover {
  background-color: #e0e0e0;
  color: #888;
}

.goal-index {
  font-weight: bold;
  font-size: 22px;
  color: #414158;
}

.goal-amount {
  font-size: 18px;
  color: #8a8aa8;
}

.goal-progress {
  font-size: 16px;
  color: #414158;
  margin-top: 10px;
}

.sub-title {
  color: #414158;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  /* 27px */
  letter-spacing: -0.36px;
}

.main-title {
  margin-top: 8px;
  color: #414158;
  font-family: Pretendard;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 27px;
}

.goal-achieved-message {
  text-align: center;
  font-size: 24px;
  color: #ff6584;
  margin-top: 20px;
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
