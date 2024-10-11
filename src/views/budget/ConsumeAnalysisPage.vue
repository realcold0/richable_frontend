<template>
  <div class="pageWrapper">
    <SelectMonth />
    <ConsumeCategorySum />
    <ConsumeCompareMonth />
  </div>
</template>
<script setup>
import SelectMonth from '@/components/consume/SelectMonth.vue'
import ConsumeCategorySum from '@/components/consume/ConsumeCategorySum.vue'
import ConsumeCompareMonth from '@/components/consume/ConsumeCompareMonth.vue'
</script>

<style scoped>
.pageWrapper {
  margin: 80px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  display: flex;
}

</style>
