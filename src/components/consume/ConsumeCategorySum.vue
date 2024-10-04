<template>
    <div class="wrapper">
        <div class="anlyzeWrapper">
            <div class="analyzeText">
                <span id="month">{{ month.month }}월</span>에는 <span id="mostCategory">{{ categorys[0]?.category || '데이터 없음' }}</span>에 가장 많은 소비를 하였습니다.
            </div>
            <div class="analyze">
                <div class="chart">
                    <canvas ref="doughnutChart"></canvas>
                </div>

                <div class="consumeSumAndList">
                    <div class="totalConsumeAmount">
                        <h3>총소비</h3>
                        <h3>{{ totalSum !== null ? totalSum.toLocaleString() : '0' }} 원</h3>
                    </div>
                    
                    <table class="consumeList">
                        <tbody>
                            <tr v-for="(category, index) in categorys" :key="index">
                                <td><font-awesome-icon :icon="['fas', 'circle']" class="icon" :style="{ color: iconColors[index] || '#000' }" /></td>
                                <td>{{ category.category || '없음' }}</td>
                                <td>{{ category.sum !== null ? category.sum.toLocaleString() : '0' }} 원</td>
                                <td>{{ totalSum > 0 ? Math.round((category.sum / totalSum) * 100) : 0 }}%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useMonthStore } from '@/stores/consume/curMonth';
import axios from 'axios';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
    LinearScale,
    DoughnutController,
} from 'chart.js';
import { nextTick, onMounted, ref, watch } from 'vue';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, DoughnutController);

const month = useMonthStore();

const doughnutChart = ref(null);
let chartInstance = null;

const totalSum = ref(0);
const categorys = ref([]);
let labels = ref([]);
let data = ref([]);
const iconColors = ['#008A1E', '#2768FF', '#FFB724', '#36A2EB', '#FF6384', '#4BC0C0', '#FF9F40', '#9966FF', '#FDD1E0', '#9CA5D6'];

const renderDoughnutChart = async () => {
    await nextTick();

    // 차트 인스턴스가 존재하면 안전하게 제거
    if (chartInstance) {
        chartInstance.destroy();
    }

    // API 요청 URL 출력
    console.log(`http://localhost:8080/outcome/category/sum/${month.year}/${month.month}`);

    try {
        const response = await axios.get(`http://localhost:8080/outcome/category/sum/${month.year}/${month.month}`);
        const responseData = response.data.response.data;

        labels.value = responseData.categorys.map(item => item.category || '없음');
        data.value = responseData.categorys.map(item => item.sum || 0);
        totalSum.value = responseData.sum || 0;
        categorys.value = responseData.categorys || [];
    } catch (error) {
        console.error('Axios 요청 실패:', error);
        // 기본값 설정
        labels.value = [];
        data.value = [];
        totalSum.value = 0;
        categorys.value = [];
    }

    // 차트 렌더링
    chartInstance = new ChartJS(doughnutChart.value, {
        type: 'doughnut',
        data: {
            labels: labels.value,
            datasets: [{
                data: data.value,
                backgroundColor: iconColors,
                hoverOffset: 4,
            }],
        },
        options: {
            responsive: true,
        },
    });
};

onMounted(() => {
    renderDoughnutChart();
});

watch(() => month.month, (newValue, oldValue) => {
    renderDoughnutChart();
});
</script>

<style scoped>
.anlyzeWrapper {
    width: 864px;
    padding: 30px 20px;
}

.analyzeText {
    margin-left: 1em;
    font-size: 20px;
}

.anlyzeWrapper #month, #mostCategory {
    font-size: 32px;
}

.anlyzeWrapper .chart {
    width: 255px;
    height: 255px;
}

.anlyzeWrapper .chart canvas {
    width: 100%;
    height: 100%;
}

.analyze {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 30px 20px;
    margin-top: 14px;
    border-radius: 31px;
    border: 1px solid #D9D9D9;
}

.consumeSumAndList {
    width: 394px;
}

.totalConsumeAmount {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 28px;
}

.consumeList {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 20px;
}

.consumeList td {
    text-align: center;
    font-size: 20px;
}

.consumeList tr td:first-child {
    height: 20px;
    width: 20px;
    text-align: start;
}

.consumeList tr td:nth-child(2) {
    width: 40%;
    text-align: start;
}

.consumeList .icon {
    width: 10px;
}
</style>
