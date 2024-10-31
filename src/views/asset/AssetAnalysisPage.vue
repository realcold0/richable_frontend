<template>
  <div>
    <div class="content-container">
    
      <AssetTotalComponent/>
      <AssetLevelComponent/>
      <AssetChartComponent/>
      <AssetLineChartComponent/>

    </div>
  </div>
</template>

<script setup>
import AssetChartComponent from '@/components/asset/AssetChartComponent.vue';
import AssetLineChartComponent from '@/components/asset/AssetLineChartComponent.vue';
import AssetLevelComponent from '@/components/asset/AssetLevelComponent.vue';
import AssetTotalComponent from '@/components/asset/AssetTotalComponent.vue';
</script>

<style scoped>
* {
  /* text-align: center; */
  color: #19181d;
  font-family: 'Pretendard', sans-serif;
}

.content-container {
  margin: 80px;
}

.total-asset,
.asset-analysis-container,
.asset-level-container {
  max-width: 1764px;
  border-radius: 20px;
  margin-top: 40px;
}

.total-asset {
  background-color: #f9f9f9;
  height: 150px;
  border: 1px solid #f8f8f8;
}

@media (max-width: 768px) {
  .graph-container-wrapper {
    grid-template-columns: 1fr;
  }

  .content-container {
    margin: 20px;
  }
}
</style>