import { Game } from "./game";
import { GENDER } from "./constants/constants";

export class App {
  constructor() {
    this.game = null;
  }

  initEvents = () => {
    document.querySelector("#start-race").addEventListener("click", this.game.onStartRaceClick.bind(this.game));
    document.querySelector("#custom-script").addEventListener("click", this.game.customScript.bind(this.game));

    document.querySelector("#champ-races").addEventListener("click", this.game.showCalendar.bind(this.game));

    document.querySelector("#menu-team-selector-men").addEventListener("click", (event) => {
      this.game.showTeamPlayersList(GENDER.MEN);
    });
    document.querySelector("#menu-team-selector-women").addEventListener("click", () => {
      this.game.showTeamPlayersList(GENDER.WOMEN);
    });

    document
      .querySelector("#champ-standings")
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
