<template>
  <div class="container">
    <h1>Battleships!</h1>
    <Controls />
    <Boards />
    <Info />
    <Options />
  </div>
</template>

<script setup lang="ts">
  import Info from './components/Info.vue';
  import Boards from './components/Boards.vue';
  import Options from './components/Options.vue';
  import Controls from './components/Controls.vue';
</script>

<style scoped>
.container {
  align-items: flex-start;
  align-content: flex-start;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

</style>