<template>
    <div>
        <h2>Budgets</h2>
      <ul>
        <BudgetItem 
          v-for="budget in budgets" 
          :key="budget.id" 
          :budget="budget"
          @delete="onDelete"
          @edit="onEdit"
        />
      </ul>
    </div>
</template>
  
<script>
  import BudgetItem from './BudgetItem.vue'
  
  export default {
    props: ['budgets'],
    components: {
      BudgetItem
    },
    methods: {
      onDelete(budgetId) {
        this.$emit('delete', budgetId);
      },
      onEdit(budget) {
        this.$emit('edit', budget);
      }
    }
  }
  </script>
  