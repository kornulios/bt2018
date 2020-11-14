import { Utils } from "../utils/Utils";
import * as Constants from "../constants/constants";
import { Graphic2D } from "../view/Graphic2D";
import { View } from "../controller/ViewController";

let oldTimeStamp = 0;
const numberResultsShown = 20;
const gameSpeed = 50;
let tickCounter = 0;
let domRedrawCounter = 0;

export class Engine {
  constructor() {
    this.canvas = new Graphic2D();
    this.view = new View();

    //game state
    this.stopTimer = null;
    this.paused = false;

    //race
    this.race = null;
    this.selectedResultsWaypoint = 0;
    this.selectedResultsPage = 0;
  }

  setSelectedResultWaypoint = (newWaypointId) => {
    this.selectedResultsWaypoint = newWaypointId;
    this.showCurrentResults();
  };

  setSelectedResultPage = (pageId) => {
    if (pageId === "next") {
      this.selectedResultsPage++;
    } else if (pageId === "prev") {
      this.selectedResultsPage--;
    } else {
      this.selectedResultsPage = pageId;
    }

    if (this.selectedResultsPage < 0) {
      this.selectedResultsPage = 0;
    }

    this.showCurrentResults();
  };

  runGame(timeStamp) {
    // main game loop
    //refactored with rAF X2

    const gameTick = timeStamp - oldTimeStamp;

    //update timer
    oldTimeStamp = timeStamp;

    // UPDATE
    this.race.run(gameTick * gameSpeed);

    // CANVAS RENDER
    const playersCoords = this.race.getPlayerCoords();
    this.canvas.drawMapBeta(this.race.getTrack());
    this.canvas.drawPlayersBeta(playersCoords);
    this.canvas.drawGameTick(gameTick); // FPS counter

    // DOM RENDER
    if (++tickCounter === 14) {
      this.showCurrentResults();
      this.showPlayerControls();
      this.showShootingRange();
      tickCounter = 0;
    }

    // if (++domRedrawCounter === 70) {
    //   domRedrawCounter = 0;
    // }

    //REQUEST NEXT FRAME
    this.stopTimer = requestAnimationFrame(this.runGame.bind(this));

    //FINISH THE RACE
    if (this.race.raceFinished) {
      cancelAnimationFrame(this.stopTimer);
      this.canvas.finalFPSDrops(); // total FPS drops counter
      this.endRace();
    }
  }

  //CANVAS RENDER
  showCurrentResults() {
    const resOffset = this.selectedResultsPage * numberResultsShown;
    const resLength = resOffset + numberResultsShown;

    if (this.selectedResultsWaypoint === 0) {
      const startList = this.race.players.slice(resOffset, resLength).map((player, index) => {
        return {
          place: index + 1 + resOffset,
          playerName: player.name,
          playerNumber: player.number,
          team: player.team,
          timeString: Utils.convertToMinutes(player.startTimer / 1000),
          relativeTime: Utils.convertToMinutes(player.startTimer / 1000),
        };
      });

      this.canvas.drawIntermediateResults(startList, resOffset);
      this.view.updateResultsControls(this.race.players.length);
      return;
    }

    const waypointResults = this.race.getWaypointResults(this.selectedResultsWaypoint);

    const filteredResults = waypointResults.slice(resOffset, resLength).map((result, i) => {
      return { ...result, place: i + 1 + resOffset };
    });

    this.canvas.drawIntermediateResults(filteredResults, resOffset);
    this.view.updateResultsControls(waypointResults.length);
  }

  showPlayerControls() {
    const userPlayers = this.race.players
      .filter((player) => player.team === this.race.userTeam)
      .map((player) => {
        const prevWaypoint = this.race.getPrevWaypointId(player.distance);
        const prevWaypointData = this.race.getLastWaypointResult(player.id, prevWaypoint);

        return {
          name: player.name,
          team: player.team,
          number: player.number,
          distance: player.distance,
          lastWaypoint: this.race.getLastWaypointName(prevWaypoint),
          time: player.status === Constants.PLAYER_STATUS.FINISHED ? "" : this.race.getPlayerTime(player.startTimer),
          ...prevWaypointData,
        };
      });

    this.canvas.drawPlayerControls(userPlayers);
  }

  showShootingRange() {
    const shootingPlayers = this.race.getShootingPlayers();
    this.canvas.drawShootingRange(shootingPlayers);
  }

  // RACE CONTROLS
  startRace(race, onRaceEnd) {
    this.race = race;
    this.endRace = onRaceEnd;
    oldTimeStamp = performance.now();

    this.canvas.initRaceCanvas();
    this.showPlayerControls();
    this.showCurrentResults();

    requestAnimationFrame(this.runGame.bind(this));
  }

  simulateRace(race, onRaceEnd) {
    if (this.stopTimer) cancelAnimationFrame(this.stopTimer);

    do {
      race.run(100);
    } while (!race.raceFinished);

    onRaceEnd();
  }

  pauseGame() {
    const button = document.querySelector("#pause");

    if (!this.paused) {
      //stop
      this.paused = true;
      cancelAnimationFrame(this.stopTimer);
      button.innerText = "Resume";
    } else {
      //resume
      this.paused = false;
      oldTimeStamp = performance.now();
      requestAnimationFrame(this.runGame.bind(this));
      button.innerText = "Pause";
    }
  }
}
