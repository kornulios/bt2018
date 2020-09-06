import { Game } from "./game.js";

const game = new Game();

// game.simulatePlayer();

const initEvents = () => {
  document
    .querySelector("#race-sprint")
    .addEventListener("click", game.simulateSprint.bind(game));
  document
    .querySelector("#race-indi")
    .addEventListener("click", game.simulateSprint.bind(game));
  document
    .querySelector("#race-relay")
    .addEventListener("click", game.simulateRelay.bind(game));
  document
    .querySelector("#race-mass")
    .addEventListener("click", game.simulatePlayer.bind(game));
};

document.addEventListener("DOMContentLoaded", initEvents);
