import { defineStore } from "pinia";
import { ref, computed } from 'vue'

export const useMonthStore = defineStore('month', () => {
    const today = new Date();
    const month = ref(today.getMonth() + 1);
    const year = ref(today.getFullYear())

    function increaseMonth(){
        today.setMonth(month.value)
        month.value = today.getMonth() + 1;
        year.value = today.getFullYear(); // 업데이트된 년도
    
        return {year: year.value ,month : month.value};
    }
    
    function decreaseMonth(){
        today.setMonth(month.value - 2)
        month.value = today.getMonth() + 1;
        year.value = today.getFullYear(); // 업데이트된 년도
    
        return {year: year.value ,month : month.value };
    }
    
    function getYearMonth(){
        return {year : year.value, month: month.value};
    }

    const getPrevMonth = computed(() => {
        const prevDate = new Date(year.value, month.value - 1); // 현재 날짜 기준으로 복사
        prevDate.setMonth(prevDate.getMonth() - 1); // 이전 달로 설정
    
        const prevYear = prevDate.getFullYear();
        const prevMonth = prevDate.getMonth() + 1; // 월은 0부터 시작하므로 +1
    
        return { year: prevYear, month: prevMonth };
    });


    return {month, year,increaseMonth, decreaseMonth, getYearMonth, getPrevMonth}
})