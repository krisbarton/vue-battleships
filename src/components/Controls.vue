<template>
    <div>
        <button @click="battleshipStore.flip" :disabled="canStart">Flip your ship</button>
        <button @click="battleshipStore.doStartGame(true)" :disabled="!canStart || startGame">Start the game</button>
        <button>Restart</button>
    </div>
</template>
<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import { useBattleshipsStore } from '../store';

    const battleshipStore = useBattleshipsStore();
    const { canStart, startGame } = storeToRefs(battleshipStore);
</script>