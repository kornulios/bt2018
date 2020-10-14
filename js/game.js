import * as gameData from "./data.js";
import { Utils } from "./utils/Utils.js";
import { TeamAI } from "./model/Team.js";

import { SprintRace } from "./controller/SprintRace";
import { PursuitRace } from "./controller/PursuitRace";
import { RelayRace } from "./controller/RelayRace";
import { IndividualRace } from "./controller/IndividualRace";
import { MassStartRace } from "./controller/MassStartRace";

import * as Constants from "./constants/constants";
import { View, VIEW_PANELS } from "./controller/ViewController";
import { Graphic2D } from "./view/Graphic2D";
import { Championship } from "./controller/championship";

let oldTimeStamp = 0;
const numberResultsShown = 20;
const gameSpeed = 50;
let tickCounter = 0;
let domRedrawCounter = 0;

export class Game {
  constructor() {
    // REDUNDANT CODE
    // this.gameSpeed = 1000 / 60; //50 ticks per second
    // this.gameTimer;
    // this.gameRunning = false;
    // this.playerTeam = "";
    // this.selectedGender = "men";
    this.userTeam = "UKR";

    //ui options
    this.selectedResults = null;
    this.selectedResultsPage = 0;
    this.selectedPlayer = null;

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
    this.view.showPanel(VIEW_PANELS.PANEL_RACE);
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

    if (++tickCounter === 14) {
      this.showCurrentResults();
      this.showPlayerControls();
      tickCounter = 0;
    }

    if (++domRedrawCounter === 70) {
      this.view.updateResultsControls(this.race.getWaypointResults(this.selectedResults).length);
      domRedrawCounter = 0;
    }

    //REQUEST NEXT FRAME
    this.stopTimer = requestAnimationFrame(this.runGame.bind(this));

    //FINISH THE RACE
    if (this.race.raceFinished) {
      cancelAnimationFrame(this.stopTimer);
      this.canvas.finalFPSDrops(); // total FPS drops counter
      this.endRace();
    }
  }

  showCurrentResults() {
    const resOffset = this.selectedResultsPage * numberResultsShown;
    const resLength = resOffset + numberResultsShown;

    if (this.selectedResults === 0) {
      const startList = this.race.players.slice(resOffset, resLength).map((player, index) => {
        return {
          place: index + 1 + resOffset,
          playerName: player.name,
          playerNumber: player.number,
          team: player.team,
          timeString: Utils.convertToMinutes(player.startTimer / 1000),
        };
      });

      this.canvas.drawIntermediateResults(startList, resOffset);
      return;
    }

    const results = this.race
      .getWaypointResults(this.selectedResults)
      .slice(resOffset, resLength)
      .map((result, i) => {
        return { ...result, place: i + 1 + resOffset };
      });
    this.canvas.drawIntermediateResults(results, resOffset);
  }

  showPlayerControls() {
    const userPlayers = this.race.players
      .filter((player) => player.team === this.userTeam)
      .map((player) => {
        const prevWaypoint = this.race.getPrevWaypointId(player.distance);
        const prevWaypointData = this.race.getLastWaypointResult(player.name, prevWaypoint);

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

  simulateRace() {
    if (this.stopTimer) cancelAnimationFrame(this.stopTimer);

    do {
      this.race.run(100);
    } while (!this.race.raceFinished);

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
        team: player.team,
        number: player.number,
        colors: player.colors,
        range: player.currentRange,
        rangeTimer: player.shootingTimer > 0,
        status: player.status,
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
    const shootingPlayers = players
      .filter((player) => player.status === Constants.PLAYER_STATUS.SHOOTING || player.shootingTimer > 0)
      .map((player) => {
        return {
          name: player.name,
          range: player.currentRange,
          team: player.team,
          delayed: player.shootingTimer > 0,
        };
      });

    return shootingPlayers;
  }

  async onSimulateRaceClick() {
    if (this.championship.state === Constants.RACE_STATUS.FINISHED) {
      alert("Season over! Please start a new one");
      return;
    }
    if (!this.race || this.race.status !== Constants.RACE_STATUS.IN_PROGRESS) {
      await this.prepareNextRace();
    }
    this.simulateRace();
  }

  async onStartRaceClick() {
    if (this.championship.state === Constants.RACE_STATUS.FINISHED) {
      alert("Season over! Please start a new one");
      return;
    }
    await this.prepareNextRace();
    this.startNextRace();
  }

  async prepareNextRace() {
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
    await this.race.initRaceData(nextRace);
    this.race.initPlayers(playerRoster);
  }

  startNextRace() {
    // start predefined race
    const { race } = this;
    // READY!
    oldTimeStamp = performance.now();
    this.selectedResults = 0;
    // SET!
    this.view.setupRaceView(this.race);
    this.canvas.initRaceCanvas();
    this.showPlayerControls();
    this.showCurrentResults();
    // GO!!!
    this.race.status = Constants.RACE_STATUS.IN_PROGRESS;
    requestAnimationFrame(this.runGame.bind(this));
  }

  endRace() {
    console.log("race finished");
    this.view.renderShortResults(this.race.getFinishResult());
    this.championship.onRaceFinish(this.race);
    this.race = null;
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

  // HELPER FUNCTIONS
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

  // UI DOM EVENTS
  onResultSelect(event) {
    const waypointId = event.target.name;
    this.selectedResults = +waypointId;
    this.selectedResultsPage = 0;

    this.showCurrentResults();
  }

  onResultPageSelect(event) {
    if (event.target.name === "next") {
      this.selectedResultsPage++;
    } else if (event.target.name === "prev") {
      this.selectedResultsPage--;
    } else {
      this.selectedResultsPage = event.target.name;
    }

    if (this.selectedResultsPage < 0) {
      this.selectedResultsPage = 0;
    }
    this.showCurrentResults();
  }

  // CUSTOM SCRIPT
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
