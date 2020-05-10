import { Game } from './game.js';

const game = new Game();

// game.simulatePlayer();

const initEvents = () => {
  document.querySelector('#go').addEventListener('click', game.simulatePlayer.bind(game));
};

document.addEventListener('DOMContentLoaded', initEvents);