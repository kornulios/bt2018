import { Player } from "./model/player.js";
import * as gameData from "./data.js";
import { Utils } from "./utils/Utils.js";
import { Track } from "./model/track.js";
import { Result } from "./model/result.js";
import { TeamAI } from "./model/Team.js";

import { SprintRace } from "./controller/SprintRace.js";
import { RelayRace } from "./controller/RelayRace.js";
import { IndividualRace } from "./controller/IndividualRace.js";
import { MassStartRace } from "./controller/MassStartRace.js";

import * as Constants from "./constants/constants.js";
import { View } from "./controller/ViewController.js";
import { Graphic2D } from "./view/Graphic2D.js";

let oldTimeStamp = 0;

export class Game {
  constructor() {
    this.gameSpeed = 1000 / 60; //50 ticks per second
    this.gameTimer;
    this.gameRunning = false;

    this.selectedResults = 0;
    this.selectedGender = "men";
    this.playerTeam = "";

    this.teams = [];
    this.players = [];
    this.totalPlayerCount = 0; //temp
    this.race = null;
    this.view = new View();

    this.canvas = new Graphic2D();

    this.stopTimer = null;
  }

  runGame(timeStamp) {
    //refactored with rAF X2
    const gameSpeed = 10;

    const gameTick = timeStamp - oldTimeStamp;

    //update timer
    oldTimeStamp = timeStamp;

    // UPDATE
    this.race.run(gameTick * gameSpeed);

    //RENDER
    this.canvas.drawMapBeta(this.race.track);
    this.canvas.drawPlayersBeta(this.getPlayerCoords(this.race.players));
    this.canvas.drawGameTick(gameTick);
    this.view.renderShortResults(this.race.results, this.race.track);
    this.view.renderProgress(this.race);

    //REQUEST NEXT FRAME
    this.stopTimer = window.requestAnimationFrame(this.runGame.bind(this));

    //FINISH THE RACE
    if (this.race.raceFinished) {
      window.cancelAnimationFrame(this.stopTimer);
      console.log("race finished", timeStamp);
      this.view.renderResults(this.race.results, this.race.track);
    }
  }

  getPlayerCoords(players) {
    const res = players.map((player) => {
      if (player.status !== Constants.PLAYER_STATUS.NOT_STARTED) {
        if (player.status === Constants.PLAYER_STATUS.PENALTY) {
          return {
            name: player.name,
            number: player.number,
            coords: this.race.track.getPenaltyCoordinates(player.penalty),
          };
        } else if (
          player.distance >=
          this.race.track.getTrackLength() - this.race.track.finishLineLength
        ) {
          return {
            name: player.name,
            number: player.number,
            coords: this.race.track.getFinishCoordinates(player.distance),
          };
        }

        return {
          name: player.name,
          number: player.number,
          coords: this.race.track.getCoordinates(player.distance),
        };
      } else {
        return false;
      }
    });

    return res;
  }

  simulatePlayer() {
    this.race = new MassStartRace();

    const { race } = this;

    oldTimeStamp = performance.now();
    this.canvas.drawMapBeta(race.track);

    //START RACE
    window.requestAnimationFrame(this.runGame.bind(this));

    // this.canvas.drawPlayersBeta([{ name: 'A', coords: this.race.track.getCoordinates(100) }]); // -- debugger for player placement
    // this.canvas.drawPlayersBeta([{ name: 'A', coords: this.race.track.getFinishCoordinates(14900) }]); // -- debugger for player placement
    this.view.renderProgress(this.race);

    //GENERATE TEAMS
    // this.generateTeams();
    // this.view.renderPlayerList(this.players);

    // this.view.renderTeamList(this.teams);
    // console.log(this.players);
  }

  generateTeams() {
    // generate teams and players
    const { teamData } = gameData;

    for (let i = 0; i < teamData.length; i++) {
      const team = new TeamAI(teamData[i]);

      for (let j = 0; j < team.stageQuota.men + 2; j++) {
        const newPlayer = new Player({
          id: this.totalPlayerCount + 1,
          gender: "male",
          team: team.shortName,
        });
        // team.setPlayer(newPlayer);
        this.players.push(newPlayer);
        this.totalPlayerCount++;
      }

      for (let j = 0; j < team.stageQuota.women + 2; j++) {
        const newPlayer = new Player({
          id: this.totalPlayerCount + 1,
          gender: "female",
          team: team.shortName,
        });
        // team.setPlayer(newPlayer);
        this.players.push(newPlayer);
        this.totalPlayerCount++;
      }

      this.teams.push(team);
    }
  }

  prepareNextRace() {}

  setupRaceList() {
    // setup race players list depending on race type
  }

  // ********************************************************************

  // OBSOLETE GOWNO for refactoring

  startNewChampionship() {
    if (this.players.length > 0) {
      this.championship = new Championship();
      // this.championship.prepareNextRace();
    } else {
      // console.log('No players loaded.');
    }
  }

  render() {
    this.view.currentScreen.update();
  }

  startRace() {
    var race = this.getCurrentRace();
    race.setRaceStatus("Started");
    this.runGame();
  }

  finishRace() {
    var race = this.getCurrentRace(),
      championship = this.championship,
      nextRace;

    race.setRaceStatus("Finished");
    nextRace = championship.prepareNextRace();
    if (!nextRace) {
      championship.prepareNextStage();
      changeTab("championship");
      return;
    }
    changeTab("results"); // TEMP
  }

  getPlayerTeam() {
    return this.playerTeam.name;
  }

  getTeams() {
    return this.teams;
  }

  getPlayers() {
    return this.championship.getPlayers();
  }

  getViewGender() {
    return this.selectedGender;
  }

  getCurrentRace() {
    return this.championship.currentRace;
  }

  getChampionship() {
    return this.championship;
  }

  onChangeTeamSelect(e) {
    // var teamName = e.target.textContent;

    this.startNewChampionship(); //should go to Start button

    // for (var i = 0; i < this.teams.length; i++) {
    //   if (this.teams[i].name == teamName) {
    //     this.playerTeam = this.teams[i];
    //     this.view.selectTeamDetails(this.teams[i]);
    //   }
    // }
    // if (this.playerTeam == '') {
    //   console.log('Selected team not defined');
    // }
  }

  onChangeViewGender(e) {
    this.selectedGender = e.target.getAttribute("data");
    refreshTab("championship");
  }
}
