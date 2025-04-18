<template>
  <Info 
    :is-player-turn="isPlayerTurn" 
    :start-game="startGame"
    :is-game-over="isGameOver"
    @reset-game="setResetGame"
  />
  <Boards 
    :is-horizontal="isHorizontrol" 
    :dragged-ship="draggedShip"
    :is-player-turn="isPlayerTurn"
    :should-reset-game="shouldResetGame"
    @remove-ship="setRemovedShip"
    @change-turn="setPlayerTurn"
    @game-over="setIsGameOver"
   />
  <Options 
    :is-horizontal="isHorizontrol" 
    :remove-ship="removeShip"
    :restore-ships="shouldResetGame"
    @dragged="setDraggedShip"
    @canStart="setCanStart"
    />
  <Controls 
    :can-start="canStart"
    @flip="doFlip"
    @start="setStartGame"
   />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Info from './components/Info.vue';
import Boards from './components/Boards.vue';
import Options from './components/Options.vue';
import Controls from './components/Controls.vue';

const isHorizontrol = ref(true);
const draggedShip = ref('');
const removeShip = ref('');
const startGame = ref(false);
const canStart = ref(false);
const isPlayerTurn = ref(true);
const isGameOver = ref(false);
const shouldResetGame = ref(false);

const doFlip = () => {
  isHorizontrol.value = !isHorizontrol.value;
};

const setDraggedShip = (ship: any) => {
  draggedShip.value = ship.id;
}

const setCanStart = (status: boolean) => {
  canStart.value = status;
  isGameOver.value = false;
}

const setStartGame = (status: boolean) => {
  startGame.value = status;
  if(status) {
     isGameOver.value = false;
     shouldResetGame.value = false;
     isPlayerTurn.value = true;
  }
}

const setRemovedShip = (ship: any) => {
  if(ship) {
    removeShip.value = ship;
  }
};

const setPlayerTurn = (turn: boolean) => {
  isPlayerTurn.value = turn;
}

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
