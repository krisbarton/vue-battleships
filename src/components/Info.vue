<template>
    <div>
        <div v-if="isGameOver">Game over. <button @click="doReset">Play again?</button></div>
        <div v-else>
            <div v-if="!startGame">Place all of your ships on the board and click Start the game to begin</div>
            <div v-else>
                Who's turn is it? 
                <span v-if="isPlayerTurn">Players turn</span>
                <span v-else>Computers turn</span>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import { useBattleshipsStore } from '../store';

    const battleshipStore = useBattleshipsStore();
    const { startGame, isPlayerTurn, isGameOver } = storeToRefs(battleshipStore);

    const emit = defineEmits(['resetGame']);
    
    const doReset = () => {
        battleshipStore.setResetGame(true);
    }
</script>