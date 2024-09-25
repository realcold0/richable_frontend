<template>
    <div class="wrapper">
        <div class="consumeCompareWrapper">
            <div class="consumeCompareTitle">
                전일대비 소비량 누계 비교
            </div>

            <div class="graphWrapper">
                <div class="graph">
                    <canvas ref="lineChart"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import {
    Chart as ChartJS, LineElement, PointElement, LineController, CategoryScale, LinearScale
} from 'chart.js';

import { nextTick, onMounted, ref } from 'vue';

ChartJS.register(LineElement, PointElement, LineController, CategoryScale, LinearScale);

const lineChart = ref(null);
let chartInstance = null;

const renderLineChart = async() => {
    await nextTick(); 

    if(chartInstance){
        chartInstance.destroy()
    }

    chartInstance = new ChartJS(lineChart.value , {
        type : 'line',
        data : {
            labels: '123123',
            datasets: [{
                label: 'My First Dataset',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        }
        ,
        options : {
            responsive : true,
        }
    });
}

onMounted(() =>{ 
    renderLineChart();
})

</script>
<style scoped>
    .consumeCompareWrapper {
        width: 864px;
        padding: 30px 20px;
        /* background-color: red; */
    }
    .consumeCompareTitle {
        font-size: 32px;
    }

    .graphWrapper {
        padding: 30px 20px;
        margin-top: 14px;
        border-radius: 31px;
        border: 1px solid #D9D9D9;
    }


</style>