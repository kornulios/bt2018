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
import { Championship } from "./controller/championship.js";

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
    this.paused = false;

    this.initGameData(); // tmp generator
    this.initChampionship();
  }

  initChampionship() {
    this.championship = new Championship();
    this.championship.createRaceList(gameData.racesData);
  }

  initGameData() {
    this.teams = gameData.teamData.map((team) => {
      return new TeamAI(team);
    });
    this.players = gameData.generateTeams(); //temporary players generator
  }

  runGame(timeStamp) {
    //refactored with rAF X2
    const gameSpeed = 500;

    const gameTick = timeStamp - oldTimeStamp;

    //update timer
    oldTimeStamp = timeStamp;

    // UPDATE
    this.race.run(gameTick * gameSpeed);

    //RENDER
    this.canvas.drawMapBeta(this.race.track);
    this.canvas.drawPlayersBeta(this.getPlayerCoords(this.race.getPlayers()));
    this.canvas.drawGameTick(gameTick); // FPS

    // this.view.renderProgress(this.race);

    //REQUEST NEXT FRAME
    this.stopTimer = requestAnimationFrame(this.runGame.bind(this));

    //FINISH THE RACE
    if (this.race.raceFinished) {
      cancelAnimationFrame(this.stopTimer);
      console.log("race finished", timeStamp);
      this.view.renderShortResults(this.race.getFinishResult());
      this.championship.onRaceFinish(this.race);
    }
  }

  simulateRace() {
    do {
      this.race.run(100);
    } while (!this.race.raceFinished);

    console.log("race finished");
    this.view.renderShortResults(this.race.getFinishResult());
    this.championship.onRaceFinish(this.race);
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

  getPlayerCoords(players) {
    const playersData = players.map((player) => {
      if (player.status === Constants.PLAYER_STATUS.NOT_STARTED || player.status === Constants.PLAYER_STATUS.FINISHED) {
        return false;
      }

      let playerData = {
        name: player.name,
        number: player.number,
        colors: player.colors,
      };

      if (player.status === Constants.PLAYER_STATUS.PENALTY) {
        playerData.coords = this.race.track.getPenaltyCoordinates(player.penalty);
      } else if (player.distance >= this.race.track.getTrackLength() - this.race.track.finishLineLength) {
        playerData.coords = this.race.track.getFinishCoordinates(player.distance);
      } else {
        playerData.coords = this.race.track.getCoordinates(player.distance);
      }

      return playerData;
    });

    return playersData;
  }

  //#region Racing Sims
  simulateSprint() {
    this.prepareNextRace();
    this.startNextRace();
  }

  simulateRelay() {
    this.prepareNextRace();
    this.startNextRace();
  }
  //#endregion

  prepareNextRace() {
    // get next race definition from championship
    const nextRace = this.championship.getNextRace();
    let playerRoster = [];

    switch (nextRace.raceType) {
      case "Individual":
        playerRoster = this.aiSelectRacePlayers(nextRace);
        this.race = new IndividualRace();
        break;
      case "Mass-start":
        playerRoster = this.aiSelectMassStartPlayers(nextRace);
        this.race = new MassStartRace();
        break;
      case "Sprint":
        playerRoster = this.aiSelectRacePlayers(nextRace);
        this.race = new SprintRace();
        break;
      case "Pursuit":
        break;
      default:
        console.log("couldnt find racetype");
    }
    // get players from teamAI as per quotas
    // create new race with players list

    this.race.initRaceData(nextRace);
    this.race.initPlayers(playerRoster);
  }

  startNextRace() {
    // start predefined race
    const { race } = this;
    // READY!
    oldTimeStamp = performance.now();
    // SET!
    this.canvas.drawMapBeta(race.track);
    // GO!!!
    requestAnimationFrame(this.runGame.bind(this));
  }

  showChampionshipRaces() {
    const races = this.championship.getRaceList();
    this.view.renderRaceList(races);
  }

  showPlayersList() {
    this.prepareNextRace();
    this.simulateRace();
  }

  getPlayerTeam(player) {
    return this.teams.find((team) => team.shortName === player.team);
  }

  getTeamColors(teamName) {
    return this.teams.find((team) => team.shortName === teamName).colors;
  }

  getPlayerByName(name) {
    return this.players.find((player) => player.name === name);
  }

  aiSelectRacePlayers(nextRace) {
    return this.teams
      .map((team) => {
        return team.getNextRacePlayers(this.players, nextRace.raceGender);
      })
      .flat();
  }

  aiSelectMassStartPlayers(nextRace) {
    const standings = this.championship.getPlayersStandings(nextRace.raceGender).slice(0, 30);
    const eligiblePlayers = standings.map((result) => {
      return this.getPlayerByName(result.name);
    });

    return eligiblePlayers;
  }

  simulatePlayer() {
    //debugging function
    // this.race = new RelayRace();
    // const { race } = this;
    // oldTimeStamp = performance.now();
    // this.canvas.drawMapBeta(race.track);
    //START RACE
    // window.requestAnimationFrame(this.runGame.bind(this));
    // this.canvas.drawPlayersBeta([{ name: 'A', coords: this.race.track.getCoordinates(100) }]); // -- debugger for player placement
    // this.canvas.drawPlayersBeta([{ name: 'A', coords: this.race.track.getFinishCoordinates(14900) }]); // -- debugger for player placement
    // this.view.renderProgress(this.race);
    //GENERATE TEAMS
    // this.generateTeams();
    // this.view.renderPlayerList(this.players);
    // this.view.renderTeamList(this.teams);
    // console.log(this.players);
  }

  // ********************************************************************

  // OBSOLETE GOWNO for refactoring

  // render() {
  //   this.view.currentScreen.update();
  // }

  // startRace() {
  //   var race = this.getCurrentRace();
  //   race.setRaceStatus("Started");
  //   this.runGame();
  // }

  // finishRace() {
  //   var race = this.getCurrentRace(),
  //     championship = this.championship,
  //     nextRace;

  //   race.setRaceStatus("Finished");
  //   nextRace = championship.prepareNextRace();
  //   if (!nextRace) {
  //     championship.prepareNextStage();
  //     changeTab("championship");
  //     return;
  //   }
  //   changeTab("results"); // TEMP
  // }

  // getPlayerTeam() {
  //   return this.playerTeam.name;
  // }

  // getTeams() {
  //   return this.teams;
  // }

  // getPlayers() {
  //   return this.championship.getPlayers();
  // }

  // getViewGender() {
  //   return this.selectedGender;
  // }

  // getCurrentRace() {
  //   return this.championship.currentRace;
  // }

  // getChampionship() {
  //   return this.championship;
  // }

  // onChangeTeamSelect(e) {
  // var teamName = e.target.textContent;

  // this.startNewChampionship(); //should go to Start button

  // for (var i = 0; i < this.teams.length; i++) {
  //   if (this.teams[i].name == teamName) {
  //     this.playerTeam = this.teams[i];
  //     this.view.selectTeamDetails(this.teams[i]);
  //   }
  // }
  // if (this.playerTeam == '') {
  //   console.log('Selected team not defined');
  // }
  // }

  // onChangeViewGender(e) {
  //   this.selectedGender = e.target.getAttribute("data");
  //   refreshTab("championship");
  // }
}
