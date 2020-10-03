// import { Player } from "./model/player.js";
import * as gameData from "./data.js";
import { Utils } from "./utils/Utils.js";
import { TeamAI } from "./model/Team.js";

import { SprintRace } from "./controller/SprintRace.js";
import { PursuitRace } from "./controller/PursuitRace.js";
import { RelayRace } from "./controller/RelayRace.js";
import { IndividualRace } from "./controller/IndividualRace.js";
import { MassStartRace } from "./controller/MassStartRace.js";

import * as Constants from "./constants/constants.js";
import { View, VIEW_PANELS } from "./controller/ViewController.js";
import { Graphic2D } from "./view/Graphic2D.js";
import { Championship } from "./controller/championship.js";

let oldTimeStamp = 0;
const numberResultsShown = 20;

export class Game {
  constructor() {
    // REDUNDANT CODE
    // this.gameSpeed = 1000 / 60; //50 ticks per second
    // this.gameTimer;
    // this.gameRunning = false;
    // this.playerTeam = "";
    // this.selectedGender = "men";
    this.userTeam = "GER";

    //ui options
    this.uiOptions = {
      selectedResults: null,
      selectedPlayer: null,
    };

    //game data
    this.teams = [];
    this.players = [];
    this.totalPlayerCount = 0; //temp
    this.race = null;

    //graphics
    this.view = new View();
    this.canvas = new Graphic2D();

    //game state
    this.stopTimer = null;
    this.paused = false;

    //initializations
    this.initGameData(); // tmp generator
    this.initChampionship();

    // this.view.renderRaceList(this.championship.getRaceList());
    this.view.hideAllPanels();
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
    // main game loop
    //refactored with rAF X2
    const gameSpeed = 30;

    const gameTick = timeStamp - oldTimeStamp;

    //update timer
    oldTimeStamp = timeStamp;

    // UPDATE
    this.race.run(gameTick * gameSpeed);

    //CANVAS RENDER
    const racePlayers = this.race.getPlayers();
    this.canvas.drawMapBeta(this.race.track);
    this.canvas.drawPlayersBeta(this.getPlayerCoords(racePlayers));
    this.canvas.drawGameTick(gameTick); // FPS counter
    // DOM RENDER
    this.showCurrentResults();

    //REQUEST NEXT FRAME
    this.stopTimer = requestAnimationFrame(this.runGame.bind(this));

    //FINISH THE RACE
    if (this.race.raceFinished) {
      cancelAnimationFrame(this.stopTimer);
      this.endRace();
    }
  }

  simulateRace() {
    do {
      this.race.run(100);
    } while (!this.race.raceFinished);

    if (this.stopTimer) cancelAnimationFrame(this.stopTimer);
    this.endRace();
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
      } else {
        playerData.coords = this.race.track.getCoordinates(player.distance);
      }

