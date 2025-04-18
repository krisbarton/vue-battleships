<template>
  <Info 
    :is-game-over="isGameOver"
    @reset-game="setResetGame"
  />
  <Boards 
    :dragged-ship="draggedShip"
    :should-reset-game="shouldResetGame"
    @remove-ship="setRemovedShip"
    @game-over="setIsGameOver"
   />
  <Options 
    :remove-ship="removeShip"
    :restore-ships="shouldResetGame"
    @dragged="setDraggedShip"
    />
  <Controls />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Info from './components/Info.vue';
import Boards from './components/Boards.vue';
import Options from './components/Options.vue';
import Controls from './components/Controls.vue';

const draggedShip = ref('');
const removeShip = ref('');
const canStart = ref(false);
const isGameOver = ref(false);
const shouldResetGame = ref(false);

const setDraggedShip = (ship: any) => {
  draggedShip.value = ship.id;
}

const setRemovedShip = (ship: any) => {
  if(ship) {
    removeShip.value = ship;
  }
};

const setIsGameOver = () => {
  isGameOver.value = true;
}

const setResetGame = () => {
  shouldResetGame.value = true;
  canStart.value = false;
}

</script>

<style scoped>



</style>
