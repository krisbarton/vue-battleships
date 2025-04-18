<template>
    <div>
        <button @click="emit('flip')" :disabled="canStartGame">Flip your ship</button>
        <button @click="startGame" :disabled="!canStartGame || gameStarted">Start the game</button>
        <button>Restart</button>
    </div>
</template>
<script setup lang="ts">
    import { ref, watch } from 'vue';

    const emit = defineEmits(['start', 'flip']);
    const props = defineProps({
        canStart: Boolean
    });

    const gameStarted = ref(false);
    const canStartGame = ref(false);

    const startGame = () => {
        gameStarted.value = true;
        emit('start', true);
    }

    watch(() => props.canStart, (newValue) => {
        canStartGame.value = newValue;
        if(!newValue) {
            gameStarted.value = false;
        }
    });

</script>