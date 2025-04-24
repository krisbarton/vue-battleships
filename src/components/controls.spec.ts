import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import Controls from './Controls.vue';
import { setActivePinia, createPinia } from 'pinia'
import { useBattleshipsStore } from '../store';

let wrapper: any, store: any;
beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(Controls);
    store =  useBattleshipsStore();
});

describe('Battleship Controls Component', () => {
    
    it('should show flip button on mount', () => {
        expect(wrapper.find('[data-id="flip"]').exists()).toBe(true);
    });

    it('should toggle is horizontal if flip button clicked', async () => {
        const flipButton = wrapper.find('[data-id="flip"]');
        await flipButton.trigger('click');
        expect(store.isHorizontal).toBe(false);
        await flipButton.trigger('click');
        expect(store.isHorizontal).toBe(true);
    });

    it('should not show start game, restart game, or game over buttons on mount', () => {
        expect(wrapper.find('[data-id="start"]').exists()).toBe(false);
        expect(wrapper.find('[data-id="restart"]').exists()).toBe(false);
        expect(wrapper.find('[data-id="game-over"]').exists()).toBe(false);
    });

    it('should show only start game button if ships have been placed', async () => {
        await store.setCanStart(true);
        expect(wrapper.find('[data-id="flip"]').exists()).toBe(false);
        expect(wrapper.find('[data-id="start"]').exists()).toBe(true);
        expect(wrapper.find('[data-id="restart"]').exists()).toBe(false);
        expect(wrapper.find('[data-id="game-over"]').exists()).toBe(false);
    });

    it('should show only restart button if game has been started', async () => {
        const startGameButton = wrapper.find('[data-id="start"]');
        await startGameButton.trigger('click')

        expect(wrapper.find('[data-id="flip"]').exists()).toBe(false);
        expect(wrapper.find('[data-id="start"]').exists()).toBe(false);
        expect(wrapper.find('[data-id="restart"]').exists()).toBe(true);
        expect(wrapper.find('[data-id="game-over"]').exists()).toBe(false);
    });

    it('should toggle start game value when start game button clicked', async () => {
        await store.setCanStart(true);
        expect(store.startGame).toBe(true);
    });

    it('should show only flip button if game has been restarted', async () => {
        const restartButton = wrapper.find('[data-id="restart"]');
        await restartButton.trigger('click');

        expect(wrapper.find('[data-id="flip"]').exists()).toBe(true);
        expect(wrapper.find('[data-id="start"]').exists()).toBe(false);
        expect(wrapper.find('[data-id="restart"]').exists()).toBe(false);
        expect(wrapper.find('[data-id="game-over"]').exists()).toBe(false);
    });

    it('should only show game over button if game is over', async () => {
        await store.setCanStart(true);
        await store.doStartGame(true);
        await store.setIsGameOver(true);

        expect(wrapper.find('[data-id="flip"]').exists()).toBe(false);
        expect(wrapper.find('[data-id="start"]').exists()).toBe(false);
        expect(wrapper.find('[data-id="restart"]').exists()).toBe(false);
        expect(wrapper.find('[data-id="game-over"]').exists()).toBe(true);
    });

    it('should show only flip button if game has been restarted after game over', async () => {
        await store.setIsGameOver(true);

        const gameOverButton = wrapper.find('[data-id="game-over"]');
        await gameOverButton.trigger('click');

        expect(wrapper.find('[data-id="flip"]').exists()).toBe(true);
        expect(wrapper.find('[data-id="start"]').exists()).toBe(false);
        expect(wrapper.find('[data-id="restart"]').exists()).toBe(false);
        expect(wrapper.find('[data-id="game-over"]').exists()).toBe(false);
    });

});