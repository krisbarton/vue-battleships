<template>
    <div class="boards">
        <div class="board" id="user">
            <div 
                v-for="block in blocks"
                :key="`user-${block}`"
                :id="`player-${block}`"
                :class="['block', 
                    { 'block--populated taken': validUserBlocks.includes(block) },
                    {'block--selected': computerSelection.includes(block)},
                    {'block--selected--hit': computerSelection.includes(block) && validUserBlocks.includes(block)}
                ]"
                @drop="dropShip"
                @dragover="dragOver"
            ></div>
        </div>
        <div class="board" id="computer">
            <div 
                v-for="block in blocks"
                :key="`computer-${block}`"
                :id="`computer-${block}`"
                :class="['block', 
                    {'block--populated taken': validBlocks.includes(block)},
                    {'block--selected': playerSelection.includes(block)},
                    {'block--selected--hit': playerSelection.includes(block) && validBlocks.includes(block)}
                ]"
                @click="playerBoardClick(block)"
            ></div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { watch, ref, type Ref } from 'vue';
import Ship, { type IShip } from '../static/ship';

 const props = defineProps({
    isHorizontal: Boolean,
    draggedShip: String,
    isPlayerTurn: Boolean,
    shouldResetGame: Boolean,
 });

 const emit = defineEmits(['removeShip', 'changeTurn', 'gameOver']);

 watch(() => props.draggedShip, (newValue) => {
    if(newValue) {
        dragShip.value = newValue;
    }
 });

 watch(() => props.shouldResetGame, (newValue) => {
    if(newValue) {
        playerSelection.value = [];
        computerSelection.value = [];
        validUserBlocks.value = [];
        validBlocks.value = [];
        playerHitCount.value = 0;
        computerHitCount.value = 0;
        ships.forEach(ship => addShip(ship, null, 'computer'));
    }
 });

 const dragShip = ref('');
 const totalBlocks: number = 100;
 const blockWidth: number = 10;
 const blocks: Array<number> = Array.from(Array(totalBlocks).keys());
 const battleship = new Ship('battleship', 5);
 const destroyerOne = new Ship('destroyer', 4);
 const destoryerTwo = new Ship('destroyerTwo', 4);
 const ships = [battleship, destroyerOne, destoryerTwo];
 const validBlocks: Ref<Array<number>> = ref([]);
 const validUserBlocks: Ref<Array<Number>> = ref([]);
 const playerSelection: Ref<Array<number>> = ref([]);
 const computerSelection: Ref<Array<number>> = ref([]);
 let notDropped: boolean = true;
 const totalHits: number = 13;
 const playerHitCount: Ref<number> = ref(0);
 const computerHitCount: Ref<number> = ref(0);
 
 const addShip = (ship: IShip, startId: string | null, user: string) => {
    const selectedBlocks: Array<number> = [];
    const randomStartIndex: number = Math.floor(Math.random() * totalBlocks);
    const startIdNumber = startId ? Number(startId?.split("-")[1]) : null;
    const startIndex = startIdNumber ? startIdNumber : randomStartIndex;

    const randomBoolean = Math.random() < 0.5;
    const isHorizontal = user === 'computer' ? randomBoolean : props.isHorizontal;
    const validStart = isHorizontal 
                       ? startIndex <= totalBlocks - ship.length
                       ? startIndex
                       : totalBlocks - ship.length
                       : startIndex <= totalBlocks - ship.length * blockWidth
                       ? startIndex
                       : startIndex - ship.length * blockWidth + blockWidth;


    for(let i = 0; i < ship.length; i++) {
        if(isHorizontal) {
            selectedBlocks.push(validStart + i);
        } else {
            selectedBlocks.push(validStart + i * blockWidth);
        }
    }

    let valid;
    if(isHorizontal) {
        selectedBlocks.every((_selectedBlocks, index) => 
            valid = selectedBlocks[0] % blockWidth !== blockWidth - (selectedBlocks.length - (index + 1))
        );
    } else {
        selectedBlocks.every((_selectedBlock, index) => 
            valid = selectedBlocks[0] < 90 + (blockWidth * index + 1)
        );
    }

    const notTaken = user === 'computer' 
        ? selectedBlocks.every(selectedBlock => !validBlocks.value.includes(selectedBlock))
        : selectedBlocks.every(selectedBlock => !validUserBlocks.value.includes(selectedBlock))

    if(valid && notTaken) {
       if(user ==='computer') validBlocks.value.push(...selectedBlocks);
       if(user === 'player') {
         validUserBlocks.value.push(...selectedBlocks);
         notDropped = false;
       }
    } else {
        if(user === 'computer') addShip(ship, null, user);
        if(user === 'player') notDropped = true;
    }
 };

ships.forEach(ship => addShip(ship, null, 'computer'));

const dragOver = (e: any) => {
    e.preventDefault();
};

const dropShip = (e: any) => {
    const startId = e.target.id;
    const ship = ships.filter((ship) => ship.name === dragShip.value)[0];
    if(ship) addShip(ship, startId, 'player');
    if(!notDropped) {
        emit('removeShip', dragShip.value);
        dragShip.value = '';
    }
};

const playerBoardClick = (block: number) => {
   
   if(playerSelection.value.includes(block) || !props.isPlayerTurn) {
     return;
   }

   playerSelection.value.push(block);

   const isHit: boolean = playerSelection.value.includes(block) && validBlocks.value.includes(block);
   if(isHit && playerHitCount.value < totalHits) {
    playerHitCount.value++;
   }

   if(playerHitCount.value === totalHits) {
    emit('gameOver');
   } else {
    emit('changeTurn', false)
   }
};

const computerTurn = () => {
    const randomSelection: number = Math.floor(Math.random() * totalBlocks);

    if(computerSelection.value.includes(randomSelection)) {
        computerTurn();
        return;
    }

    computerSelection.value.push(randomSelection);
    const isHit: boolean = computerSelection.value.includes(randomSelection) && validUserBlocks.value.includes(randomSelection);
    if(isHit && computerHitCount.value < totalHits) {
        computerHitCount.value++;
   }

   if(computerHitCount.value === totalHits) {
    emit('gameOver');
   } else {
     emit('changeTurn', true)
   }

};

watch(() => props.isPlayerTurn, (newValue) => {
    if(!newValue) {
        setTimeout(() => computerTurn(), 500);
    }
});

</script>

<style scoped>

.boards {
    display: flex;
    justify-content: center;
}

.board {
    background-color: #03e5b7;
    background-image: linear-gradient(315deg, #03e5b7 0%, #037ade 74%);
    display: flex;
    flex-wrap: wrap;
    height: 200px;
    margin: 10px;
    width: 200px;
}

.block {
    border: 1px solid #FFF;
    box-sizing: border-box;
    height: 20px;
    width: 20px;
}

.block--populated {
    background-color: #999;
}

.block--selected {
    background-color: blueviolet;
}

.block--selected--hit {
    background-color: red;
}

</style>