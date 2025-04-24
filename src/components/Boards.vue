<template>
    <div class="boards">
        <div class="board" id="user">
            <div 
                v-for="block in blocks"
                :key="`user-${block}`"
                :id="`player-${block}`"
                :class="['block', 
                    { 'block--populated taken': validPlayerBlocks.includes(block) },
                    {'block--selected': computerSelection.includes(block)},
                    {'block--selected--hit': computerSelection.includes(block) && validPlayerBlocks.includes(block)}
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
                    {'taken': validBlocks.includes(block)},
                    {'block--selected': playerSelection.includes(block)},
                    {'block--selected--hit': playerSelection.includes(block) && validBlocks.includes(block)}
                ]"
                @click="playerBoardClick(block)"
            ></div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { watch, ref, type Ref, computed } from 'vue';
import { useBattleshipsStore, type IShip } from '../store';
import { storeToRefs } from 'pinia';

const battleshipStore = useBattleshipsStore();

const { isPlayerTurn, shouldResetGame, draggedShip, ships, startGame } = storeToRefs(battleshipStore);

interface IShipBlock {
    blocks: Array<number>;
    shipName: string;
}

const totalShips = computed(() =>{
    return ships.value.length;
});

 const totalBlocks: number = 100;
 const blockWidth: number = 10;
 const blocks: Array<number> = Array.from(Array(totalBlocks).keys());
 const validBlocks: Ref<Array<number>> = ref([]);
 const validPlayerBlocks: Ref<Array<Number>> = ref([]);
 const playerSelection: Ref<Array<number>> = ref([]);
 const computerSelection: Ref<Array<number>> = ref([]);
 const notDropped: Ref<boolean> = ref(true);
 const selectedComputerShipBlocks: Ref<Array<IShipBlock>> = ref([]);
 const sunkenComputerShips: Ref<Array<string>> = ref([]);
 const selectedPlayerShipBlocks: Ref<Array<IShipBlock>> = ref([]);
 const sunkenPlayerShips: Ref<Array<string>> = ref([]);
 
 const addShip = (ship: IShip, startId: string | null, user: string) => {
    const selectedBlocks: Array<number> = [];
    const randomStartIndex: number = Math.floor(Math.random() * totalBlocks);
    const startIdNumber = startId ? Number(startId?.split("-")[1]) : null;
    const startIndex = startIdNumber ? startIdNumber : randomStartIndex;
    const randomBoolean = Math.random() < 0.5;
    const isHorizontal = user === 'computer' ? randomBoolean : battleshipStore.isHorizontal;
    
    //Determine where a valid starting block could be given orientation, number of blocks, and the length of the ship.
    const validStart = isHorizontal 
                       ? startIndex <= totalBlocks - ship.length
                        ? startIndex
                        : totalBlocks - ship.length
                       : startIndex <= totalBlocks - ship.length * blockWidth
                        ? startIndex
                        : startIndex - ship.length * blockWidth + blockWidth;
    
    //Loop through ship length and add each block to selection
    for(let i = 0; i < ship.length; i++) {
        if(isHorizontal) {
            selectedBlocks.push(validStart + i);``
        } else {
            selectedBlocks.push(validStart + i * blockWidth);
        }
    }

    // Check if it's a valid place for the ship
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

    // determine whether block we're place is not already in use
    const notTaken = user === 'computer' 
        ? selectedBlocks.every(selectedBlock => !validBlocks.value.includes(selectedBlock))
        : selectedBlocks.every(selectedBlock => !validPlayerBlocks.value.includes(selectedBlock))

    if(valid && notTaken) {
        if(user ==='computer') {
        validBlocks.value.push(...selectedBlocks);
        selectedComputerShipBlocks.value.push({
            shipName: ship.name,
            blocks: [...selectedBlocks]
        });
    }

    if(user === 'player') {
        validPlayerBlocks.value.push(...selectedBlocks);
        selectedPlayerShipBlocks.value.push({
            shipName: ship.name,
            blocks: [...selectedBlocks]
        });
        notDropped.value = false;
    }
    } else {
        if(user === 'computer') addShip(ship, null, user);
        if(user === 'player') notDropped.value = true;
    }

 };

const dragOver = (e: any) => {
    e.preventDefault();
};

