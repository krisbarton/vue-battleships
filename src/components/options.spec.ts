import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import Options from './Options.vue';
import { setActivePinia, createPinia } from 'pinia'
import { useBattleshipsStore } from '../store';

let wrapper: any, store: any;
beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(Options);
    store = useBattleshipsStore();
});

describe('Battleship Options Component', () => {

    it('should display all three ships on mount', () => {
        expect(wrapper.find('#destroyer').exists()).toBe(true);
        expect(wrapper.find('#destroyerTwo').exists()).toBe(true);
        expect(wrapper.find('#battleship').exists()).toBe(true);
    });

    it('should hide destroyer if removed', async () => {
        await store.setRemoveShip('destroyer');
        expect(wrapper.find('#destroyer').classes('hidden')).toBe(true);
    });

    it('should hide destroyerTwo if removed', async () => {
        await store.setRemoveShip('destroyerTwo');
        expect(wrapper.find('#destroyerTwo').classes('hidden')).toBe(true);
    });

    it('should hide battleship if removed', async () => {
        await store.setRemoveShip('battleship');
        expect(wrapper.find('#battleship').classes('hidden')).toBe(true);
    });

    it('should hide options if all ships removed', async () => {
        await store.setRemoveShip('destroyerTwo');
        await store.setRemoveShip('destroyer');
        await store.setRemoveShip('battleship');
        expect(wrapper.find('.options').exists()).toBe(false);
    });

    it('should set canstart to true if all ships removed', async () => {
        await store.setRemoveShip('destroyerTwo');
        await store.setRemoveShip('destroyer');
        await store.setRemoveShip('battleship');
        expect(store.canStart).toBe(true);
    });

    it('should set dragged ship to destroyer when ship dragged', async () => {
        const destroyer = wrapper.find('#destroyer');
        await destroyer.trigger('dragstart');
        expect(store.draggedShip).toEqual('destroyer');
    });

    it('should set dragged ship to destroyerTwo when ship dragged', async () => {
        const destroyer = wrapper.find('#destroyerTwo');
        await destroyer.trigger('dragstart');
        expect(store.draggedShip).toEqual('destroyerTwo');
    });

    it('should set dragged ship to battleship when ship dragged', async () => {
        const destroyer = wrapper.find('#battleship');
        await destroyer.trigger('dragstart');
        expect(store.draggedShip).toEqual('battleship');
    });

    it('should clear ships to remove if we reset the game', async () => {
        await store.setRemoveShip('destroyerTwo');
        await store.setRemoveShip('destroyer');
        await store.setRemoveShip('battleship');
        expect(wrapper.vm.shipToRemove.length).toEqual(3);
        await store.setResetGame(true);
        expect(wrapper.vm.shipToRemove.length).toEqual(0);
    });

    it('should update ship axis classes based on isHorizontrol', async () => {
        expect(wrapper.find('#destroyer').classes('destroyer--horizontal')).toBe(true);
        expect(wrapper.find('#destroyerTwo').classes('destroyer--horizontal')).toBe(true);
        expect(wrapper.find('#battleship').classes('battleship--horizontal')).toBe(true);
        expect(wrapper.find('#destroyer').classes('destroyer--vertical')).toBe(false);
        expect(wrapper.find('#destroyerTwo').classes('destroyer--vertical')).toBe(false);
        expect(wrapper.find('#battleship').classes('battleship--vertical')).toBe(false);
        await store.flip();
        expect(wrapper.find('#destroyer').classes('destroyer--horizontal')).toBe(false);
        expect(wrapper.find('#destroyerTwo').classes('destroyer--horizontal')).toBe(false);
        expect(wrapper.find('#battleship').classes('battleship--horizontal')).toBe(false);
        expect(wrapper.find('#destroyer').classes('destroyer--vertical')).toBe(true);
        expect(wrapper.find('#destroyerTwo').classes('destroyer--vertical')).toBe(true);
        expect(wrapper.find('#battleship').classes('battleship--vertical')).toBe(true);
        await store.flip();
        expect(wrapper.find('#destroyer').classes('destroyer--horizontal')).toBe(true);
        expect(wrapper.find('#destroyerTwo').classes('destroyer--horizontal')).toBe(true);
        expect(wrapper.find('#battleship').classes('battleship--horizontal')).toBe(true);
        expect(wrapper.find('#destroyer').classes('destroyer--vertical')).toBe(false);
        expect(wrapper.find('#destroyerTwo').classes('destroyer--vertical')).toBe(false);
        expect(wrapper.find('#battleship').classes('battleship--vertical')).toBe(false);
    });
    
});
