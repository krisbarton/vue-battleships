<template>
    <div class="controls">
        <button data-id="flip" v-if="!canStart" @click="battleshipStore.flip">Flip your ship</button>
        <button data-id="start" v-if="!startGame && canStart" @click="battleshipStore.doStartGame(true)">Start the game</button>
        <button data-id="restart" v-if="!isGameOver && startGame" @click="doReset">Restart</button>
        <div v-if="isGameOver">Game over! <button data-id="game-over" @click="doReset">Play again?</button></div>
    </div>
</template>
<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import { useBattleshipsStore } from '../store';

    const battleshipStore = useBattleshipsStore();
    const { canStart, startGame, isGameOver } = storeToRefs(battleshipStore);

    const doReset = () => {
        battleshipStore.setResetGame(true);
    }
</script>
<style scoped>
    .controls {
        display: flex;
        justify-content: center;
        width: 100%;
    }

</style>