import { Game } from './game.js';

const game = new Game();

// game.simulatePlayer();

const initEvents = () => {
  document.querySelector('#go').addEventListener('click', game.simulatePlayer);
};

document.addEventListener('DOMContentLoaded', initEvents);