      return playerData;
    });

    return playersData;
  }

  getShootingPlayers(players) {
    const shootingPlayers = players.filter((player) => {
      return player.status === Constants.PLAYER_STATUS.SHOOTING || player.shootingTimer > 0;
    });

    return shootingPlayers;
  }

  onSimulateRaceClick() {
    if (this.championship.state === Constants.RACE_STATUS.FINISHED) {
      alert("Season over! Please start a new one");
      return;
    }
    this.prepareNextRace();
    this.simulateRace();
  }

  onStartRaceClick() {
    if (this.championship.state === Constants.RACE_STATUS.FINISHED) {
      alert("Season over! Please start a new one");
      return;
    }
    this.prepareNextRace();
    this.startNextRace();
  }

  prepareNextRace() {
    // get next race definition from championship
    const nextRace = this.championship.getNextRace();
    let playerRoster = [];

    // get players from teamAI as per quotas
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
        playerRoster = this.aiSelectPursuitPlayers(nextRace);
        this.race = new PursuitRace();
        break;
      case "Relay":
        playerRoster = this.aiSelectRelayPlayers(nextRace);
        this.race = new RelayRace();
        break;
      default:
        console.log("PrepareNextRace() error: Couldn't find racetype");
    }

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
    this.view.setupRaceView(this.race.getWaypointsNames());
    this.canvas.drawMapBeta(race.track);
    // GO!!!
    requestAnimationFrame(this.runGame.bind(this));
  }

  endRace() {
    console.log("race finished");
    this.view.renderShortResults(this.race.getFinishResult());
    this.championship.onRaceFinish(this.race);
    // this.showChampionshipStandings();

    if (this.championship.state === Constants.RACE_STATUS.FINISHED) {
      console.log("Season over");
      this.showChampionshipStandings();
    }
  }

  showChampionshipStandings() {
    const races = this.championship.getRaceList();
    const standingsMen = this.championship.getPlayersStandings(Constants.GENDER.MEN, 20).map((result) => {
      const player = this.getPlayerByName(result.name);
      return {
        id: player.id,
        name: player.name,
        points: result.points,
        team: player.team,
      };
    });
    const standingsWomen = this.championship.getPlayersStandings(Constants.GENDER.WOMEN, 20).map((result) => {
      const player = this.getPlayerByName(result.name);
      return {
        id: player.id,
        name: player.name,
        points: result.points,
        team: player.team,
      };
    });

    // this.view.renderRaceList(this.championship.getRaceList());
    this.view.renderChampionshipStandings(races, standingsMen, standingsWomen);
  }

  showPlayersList() {
    if (this.championship.state === Constants.RACE_STATUS.FINISHED) {
      alert("Season over! Please start a new one");
      return;
    }
    this.prepareNextRace();
    this.simulateRace();
  }

  // DOM render for race tick
  showCurrentResults() {
    const shootingPlayers = this.getShootingPlayers(this.race.players);
    const userPlayers = this.race.players.filter((player) => player.team === this.userTeam);
    const { selectedResults } = this; //waypoint id

    const results = this.race.getWaypointResults(selectedResults);

    this.view.renderResults(results.slice(0, numberResultsShown));
    this.view.renderShootingRange(shootingPlayers);
    this.view.renderPlayerControls([...userPlayers]);
  }

  getPlayerTeam(player) {
    return this.teams.find((team) => team.shortName === player.team);
  }

  getPlayerByName(name) {
    return this.players.find((player) => player.name === name);
  }

  // PREPARING THE ROSTER FOR NEXT RACE
  aiSelectRacePlayers(nextRace) {
    return this.teams
      .map((team) => {
        return team.getNextRacePlayers(this.players, nextRace.raceGender);
      })
      .flat();
  }

  aiSelectRelayPlayers(nextRace) {
    return this.teams.map((team) => {
      return team.getNextRelayPlayers(this.players, nextRace.raceGender);
    });
  }

  aiSelectMassStartPlayers(nextRace) {
    const standings = this.championship.getPlayersStandings(nextRace.raceGender).slice(0, 30);
    const eligiblePlayers = standings.map((result) => {
      return this.getPlayerByName(result.name);
    });

    return eligiblePlayers;
  }

  aiSelectPursuitPlayers(nextRace) {
    const stage = nextRace.stageName;
    const calendar = this.championship.getRaceList();
    const prevSprint = calendar.find((race) => {
      return race.stageName === stage && race.raceType === "Sprint" && race.raceGender === nextRace.raceGender;
    });

    if (!prevSprint.finish) throw "ERROR: Sprint race has no results! Check race calendar";

    const eligiblePlayers = prevSprint.finish.slice(0, 60).map((result) => {
      const player = this.getPlayerByName(result.playerName);
      player.startTimer = result.time;
      return player;
    });

    return eligiblePlayers;
  }

  onResultSelect(event) {
    const waypointId = event.target.name;
    this.selectedResults = +waypointId;

    this.showCurrentResults();
  }

  simulatePlayer() {
    //debugging function
    this.prepareNextRace();
    this.canvas.drawMapBeta(this.race.track);
    this.canvas.drawPlayersBeta([{ name: "A", number: 1, coords: this.race.track.getPenaltyCoordinates(120) }]); // -- debugger for player placement
    this.canvas.drawPlayersBeta([{ name: "B", number: 2, coords: this.race.track.getCoordinates(9749) }]); // -- debugger for player placement
    this.canvas.drawPlayersBeta([{ name: "C", number: 3, coords: this.race.track.getCoordinates(9750) }]); // -- debugger for player placement
    this.canvas.drawPlayersBeta([{ name: "E", number: 4, coords: this.race.track.getCoordinates(9751) }]); // -- debugger for player placement
    this.canvas.drawPlayersBeta([{ name: "F", number: 5, coords: this.race.track.getCoordinates(9790) }]); // -- debugger for player placement
    // const { race } = this;
    // oldTimeStamp = performance.now();
    //START RACE
    // window.requestAnimationFrame(this.runGame.bind(this));
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
