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
import { useBattleshipsStore, type IShip } from '../store';
import { storeToRefs } from 'pinia';

const battleshipStore = useBattleshipsStore();

const { isPlayerTurn, shouldResetGame, draggedShip, ships } = storeToRefs(battleshipStore);

 watch(shouldResetGame, (newValue) => {
    if(newValue) {
        playerSelection.value = [];
        computerSelection.value = [];
        validUserBlocks.value = [];
        validBlocks.value = [];
        playerHitCount.value = 0;
        computerHitCount.value = 0;
        ships.value.forEach(ship => addShip(ship, null, 'computer'));
    }
 });

interface IShipBlock {
    blocks: Array<number>;
    shipName: string;
}

 const totalBlocks: number = 100;
 const blockWidth: number = 10;
 const blocks: Array<number> = Array.from(Array(totalBlocks).keys());
 const validBlocks: Ref<Array<number>> = ref([]);
 const validUserBlocks: Ref<Array<Number>> = ref([]);
 const playerSelection: Ref<Array<number>> = ref([]);
 const computerSelection: Ref<Array<number>> = ref([]);
 let notDropped: boolean = true;
 const totalHits: number = 13;
 const playerHitCount: Ref<number> = ref(0);
 const computerHitCount: Ref<number> = ref(0);
 const selectedComputerShipBlocks: Ref<Array<IShipBlock>> = ref([]);
 
 const addShip = (ship: IShip, startId: string | null, user: string) => {
    const selectedBlocks: Array<number> = [];
    const randomStartIndex: number = Math.floor(Math.random() * totalBlocks);
    const startIdNumber = startId ? Number(startId?.split("-")[1]) : null;
    const startIndex = startIdNumber ? startIdNumber : randomStartIndex;

    const randomBoolean = Math.random() < 0.5;
    const isHorizontal = user === 'computer' ? randomBoolean : battleshipStore.isHorizontal;
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
       if(user ==='computer') {
            validBlocks.value.push(...selectedBlocks);
            selectedComputerShipBlocks.value.push({
                shipName: ship.name,
                blocks: [...selectedBlocks]
            });
       }

       if(user === 'player') {
         validUserBlocks.value.push(...selectedBlocks);
         notDropped = false;
       }
    } else {
        if(user === 'computer') addShip(ship, null, user);
        if(user === 'player') notDropped = true;
    }
 };

ships.value.forEach(ship => addShip(ship, null, 'computer'));

const dragOver = (e: any) => {
    e.preventDefault();
};

const dropShip = (e: any) => {
    const startId = e.target.id;
    const ship = ships.value.filter((ship) => ship.name === draggedShip.value)[0];
    if(ship) addShip(ship, startId, 'player');
    if(!notDropped) {
        battleshipStore.setRemoveShip(draggedShip.value);
        draggedShip.value = '';
    }
};

const playerBoardClick = (block: number) => {
   
   if(playerSelection.value.includes(block) || !isPlayerTurn) {
     return;
   }

   playerSelection.value.push(block);

   const isHit: boolean = playerSelection.value.includes(block) && validBlocks.value.includes(block);
   if(isHit && playerHitCount.value < totalHits) {
    console.log('is hit. player selection: ', playerSelection.value);
    selectedComputerShipBlocks.value.forEach((shipBlocks) => {
        console.log(hitChecker(playerSelection.value, shipBlocks.blocks));
    })
    playerHitCount.value++;
   }

   if(playerHitCount.value === totalHits) {
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
    const isHit: boolean = computerSelection.value.includes(randomSelection) && validUserBlocks.value.includes(randomSelection);
    if(isHit && computerHitCount.value < totalHits) {
        computerHitCount.value++;
   }

   if(computerHitCount.value === totalHits) {
    battleshipStore.setIsGameOver(true);
   } else {
    battleshipStore.setIsPlayerTurn(true);
   }

};

watch(() => isPlayerTurn.value, (newValue) => {
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