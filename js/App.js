import { Game } from "./game";

export class App {
  constructor() {
    this.game = null;
  }

  initEvents = () => {
    document.querySelector("#start-race").addEventListener("click", this.game.onStartRaceClick.bind(this.game));

    document
      .querySelector("#champ-races")
      .addEventListener("click", this.game.showChampionshipStandings.bind(this.game));

    document.querySelector("#pause").addEventListener("click", this.game.pauseGame.bind(this.game));

    document.querySelector("#skip-race").addEventListener("click", this.game.onSimulateRaceClick.bind(this.game));

    document.querySelector("#results-controls").addEventListener("click", this.game.onResultSelect.bind(this.game));
    document.querySelector("#results-paging").addEventListener("click", this.game.onResultPageSelect.bind(this.game));
  };

  start() {
    this.game = new Game();
    this.initEvents();
  }
}
