import { defineStore } from "pinia";

export interface IShip {
    name: string;
    length: number;
    type: string;
}

interface IState {
    startGame: Boolean,
    canStart: Boolean,
    isGameOver: Boolean,
    isPlayerTurn: Boolean,
    shouldResetGame: Boolean,
    isHorizontal: Boolean,
    draggedShip: string,
    removeShip: string,
    ships: Array<IShip>,
} 

const initialState: IState = {
    startGame: false,
    canStart: false,
    isGameOver: false,
    isPlayerTurn: true,
    shouldResetGame: false,
    isHorizontal: true,
    draggedShip: '',
    removeShip: '',
    ships: [
        {
            name: 'battleship',
            length: 5,
            type: 'battleship',
        },
        {
            name: 'destroyer',
            length: 4,
            type: 'destroyer',
        },
        {
            name: 'destroyerTwo',
            length: 4,
            type: 'destroyer',
        },
    ]
}

export const useBattleshipsStore = defineStore('battleships', {
    state: () => (initialState),
    getters: {

    },
    actions: {
        flip() {
            this.isHorizontal = !this.isHorizontal;
        },
        doStartGame(status: Boolean) {
            this.startGame = status;
            if(status) {
                this.isGameOver = false;
                this.shouldResetGame = false;
                this.isPlayerTurn = false;
            }
        },
        setCanStart(status: Boolean) {
            this.canStart = status;
            this.isGameOver = false;
        },
        setIsPlayerTurn(status: Boolean) {
            this.isPlayerTurn = status;
        },
        setIsGameOver(status: Boolean) {
            this.isGameOver = status;
        },
        setResetGame(status: Boolean) {
            this.shouldResetGame = status;
            this.canStart = false;
        },
        setRemoveShip(ship: string) {
            this.removeShip = ship;
        },
        setDraggedShip(ship: string) {
            this.draggedShip = ship;
        },
    }
});