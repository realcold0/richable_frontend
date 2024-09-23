<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="main-template">
    <div class="sidebar">사이드바</div>
    <RouterView />
  </div>
</template>

<style scoped>
.main-template {
  display: flex;
  padding: 0;
  margin: 0;
}

.sidebar {
  background-color: blue;
}

/* @media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
