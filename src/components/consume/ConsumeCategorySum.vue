<template>
    <div class="wrapper">
        <div class="analyzeWrapper">
            <div class="analyzeText">
                <span id="month">{{ month.month }}월</span>에는 
                <span id="mostCategory">{{ topCategories[0]?.category || '데이터 없음' }}</span>에 가장 많은 소비를 하였습니다.
            </div>
        
            <div class="analyze">
                <div class="chart">
                    <canvas ref="doughnutChart"></canvas>
                </div>

                <div class="consumeSummary">
                    <div class="totalConsumeAmount">
                        <div>총 소비</div>
                        <div>{{ totalSum !== null ? totalSum.toLocaleString() : '0' }} 원</div>
                    </div>
                    
                    <table class="consumeList">
                        <tbody>
                            <tr v-for="(category, index) in topCategories" :key="index" @click="showDetail(category)">
                                <td><font-awesome-icon :icon="['fas', 'circle']" class="icon" :style="{ color: iconColors[index] || '#000' }" /></td>
                                <td>{{ category.category || '없음' }}</td>
                                <td>{{ totalSum > 0 ? Math.round((category.sum / totalSum) * 100) : 0 }}%</td>
                                <td>{{ category.sum !== null ? category.sum.toLocaleString() : '0' }} 원 </td>
                                <td> ></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- 세부 항목을 표시하는 모달 -->
        <div v-if="showDetailModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeDetailModal">&times;</span>
                <h3>{{ selectedCategory.category }}의 세부 항목</h3>
                <ul>
                    <li v-for="(detail, index) in filteredItems" :key="index">
                        {{ detail.category }}: {{ detail.sum.toLocaleString() }} 원
                    </li>
                </ul>

                <!-- 라우터 링크 버튼 -->
                <router-link :to="{ path: '/budget/list', query: { category: selectedCategory.category } }">
                    <button class="btn btn-pink">세부항목 보러가기</button>
                </router-link>
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
import { useRouter } from 'vue-router';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, DoughnutController);

const month = useMonthStore();
const doughnutChart = ref(null);
let chartInstance = null;

const totalSum = ref(0);  // 중복된 선언 제거
const categories = ref([]);  // 'categorys'에서 오타 수정
const topCategories = ref([]); // 상위 4개와 그 외를 담는 배열
const filteredItems = ref([]); // 필터링된 세부항목
let labels = ref([]);
let data = ref([]);
const iconColors = [ '#FF0062', '#C30044','#DA0052', '#FFF2F6','#DCD4D4'];

// 모달 관련 상태
const showDetailModal = ref(false);
const selectedCategory = ref({});

// 카테고리 매핑 정의
const categoryMapping = {
    '식료품': '식료품',
    '식료품 · 비주류음료': '식료품',
    '주류 · 담배': '유흥',
    '의류 · 신발': '쇼핑',
    '주거 · 수도 · 광열': '공과금',
    '가정용품 · 가사서비스': '생활용품',
    '보건': '의료비',
    '교통': '교통비',
    '통신': '통신비',
    '오락 · 문화': '문화',
    '교육': '교육비',
    '음식 · 숙박': '외식·숙박',
    '기타상품 · 서비스': '기타',
};

// "그 외" 항목 클릭 시 디테일 항목을 모달로 보여줌
const showDetail = (category) => {
    if (category.category === '그 외') {
        selectedCategory.value = category;
        filteredItems.value = categories.value.slice(4); // "그 외" 항목 세부 데이터
    } else {
        selectedCategory.value = category;
        filteredItems.value = categories.value.filter(item => item.category === category.category); // 필터링된 데이터
    }
    showDetailModal.value = true;
};

// 모달 닫기 함수
const closeDetailModal = () => {
    showDetailModal.value = false;
};

// 카테고리 데이터 처리 함수
const processCategories = () => {
    const processedData = {};

    // 원본 데이터를 매핑하여 변환
    categories.value.forEach(item => {
        const mappedCategory = categoryMapping[item.category] || '기타';
        if (!processedData[mappedCategory]) {
            processedData[mappedCategory] = 0;
        }
        processedData[mappedCategory] += item.sum;
    });

    const mappedCategories = Object.entries(processedData).map(([category, sum]) => ({
        category,
        sum,
    }));

    if (mappedCategories.length > 5) {
        const top4 = mappedCategories.slice(0, 4);
        const others = mappedCategories.slice(4);

        const othersSum = others.reduce((sum, item) => sum + item.sum, 0);
        topCategories.value = [...top4, { category: '그 외', sum: othersSum }];
    } else {
        topCategories.value = mappedCategories;
    }

    labels.value = topCategories.value.map(item => item.category || '없음');
    data.value = topCategories.value.map(item => item.sum || 0);
};

// 차트 렌더링 함수
const renderDoughnutChart = async () => {
    await nextTick();

    if (chartInstance) {
        chartInstance.destroy();
    }

    try {
        const response = await axios.get(`http://localhost:8080/outcome/category/sum/${month.year}/${month.month}`);
        const responseData = response.data.response.data;

        categories.value = responseData.categorys || [];
        totalSum.value = responseData.sum || 0;

        processCategories();
    } catch (error) {
        console.error('Axios 요청 실패:', error);
        labels.value = [];
        data.value = [];
        totalSum.value = 0;
        categories.value = [];
        topCategories.value = [];
    }

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
            plugins: {
                legend: {
                    position: 'bottom',  // 범례를 아래에 표시
                    labels: {
                        boxWidth: 20,
                        padding: 20,
                    },
                },
            },
        },
    });
};

onMounted(() => {
    renderDoughnutChart();
});

watch(() => month.month, () => {
    renderDoughnutChart();
});
</script>


<style scoped>
* {
    font-family: 'Pretendard', sans-serif;
}

.wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.analyzeWrapper {
    background-color: #f9f9f9;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 40px;
}

.analyzeText {
    text-align: center;
    font-size: 20px;
    margin-bottom: 20px;
}

.analyzeText #month, 
.analyzeText #mostCategory {
    color: #FF0062; /* 강조 색상 */
    font-weight: bold;
}

.analyze {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.chart {
    width: 300px;
    height: 300px;
}

.chart canvas {
    width: 100% !important;
    height: 100% !important;
}

.consumeSummary {
    width: 450px;
}

.totalConsumeAmount {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    margin-bottom: 20px;
}

.consumeList {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 10px;
}

.consumeList td {
    text-align: left;
    font-size: 16px;
    padding: 10px;
}

.consumeList tr:hover {
    background-color: #f2f2f2;
    cursor: pointer;
}

.icon {
    margin-right: 10px;
    width: 12px;
    height: 12px;
}

/* 모달 스타일 */
.modal {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 500px;
    position: relative;
}

.modal-content h3 {
    font-size: 22px;
    text-align: center;
    margin-bottom: 20px;
}

.modal-content ul {
    list-style-type: none;
    padding: 0;
}

.modal-content li {
    font-size: 16px;
    margin-bottom: 10px;
}

.close {
    position: absolute;
    right: 20px;
    top: 20px;
    font-size: 24px;
    cursor: pointer;
}

.btn-pink {
    display: block;
    margin: 0 auto;
    padding: 10px 20px;
    background-color: #ff007f;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

.btn-pink:hover {
    background-color: #e60073;
}
</style>
