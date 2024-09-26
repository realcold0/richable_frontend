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
import { useMonthStore } from '@/stores/consume/curMonth';
import axios from 'axios';
import {
    Chart as ChartJS, LineElement, PointElement, LineController, CategoryScale, LinearScale
} from 'chart.js';
import { nextTick, onMounted, ref } from 'vue';


ChartJS.register(LineElement, PointElement, LineController, CategoryScale, LinearScale);
const month = useMonthStore();

const lineChart = ref(null);
let chartInstance = null;

const curMonth = ref([]);
const prevMonth = ref([]);

const renderLineChart = async() => {
    await nextTick(); 

    if(chartInstance){
        chartInstance.destroy()
    }

    await axios.get(`http://localhost:8080/consume/category/dailysum/${month.year}/${month.month}`)
    .then( response => {
        curMonth.value = response.data.prices;
        console.log(response.data.cntYear, response.data.cntMonth);
    }).catch(error => {
        console.log(error);
    });

    await axios.get(`http://localhost:8080/consume/category/dailysum/${month.getPrevMonth.year}/${month.getPrevMonth.month}`)
    .then( response => {
        prevMonth.value = response.data.prices;
        console.log(response.data.cntYear, response.data.cntMonth);
    }).catch(error => {
        console.log(error);
    })



    chartInstance = new ChartJS(lineChart.value , {
        type : 'line',
        data : {
            labels: '123123',
            datasets: [{
                label: month.month,
                data: curMonth.value,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.5
            },
            {
                label: month.getPrevMonth.month,
                data: prevMonth.value,
                fill: false,
                borderColor: 'rgb(75, 111, 192)',
                tension: 0.5
            }
            ]
        }
        ,
        options : {
            responsive : true,
            grouped :true,
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