const dropShip = (e: any) => {
    const startId = e.target.id;
    const ship = ships.value.filter((ship) => ship.name === draggedShip.value)[0];
    if(ship) addShip(ship, startId, 'player');
    if(!notDropped.value) {
        battleshipStore.setRemoveShip(draggedShip.value);
        draggedShip.value = '';
    }
};

const playerBoardClick = (block: number) => {
   
   if(playerSelection.value.includes(block) || !isPlayerTurn.value || !startGame.value) {
     return;
   }

   playerSelection.value.push(block);

   const isHit: boolean = playerSelection.value.includes(block) && validBlocks.value.includes(block);
   if(isHit && sunkenComputerShips.value.length < totalShips.value) {
    selectedComputerShipBlocks.value.forEach((shipBlocks) => {
        const hitShip = hitChecker(playerSelection.value, shipBlocks.blocks);
        if(hitShip && !sunkenComputerShips.value.includes(shipBlocks.shipName)) {
            sunkenComputerShips.value.push(shipBlocks.shipName);
            battleshipStore.setSunkenShipMessages(shipBlocks.shipName, `Computer's`);
        }
    })
   }

   if(sunkenComputerShips.value.length === totalShips.value) {
    battleshipStore.setIsGameOver(true);
   } else {
    battleshipStore.setIsPlayerTurn(false);
   }
};

const hitChecker = (hitBlock: Array<number>, blockSelection: Array<number>) => 
    blockSelection.every(block => hitBlock.includes(block)) 

const computerTurn = () => {
    const randomSelection: number = Math.floor(Math.random() * totalBlocks);

    if(computerSelection.value.includes(randomSelection)) {
        computerTurn();
        return;
    }

    computerSelection.value.push(randomSelection);

    const isHit: boolean = computerSelection.value.includes(randomSelection) && validPlayerBlocks.value.includes(randomSelection);

    if(isHit && sunkenPlayerShips.value.length < totalShips.value) { 
    selectedPlayerShipBlocks.value.forEach((shipBlocks) => {
        const hitShip = hitChecker(computerSelection.value, shipBlocks.blocks);
        if(hitShip && !sunkenPlayerShips.value.includes(shipBlocks.shipName)) {
            sunkenPlayerShips.value.push(shipBlocks.shipName);
            battleshipStore.setSunkenShipMessages(shipBlocks.shipName, `Player's`);
        }
    })
   }

   if(sunkenPlayerShips.value.length === totalShips.value) {
    battleshipStore.setIsGameOver(true);
   } else {
    battleshipStore.setIsPlayerTurn(true);
   }

};

watch(isPlayerTurn, (newValue) => {
    if(!newValue) {
        setTimeout(() => computerTurn(), 800);
    }
});

watch(shouldResetGame, (newValue) => {
    if(newValue) {
        playerSelection.value = [];
        computerSelection.value = [];
        validPlayerBlocks.value = [];
        validBlocks.value = [];
        ships.value.forEach(ship => addShip(ship, null, 'computer'));
        battleshipStore.clearSunkenShipMessages();
        selectedPlayerShipBlocks.value = [];
        selectedComputerShipBlocks.value = [];
        
    }
 });

 //Auto add computer blocks on page load
 ships.value.forEach(ship => addShip(ship, null, 'computer'));

</script>

<style scoped>

.boards {
    display: flex;
    justify-content: center;   
    width: 100%;
}

.board {
    background-color: #03e5b7;
    background-image: linear-gradient(315deg, #03e5b7 0%, #037ade 74%);
    display: grid;
    grid-template-rows: repeat(10, 4.6vmin);
    grid-template-columns: repeat(10, 4.6vmin);
    margin: 2vmin;
}

.block {
    border: 1px solid hsla(0, 0%, 100%, .2);
    box-sizing: border-box;
}

.block--populated {
    background-color: #999;
}

.block--selected--hit,
.block--selected {
    align-items: center;
    display: flex;
    justify-content: center;
}

.block--selected--hit::after,
.block--selected::after {
    content: '';
    position: absolute;
    border-radius: 100%;
    width: 2vmin;
    height: 2vmin;
}

.block--selected::after {
    background-color: black;
}

.block--selected--hit::after {
    background-color: red;
}

</style>