<template>
  <div class="tooltip-box">
    <button
      class="tool-btn"
      ref="tooltipButton"
      type="button"
      data-bs-toggle="tooltip"
      :data-bs-placement="position"
      :title="tooltipMessage"
    >
      <font-awesome-icon icon="circle-question" style="font-size: 25px" />
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { defineProps } from 'vue'
import { Tooltip as BootstrapTooltip } from 'bootstrap'

const props = defineProps({
  tooltipMessage: {
    type: String,
    required: true
  },
  position: {
    type: String,
    default: 'right'
  }
})

const tooltipButton = ref(null)
let tooltipInstance = null

onMounted(() => {
  if (tooltipButton.value) {
    tooltipInstance = new BootstrapTooltip(tooltipButton.value)
  }
})
</script>

<style scoped>
.tooltip-box {
  position: relative;
  left: 750px;
  top: -55px;
  z-index: 10;
}

.tool-btn {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  outline: none;
}
</style>
