<template>
    <div class="info">
        <div class="sunken__messages" v-if="isSunkenShipMessages">
            <ul>
                <li 
                    v-for="message in sunkenShipMessages"
                    :key="generateUUID"
                >
                    {{ message }}
                </li>
            </ul>
        </div>
        <div>
            <div v-if="!startGame">Place all of your ships on the board and click Start the game to begin</div>
            <div class="turn" v-if="startGame && !isGameOver">
                <span v-if="isPlayerTurn">Player's turn</span>
                <span v-else>Computer's turn</span>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { computed } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useBattleshipsStore } from '../store';

    const battleshipStore = useBattleshipsStore();
    const { startGame, isPlayerTurn, sunkenShipMessages,isGameOver } = storeToRefs(battleshipStore);

    const isSunkenShipMessages = computed(() => {
        return sunkenShipMessages.value.length > 0;
    });
    


    const generateUUID = () => {
        return crypto.randomUUID();
    }
</script>

<style scoped>
    .info {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        width: 100%;
    }

    .sunken__messages {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        width: 100%;
    }

    .sunken__messages ul {
        list-style-type: "\1F525";
        line-height: 1.8;
    }

    .turn {
        font-size: 1.8rem;
    }
</style>