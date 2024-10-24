<template>
  <div class="goal-asset-list-page">
    <GoalAssetProgress />
    <ConsumptionGoalList/>
   </div>
</template>

<script setup>
import GoalAssetProgress from '@/components/goal/GoalAssetProgress.vue'
import ConsumptionGoalList from '@/components/goal/ConsumptionGoalList.vue'

</script>

<style scoped>
* {
  font-family: pretendard;
}

.goal-asset-list-page {
  padding: 20px;
  background-color: #fafafb;
  min-height: 100vh;
}

.loading-spinner {
  text-align: center;
  font-size: 20px;
  color: #ff6584;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  90% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>