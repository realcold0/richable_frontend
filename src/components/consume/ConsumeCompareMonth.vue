<template>
    <div class="wrapper">


        <div class="consumeCompareWrapper">
            <div class="consumeCompareTitle">
                저번 달보다 <strong style="color: #ff0062;">{{ differenceMessage }}원 더 </strong> 썼어요!
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

const curMonth = ref([]);
const prevMonth = ref([]);
const today = new Date(); // 오늘 날짜 가져오기
const currentYear = today.getFullYear(); // 현재 연도
const currentMonth = today.getMonth() + 1; // 현재 월 (0부터 시작하므로 1을 더함)
const currentDay = today.getDate(); // 오늘의 일(day)만 추출
const days = Array.from({ length: 31 }, (_, i) => i + 1); // 전체 31일까지의 날짜 배열 생성


// 차이 계산 후 메시지 출력
const differenceMessage = ref('');

const renderLineChart = async () => {
    await nextTick();

    if (chartInstance) {
        chartInstance.destroy();
    }

    await axios.get(`http://localhost:8080/outcome/category/dailysum/${month.year}/${month.month}`)
        .then(response => {
            // 현재 월과 년도와 같은 경우에만 오늘 날짜까지만 자름
            if (month.year === currentYear && month.month === currentMonth) {
                curMonth.value = response.data.response.data.prices.slice(0, currentDay); // 오늘까지만 자름
            } else {
                curMonth.value = response.data.response.data.prices; // 전체 데이터 사용
            }
        })
        .catch(error => {
            console.log(error);
        });

    // 지난 달 데이터 가져오기 (전체)
    await axios.get(`http://localhost:8080/outcome/category/dailysum/${month.getPrevMonth.year}/${month.getPrevMonth.month}`)
        .then(response => {
            prevMonth.value = response.data.response.data.prices; // 전체 데이터 사용
            console.log(prevMonth.value);
        })
        .catch(error => {
            console.log(error);
        });
    

    // 날짜별 값 비교 및 차이 계산
let totalDifference = 0;

// 이번 달과 저번 달의 오늘 날짜 데이터를 비교
const curValue = curMonth.value[currentDay - 1] || 0; // 이번 달의 오늘 데이터
const prevValue = prevMonth.value[currentDay - 1] || 0; // 저번 달의 오늘 데이터

totalDifference = curValue - prevValue; // 오늘 날짜의 값 차이 계산

// 메시지 업데이트 (양수이면 더 썼음, 음수이면 덜 썼음)
if (totalDifference > 0) {
    differenceMessage.value = `${Math.abs(totalDifference).toLocaleString()}`;
} else {
    differenceMessage.value = `${Math.abs(totalDifference).toLocaleString()}`;
}

    // 차트 렌더링
    chartInstance = new ChartJS(lineChart.value, {
        type: 'line', // 차트 유형: 선형 차트
        data: {
            labels: days, // 최대 31일까지의 날짜 배열
            datasets: [{
                label: month.month + '월', // 이번 달 레이블
                data: curMonth.value, // 이번 달 데이터 (오늘까지만 또는 전체)
                fill: false, // 차트 내부를 채우지 않음
                borderColor: '#FF0062', // 선 색상: 빨간색
                tension: 0, // 곡선을 제거하여 직선으로 표시
                pointRadius: days.map(day => {
                    // 현재 날짜에는 점을 크게 표시, 그 외에는 점을 표시하지 않음
                    if (month.year === currentYear && month.month === currentMonth && day === currentDay) {
                        return 6; // 현재 날짜에만 점 표시 (크기 6)
                    }
                    return 0; // 그 외에는 점 표시 안함
                }),
                pointBackgroundColor: '#FF0062', // 현재 날짜의 데이터 포인트 색상: 빨간색
            },
            {
                label: month.getPrevMonth.month + '월', // 전달 레이블
                data: prevMonth.value, // 전달 데이터
                fill: false, // 차트 내부를 채우지 않음
                borderColor: '#D1D6D9', // 선 색상: 회색
                tension: 0, // 곡선을 제거하여 직선으로 표시
                pointRadius: 0 // 전달 데이터에는 점을 표시하지 않음
            }]
        },
        options: {
            responsive: true, // 반응형으로 차트를 크기에 맞게 조정
            plugins: {
                legend: {
                    position: 'bottom',  // 범례를 차트 아래에 표시
                    labels: {
                        boxWidth: 20, // 범례 아이콘의 너비
                        padding: 20, // 범례의 간격
                    },
                },
            },
            elements: {
                line: {
                    tension: 0 // 선의 곡률 제거 (직선으로 표시)
                },
                point: {
                    radius: 0 // 기본적으로 점을 표시하지 않음
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false, // X축의 그리드를 표시하지 않음
                    }
                },
                y: {
                    display: false, // Y축 자체를 표시하지 않음
                    grid: {
                        display: false, // Y축의 그리드도 표시하지 않음
                    }
                }
            }
        }
    });
}

onMounted(() => {
    renderLineChart();
});

watch(() => month.month, () => {
    renderLineChart();
});
</script>

<style scoped>
*{
    width:864px;
    font-family: pretendard;    
    font-size: 18px ;
}

.anlyzeWrapper {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 20px;
    background-color: #f9f9f9;
    border-radius: 15px;
}
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
