<template>
    <div class="wrapper">
        <div class="monthWrapper">
            <div id="left" @click="decreaseMonth">
                <font-awesome-icon :icon="['fas', 'caret-left']" class="icon"/>
            </div>
            <div class="date">
                <div id="year">{{ month.year }}</div>
                <div id="month">{{ month.month }}월</div>
            </div>
            <div id="right" @click="increaseMonth">
                <font-awesome-icon :icon="['fas', 'caret-right']" class="icon"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useMonthStore } from '@/stores/consume/curMonth';
const month = useMonthStore();

// 현재 날짜 정보
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1; // JavaScript의 월은 0부터 시작하므로 +1

const decreaseMonth = () => {
    month.decreaseMonth();
}

const increaseMonth = () => {
    // 현재 날짜를 넘어가지 않도록 조건 추가
    if (month.year < currentYear || (month.year === currentYear && month.month < currentMonth)) {
        month.increaseMonth();
    }
}
</script>

<style scoped>
* {
    font-size: 18px;
}
.monthWrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 83px;
    width: 350px;
    border-radius: 31px;
}
.monthWrapper .date {
    display: flex;
    flex-direction: column;
    align-items: center;
}

#left, #right { 
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 100%;
}

#left {
    border-radius: 31px 0 0 31px;
}

#right {
    border-radius: 0 31px 31px 0;
}

#left:hover, #right:hover {
    background-color: rgba(250, 158, 190);
}

#left .icon, #right .icon {
    width: 10px;
    height: 18px;
}

#month {
    flex-grow: 1;
    text-align: center;
    margin: 0;
    color: var(--black-default, #19181D);
    font-family: Pretendard;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
}
</style>
