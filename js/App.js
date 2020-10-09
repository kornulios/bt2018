import { Game } from "./game.js";

const game = new Game();

const initEvents = () => {
  document.querySelector("#start-race").addEventListener("click", game.onStartRaceClick.bind(game));

  // document
  //   .querySelector("#race-indi")
  //   .addEventListener("click", game.simulateSprint.bind(game));

  // document
  //   .querySelector("#race-relay")
  //   .addEventListener("click", game.simulateRelay.bind(game));

  // document
  //   .querySelector("#race-mass")
  //   .addEventListener("click", game.simulatePlayer.bind(game));

  document.querySelector("#champ-races").addEventListener("click", game.showChampionshipStandings.bind(game));

  document.querySelector("#pause").addEventListener("click", game.pauseGame.bind(game));

  document.querySelector("#skip-race").addEventListener("click", game.onSimulateRaceClick.bind(game));

  document.querySelector("#results-controls").addEventListener("click", game.onResultSelect.bind(game));
  document.querySelector("#results-paging").addEventListener("click", game.onResultPageSelect.bind(game));
};

document.addEventListener("DOMContentLoaded", initEvents);
//champ-standings
