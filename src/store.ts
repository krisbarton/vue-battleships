import { defineStore } from "pinia";

const initialState = {
    startGame: false,
    canStart: false,
    
}

export const useBattleshipsStore = defineStore('battleships', {
    state: () => (initialState),
    getters: {

    },
    actions: {

    }
});