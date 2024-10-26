<template>
  <!-- 상단 질문 텍스트 -->
  <div class="total-asset-title">나의 자산 중 여유자금은 얼마일까요?</div>
  <div class="total-asset">
    <div class="total-asset-sub">
      나의 전체 자산 중 바로 투자를 할 수 있는 <br />
      여유자금은
      <p style="display: inline; font-size: 18px" class="highlight">
        {{ availableCash.toLocaleString() }}원
      </p>
      이에요.
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  availableCash: {
    type: Number,
    required: true
  }
})
</script>

<style scopre>
.total-asset-title {
  margin-top: 8xp;
  color: var(--4, #1d1616);
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 700;
  line-height: 27px;
}
.total-asset {
  border-radius: 20px;
  margin-top: 18px;
  background-color: #f9f9f9;
  height: 120px;
  padding: 25px;
}
.total-asset-sub {
  text-align: center;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;
  line-height: 32px;
}

.highlight {
  color: var(--Primary-30, #ff0062);
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 500;
}

/* 모바일용 */
@media (max-width: 767px) {
  .container {
    margin: 20px;
  }

  .total-asset {
    padding: 15px;
    height: auto;
  }

  .scroll-item {
    flex: 0 0 calc(80% - 10px); /* 모바일에서는 두 개씩 보여지도록 */
  }

  .custom-card {
    width: 100%;
  }

  .chart-container1 {
    height: 250px;
  }

  .highlight {
    font-size: 16px;
  }

  .total-asset-sub {
    font-size: 14px;
  }

  .cha-title-sub {
    font-size: 14px;
  }

  .cha-title-main {
    font-size: 16px;
  }
}
</style>
