<template>
  <div class="wrapper">
    <ConsumeCategorySum/>
    <ConsumeCompareMonth/>
  </div>
</template>
<script setup>
import ConsumeCategorySum from '@/components/consume/ConsumeCategorySum.vue';
import ConsumeCompareMonth from '@/components/consume/ConsumeCompareMonth.vue';
</script>




<style scoped>
.wrapper {
  height: 100vh;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  display: flex;
}

ConsumeCategorySum {
  margin: 64px 0;
}
ConsumeCategorySum {
  margin: 64px 0;
}



</style>
