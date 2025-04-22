<template>
    <div class="options">
        <div 
            id="destroyer"
            :class="[`destroyer destroyer__preview ${shipAxis}`, { 'hidden' : shipToRemove.includes('destroyer') }]" 
            draggable="true"
            @dragstart="dragStart"
        >
        </div>
        
        <div 
            id="destroyerTwo"
            :class="[`destroyer destroyer__preview ${shipAxis}`, { 'hidden' : shipToRemove.includes('destroyerTwo') }]" 
            draggable="true"
            @dragstart="dragStart"
        >
        </div>
        <div 
            id="battleship"
            :class="[`battleship battleship__preview ${shipAxis}`, { 'hidden' : shipToRemove.includes('battleship') }]" 
            draggable="true"
            @dragstart="dragStart"
        >
        </div>
        <div v-if="isShipsEmpty">All ships used</div>
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
        return !battleshipStore.isHorizontal ? 'flipped' : '';
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
        border:1px solid #CCC;
        display: flex;
        padding: 2rem;
    }

    .destroyer {
        background-color: #999;
    }

    .destroyer__preview {
        cursor: grab;
        height: 10px;        
        margin: 5px;
        width: 40px;
    }

    .battleship {
        background-color: #999;
    }

    .battleship__preview {
        cursor: grab;
        height: 10px;
        margin: 5px;
        width: 50px;
    }

    .flipped {
        transform: rotate(90deg);
    }

    .hidden {
        display: none;
    }
</style>