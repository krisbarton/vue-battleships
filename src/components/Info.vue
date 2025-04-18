<template>
    <div>
        <div v-if="displayReset">Game over. <button @click="doReset">Play again?</button></div>
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
    import { watch, ref, type Ref } from 'vue';

    const props = defineProps({
        isPlayerTurn: Boolean,
        startGame: Boolean,
        isGameOver: Boolean,
    });

    const displayReset: Ref<Boolean> = ref(false);

    const emit = defineEmits(['resetGame']);
    
    const doReset = () => {
        displayReset.value = false;
        emit('resetGame');
    }

    watch(() => props.isGameOver, (newValue) => {
        if(newValue) {
            displayReset.value = true;
        }
    });
</script>