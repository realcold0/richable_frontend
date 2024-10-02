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
import { nextTick, onMounted, ref, watch } from 'vue';


ChartJS.register(LineElement, PointElement, LineController, CategoryScale, LinearScale);
const month = useMonthStore();

const lineChart = ref(null);
let chartInstance = null;

const curMonth = ref([]);  // 현재 달의 데이터
const prevMonth = ref([]);  // 이전 달의 데이터
const days =  Array.from({ length: 31 }, (_, i) => i + 1);  // 31일까지의 날짜 배열

const renderLineChart = async () => {
    await nextTick();

    if (chartInstance) {
        chartInstance.destroy();
    }

    // 현재 달 데이터 가져오기
    await axios.get(`http://localhost:8080/outcome/category/dailysum/${month.year}/${month.month}`)
        .then(response => {
            curMonth.value = response.data.response.data.prices;  // 현재 달의 소비 데이터
            console.log('현재 달:', response.data.response.data.cntYear, response.data.response.data.cntMonth);
        })
        .catch(error => {
            console.error(error);
        });

    // 이전 달 데이터 가져오기
    await axios.get(`http://localhost:8080/outcome/category/dailysum/${month.getPrevMonth.year}/${month.getPrevMonth.month}`)
        .then(response => {
            prevMonth.value = response.data.response.data.prices;  // 이전 달의 소비 데이터
            console.log('이전 달:', response.data.response.data.cntYear, response.data.response.data.cntMonth);
        })
        .catch(error => {
            console.error(error);
        });

    // 차트 생성
    chartInstance = new ChartJS(lineChart.value, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: month.month + '월',
                data: curMonth.value,
                fill: false,
                borderColor: '#DA0052',
                tension: 0.5
            },
            {
                label: month.getPrevMonth.month + '월',
                data: prevMonth.value,
                fill: false,
                borderColor: '#FA9EBE',
                tension: 0.5
            }]
        },
        options: {
            responsive: true,
            elements: {
                line: {
                    tension: 0.3
                },
                point: {
                    radius: 0
                }
            }
        }
    });
}

onMounted(() => {
    renderLineChart();
})

watch(() => month.month, () => {
    renderLineChart();
})
</script>

<style scoped>
.consumeCompareWrapper {
    width: 864px;
    padding: 30px 20px;
}

.consumeCompareTitle {
    font-size: 18px;
}

.graphWrapper {
    padding: 30px 20px;
    margin-top: 14px;
    border-radius: 31px;
    border: 1px solid #D9D9D9;
}
</style>
