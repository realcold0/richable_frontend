<template>
    <div class="wrapper">
        <div class="monthWrapper">
            <div id="left" @click="decreaseMonth"><font-awesome-icon :icon="['fas', 'caret-left']" class="icon"/></div>
            <div class="date">
                <h5 id="year">{{ month.year }}</h5>
                <h1 id="month">{{ month.month }}월</h1>
            </div>
            
            <div id="right" @click="increaseMonth"><font-awesome-icon :icon="['fas', 'caret-right']" class="icon"/></div>
        </div>
        
    </div>
</template>
<script setup>
import { useMonthStore } from '@/stores/consume/curMonth';
const month = useMonthStore();

const decreaseMonth = () => {
    console.log(month.decreaseMonth());
}

const increaseMonth = () => {
    console.log(month.increaseMonth());
}

</script>
<style scoped>
    .monthWrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        height: 83px;
        width: 350px;
        background-color: rgba(250, 158, 190, 0.47);
        border-radius: 31px;
    }
    .monthWrapper .date {
        display: flex;
        flex-direction: column;
        align-items: center;
    }


    /* icon정렬 */
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
    }


</style>