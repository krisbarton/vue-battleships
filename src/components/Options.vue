<template>
    <div class="options" v-if="!isShipsEmpty">
        <div 
            id="destroyer"
            :class="[`ship destroyer destroyer--${shipAxis}`, { 'hidden' : shipToRemove.includes('destroyer') }]" 
            draggable="true"
            @dragstart="dragStart"
        >
        </div>
        
        <div 
            id="destroyerTwo"
            :class="[`ship destroyer destroyer--${shipAxis}`, { 'hidden' : shipToRemove.includes('destroyerTwo') }]" 
            draggable="true"
            @dragstart="dragStart"
        >
        </div>
        <div 
            id="battleship"
            :class="[`ship battleship battleship--${shipAxis}`, { 'hidden' : shipToRemove.includes('battleship') }]" 
            draggable="true"
            @dragstart="dragStart"
        >
        </div>
    </div>
</template>
<script setup lang="ts">
    import { computed, watch, ref, type Ref } from 'vue';
    import { useBattleshipsStore } from '../store';
    import { storeToRefs } from 'pinia';

    const battleshipStore = useBattleshipsStore();

    const { removeShip, shouldResetGame, ships } = storeToRefs(battleshipStore);
    
    const isShipsEmpty = computed(() => {
        return ships.value.every(ship => shipToRemove.value.includes(ship.name));
    });

    const shipAxis = computed(() => {
        return !battleshipStore.isHorizontal ? 'vertical' : 'horizontal';
    });

    const shipToRemove: Ref<Array<String>> = ref([]);

    const dragStart = (e: any) => {
        battleshipStore.setDraggedShip(e.target.id);
    }

    watch(removeShip, (newValue) => {
        if(newValue) {
            shipToRemove.value.push(newValue);
            if(shipToRemove.value.length === 3) {
                battleshipStore.setCanStart(true);
            }
        }
    });

    watch(shouldResetGame, (newValue) => {
        if(newValue) {
            shipToRemove.value = [];
        }
    });
</script>

<style scoped>
    .options {
        display: flex;
        justify-content: center;
        padding: 6rem 2rem;
        width: 100%;
    }

    .ship {
        background-color: #999;
        cursor: grab;
        margin: 1vmin;
        width: calc(4.6vmin * var(--width, 1));
        height: calc(4.6vmin * var(--height, 1));
    }

    .destroyer {
       --width: 4;
       --height: 1;
    }

    .destroyer--vertical {
        transform: rotate(90deg);
    }

    .battleship {
        --height: 1;
        --width: 5;
    }

    .battleship--vertical {
        transform: rotate(90deg);
    }

    .hidden {
        display: none;
    }
</style>