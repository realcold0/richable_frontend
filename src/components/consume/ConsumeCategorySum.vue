<template >
    <div class="wrapper">
        <div class="anlyzeWrapper">
            <div class="analyzeText">
                <span id="month">9월</span>에는 <span id="mostCategory">식비</span>에 가장 많은 소비를 하였습니다.
            </div>
            <div class="analyze">
                <div class="chart">
                    <canvas ref="doughnutChart"></canvas>
                </div>

                <div class="consumeSumAndList">
                    <div class="totalConsumeAmount">
                        <h3>총소비</h3>
                        <h3>5,000,000 원</h3>
                    </div>
                    
                    <table class="consumeList">
                        <tbody>
                            <tr>
                                <td>외식</td>
                                <td>10000</td>
                                <td>50%</td>

                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    
</template>


<script setup>
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
import { nextTick, onMounted, ref } from 'vue';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, DoughnutController);

const doughnutChart = ref(null);
let chartInstance = null;

const renderDoughnutChart = async() => {
    await nextTick(); 

    if(chartInstance){
        chartInstance.destroy()
    }

    chartInstance = new ChartJS(doughnutChart.value , {
        type : 'doughnut',
        data : {
            datasets: [{
            label: 'My First Dataset',
            data: [300, 50, 100],
            backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
        }]
        },
        options : {
            responsive : true,
        }
    })
}

onMounted(() =>{
    renderDoughnutChart();
})

</script>

<style scoped>
    .wrapper {
        height: 100vh;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        display: flex;

        background-color: red;
    }

    .anlyzeWrapper {
        background-color: blue;
        width: 864px;
        padding: 30px 20px;
    }

    .analyzeText {
        margin-left: 1em;
    }

    .anlyzeWrapper #month, #mostCategory {
        font-size: 32px;
    }
    .anlyzeWrapper .chart {
        width: 255px;
        height: 255px;
        background-color: red;
    }
    .anlyzeWrapper .chart canvas {
        width: 100%;
        height: 100%;
    }

    .analyze {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content :space-between;
        padding: 30px 20px;
        background-color: aqua;
        border-radius:  31px;

    }

    .consumeSumAndList {
        width: 394px;
    }
    .totalConsumeAmount {
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: space-around;
        background-color:antiquewhite;
    }

    .consumeList {
        width: 100%;
    }

    .consumeList .td {
        text-align: center;
    }


</style>