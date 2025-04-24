import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import Info from './Info.vue'
import { setActivePinia, createPinia } from 'pinia'
import { useBattleshipsStore } from '../store';

let wrapper: any, store: any;
beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(Info);
    store = useBattleshipsStore();
});

describe('Battleship Info Component', () => {

    it('should render the brief instructions on mount', () => {
        expect(wrapper.text()).toContain('Place all of your ships on the board and click Start the game to begin');
    }); 

    it('should not render the brief instructions if game started', async () => {
        await store.doStartGame(true);
        expect(wrapper.text()).not.toContain('Place all of your ships on the board and click Start the game to begin');
    })

    it('displays sunken ship messages when available', async () => {
        const messages = wrapper.find('ul');
        expect(messages.exists()).toBe(false);
        
        await store.setSunkenShipMessages('battleship', 'player');
        const updatedMessages = wrapper.find('ul');
        expect(updatedMessages.exists()).toBe(true);
        expect(updatedMessages.text()).toContain('player battleship has been sunk!');
    });

    it('should display a message tellings us it is the computers turn', async () => {
        await store.doStartGame(true);
        expect(wrapper.text()).toContain(`Computer's turn`);
    });

    it('should display a message tellings us it is the players turn', async () => {
        await store.doStartGame(true);
        await store.setIsPlayerTurn(true);
        expect(wrapper.text()).toContain(`Player's turn`);
    });
});