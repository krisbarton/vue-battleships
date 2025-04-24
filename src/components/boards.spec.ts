import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, assert } from 'vitest'
import Boards from './Boards.vue';
import { setActivePinia, createPinia } from 'pinia'
import { useBattleshipsStore } from '../store';

let wrapper: any, store: any;
beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(Boards);
    store = useBattleshipsStore();
});

describe('Battleships Boards Component', () => {
    
    it('should select computer blocks on mount', () => {
        expect(wrapper.vm.validBlocks.length).toBe(13);
    });

    it('should have no player selected blocks on mount', () => {
        expect(wrapper.vm.validPlayerBlocks.length).toBe(0);
    });

    it('should register a valid player block selection', async() => {
        const playerSelection = wrapper.find('#player-5');
        await store.setDraggedShip('destroyer');
        await playerSelection.trigger('drop');
        assert.deepInclude(wrapper.vm.validPlayerBlocks, 5);
    });

    it('should not register a valid selection if trying to place where there is no room', async() => {
        const playerSelection = wrapper.find('#player-9');
        await store.setDraggedShip('destroyer');
        await playerSelection.trigger('drop');
        assert.notDeepInclude(wrapper.vm.validPlayerBlocks, 9);
    });

    it('should not register a valid selection if trying to place where selection is already placed', async() => {
        const playerSelection = wrapper.find('#player-2');
        await store.setDraggedShip('destroyer');
        await playerSelection.trigger('drop');
        const playerSecondSelection = wrapper.find('#player-5');
        await store.setDraggedShip('battleship');
        await playerSecondSelection.trigger('drop');
        assert.notDeepInclude(wrapper.vm.validPlayerBlocks, 6);
    });

    it('should register a selection and a miss on player click', async () => {
        wrapper.vm.validBlocks = [1, 2, 3, 4];
        await store.doStartGame(true);
        await store.setIsPlayerTurn(true);
        const playerClick = wrapper.find('#computer-5');
        await playerClick.trigger('click', 5);
        assert.deepInclude(wrapper.vm.playerSelection, 5);
        expect(wrapper.find('#computer-5').classes('block--selected')).toBe(true);
        expect(wrapper.find('#computer-5').classes('block--selected--hit')).toBe(false);
    });

    it('should register a selection and a hit on player click', async () => {
        wrapper.vm.validBlocks = [1, 2, 3, 4];
        await store.doStartGame(true);
        await store.setIsPlayerTurn(true);
        const playerClick = wrapper.find('#computer-3');
        await playerClick.trigger('click', 3);
        assert.deepInclude(wrapper.vm.playerSelection, 3);
        expect(wrapper.find('#computer-3').classes('block--selected')).toBe(true);
        expect(wrapper.find('#computer-3').classes('block--selected--hit')).toBe(true);
    });

    it('should register a selection and a hit on player click', async () => {
        wrapper.vm.validBlocks = [1, 2, 3, 4];
        wrapper.vm.selectedComputerShipBlocks = [];
        wrapper.vm.selectedComputerShipBlocks.push({
            shipName: 'destroyer',
            blocks: [1, 2, 3, 4]
        });
        await store.doStartGame(true);
        await store.setIsPlayerTurn(true);
        const playerClick1 = wrapper.find('#computer-1');
        await playerClick1.trigger('click', 1);
        await store.setIsPlayerTurn(true);
        const playerClick2 = wrapper.find('#computer-2');
        await playerClick2.trigger('click', 2);
        await store.setIsPlayerTurn(true);
        const playerClick3 = wrapper.find('#computer-3');
        await playerClick3.trigger('click', 3);
        await store.setIsPlayerTurn(true);
        const playerClick4 = wrapper.find('#computer-4');
        await playerClick4.trigger('click', 4);
        assert.deepInclude(wrapper.vm.sunkenComputerShips, 'destroyer');
    });

    it('should reset values if game reset', async () => {
        wrapper.vm.validBlocks = [1, 2, 3, 4];
        wrapper.vm.selectedComputerShipBlocks = [];
        wrapper.vm.selectedComputerShipBlocks.push({
            shipName: 'destroyer',
            blocks: [1, 2, 3, 4]
        });
        wrapper.vm.playerSelection = [1, 2, 3, 4];
        wrapper.vm.computerSelection = [1, 2, 3, 4];
        wrapper.vm.validPlayerBlocks = [1, 2, 3, 4];
        await store.setResetGame(true);
        assert.notDeepInclude(wrapper.vm.validBlocks, [1, 2, 3, 4]);
        assert.notDeepInclude(wrapper.vm.selectedComputerShipBlocks, { shipName: 'destroyer'});
        assert.notDeepInclude(wrapper.vm.validPlayerBlocks, [1, 2, 3, 4]);
        assert.notDeepInclude(wrapper.vm.playerSelection, [1, 2, 3, 4]);
        assert.notDeepInclude(wrapper.vm.computerSelection, [1, 2, 3, 4]);
    });
});