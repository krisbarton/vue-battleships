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

    const battleshipStore = useBattleshipsStore();
    
    // we could make this data array centralised and create the above ships from it
    const shipNames = ['battleship', 'destroyer', 'destroyerTwo'];
    const isShipsEmpty = computed(() => {
        return shipNames.every(name => shipToRemove.value.includes(name));
    });
    const emit = defineEmits(['dragged', 'canStart']);
    const shipToRemove: Ref<Array<String>> = ref([]);
    let draggedShip;

    const shipAxis = computed(() => {
        return !battleshipStore.isHorizontal ? 'flipped' : '';
    });

    const props = defineProps({
        removeShip: String,
        restoreShips: Boolean,
    });

    const dragStart = (e: any) => {
        draggedShip = e.target;
        emit('dragged', draggedShip);
    }

    watch(() => props.removeShip, (newValue) => {
        if(newValue) {
            shipToRemove.value.push(newValue);
            if(shipToRemove.value.length === 3) {
                battleshipStore.setCanStart(true);
            }
        }
    });

    watch(() => props.restoreShips, (newValue) => {
        if(newValue) {
            shipToRemove.value = [];
        }
    })
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
        background-color: #666;
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