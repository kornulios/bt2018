import { Game } from "./game";
import { GENDER } from "./constants/constants";

export class App {
  constructor() {
    this.game = null;
  }

  initEvents = () => {
    // document.querySelector("#start-race").addEventListener("click", this.game.onStartRaceClick.bind(this.game));
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

    document.querySelector("#next-race").addEventListener("click", () => {
      this.game.showStartList();
    });

    document.querySelector("#results-controls").addEventListener("click", this.game.onResultSelect.bind(this.game));
    document.querySelector("#results-paging").addEventListener("click", this.game.onResultPageSelect.bind(this.game));
    
    // document.querySelector("#player-selection").addEventListener("click", (event) => {
    //   this.game.onPlayerSelectorClick(event.target.name);
    // });

    document.querySelector("#start-list").addEventListener("click", (event) => {
      switch (event.target.name) {
        case "start-race":
          this.game.onStartRaceClick();
          return;

        case "simulate-race":
          this.game.onSimulateRaceClick();
          return;

        default:
          return;
      }
    });
  };

  start() {
    this.game = new Game();
    this.initEvents();
  }
}
