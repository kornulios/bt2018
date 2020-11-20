import * as gameData from "./data";
import { Utils } from "./utils/Utils";
import { TeamAI } from "./model/Team";
import { Roster } from "./controller/Roster";

import { SprintRace } from "./controller/SprintRace";
import { PursuitRace } from "./controller/PursuitRace";
import { RelayRace } from "./controller/RelayRace";
import { IndividualRace } from "./controller/IndividualRace";
import { MassStartRace } from "./controller/MassStartRace";

import * as Constants from "./constants/constants";
import { View, VIEW_PANELS } from "./controller/ViewController";
// import { Graphic2D } from "./view/Graphic2D";
import { Championship } from "./controller/championship";
import { Engine } from "./engine/Engine";

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
    // this.canvas = new Graphic2D();
    this.engine = new Engine();

    //game state
    // this.stopTimer = null;
    // this.paused = false;

    //initializations
    this.initGameData(); // tmp generator
    this.initChampionship();

    this.view.renderPlayerTeam(this.getTeam(this.userTeam));
    this.view.renderMenuNextEvent(this.championship.getNextRace().name);

    this.view.hideAllPanels();
    this.view.showMainPanel();
    this.view.showPanel(VIEW_PANELS.PANEL_TEAM);
    this.showTeamPlayersList("men");

    this.endRace = this.endRace.bind(this);

    this.onPlayerSelectorClick = this.onPlayerSelectorClick.bind(this);
    this.onPlayerSelectorClear = this.onPlayerSelectorClear.bind(this);
    this.onPlayerSelectionDone = this.onPlayerSelectionDone.bind(this);
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

  // runGame(timeStamp) {
  //   // main game loop
  //   //refactored with rAF X2

  //   const gameTick = timeStamp - oldTimeStamp;

  //   //update timer
  //   oldTimeStamp = timeStamp;

  //   // UPDATE
  //   this.race.run(gameTick * gameSpeed);

  //   //CANVAS RENDER
  //   const playersCoords = this.race.getPlayerCoords();
  //   this.canvas.drawMapBeta(this.race.getTrack());
  //   this.canvas.drawPlayersBeta(playersCoords);
  //   this.canvas.drawGameTick(gameTick); // FPS counter

  //   //DOM RENDER
  //   if (++tickCounter === 14) {
  //     this.showCurrentResults();
  //     this.showPlayerControls();
  //     this.showShootingRange();
  //     tickCounter = 0;
  //   }

  //   if (++domRedrawCounter === 70) {
  //     this.view.updateResultsControls(this.race.getWaypointResults(this.selectedResults).length);
  //     domRedrawCounter = 0;
  //   }

  //   //REQUEST NEXT FRAME
  //   this.stopTimer = requestAnimationFrame(this.runGame.bind(this));

  //   //FINISH THE RACE
  //   if (this.race.raceFinished) {
  //     cancelAnimationFrame(this.stopTimer);
  //     this.canvas.finalFPSDrops(); // total FPS drops counter
  //     this.endRace();
  //   }
  // }

  //CANVAS RENDER
  // showCurrentResults() {
  //   const resOffset = this.selectedResultsPage * numberResultsShown;
  //   const resLength = resOffset + numberResultsShown;

  //   if (this.selectedResults === 0) {
  //     const startList = this.race.players.slice(resOffset, resLength).map((player, index) => {
  //       return {
  //         place: index + 1 + resOffset,
  //         playerName: player.name,
  //         playerNumber: player.number,
  //         team: player.team,
  //         timeString: Utils.convertToMinutes(player.startTimer / 1000),
  //         relativeTime: Utils.convertToMinutes(player.startTimer / 1000),
  //       };
  //     });

  //     this.canvas.drawIntermediateResults(startList, resOffset);
  //     return;
  //   }

  //   const results = this.race
  //     .getWaypointResults(this.selectedResults)
  //     .slice(resOffset, resLength)
  //     .map((result, i) => {
  //       return { ...result, place: i + 1 + resOffset };
  //     });
  //   this.canvas.drawIntermediateResults(results, resOffset);
  // }

  // showPlayerControls() {
  //   const userPlayers = this.race.players
  //     .filter((player) => player.team === this.userTeam)
  //     .map((player) => {
  //       const prevWaypoint = this.race.getPrevWaypointId(player.distance);
  //       const prevWaypointData = this.race.getLastWaypointResult(player.id, prevWaypoint);

  //       return {
  //         name: player.name,
  //         team: player.team,
  //         number: player.number,
  //         distance: player.distance,
  //         lastWaypoint: this.race.getLastWaypointName(prevWaypoint),
  //         time: player.status === Constants.PLAYER_STATUS.FINISHED ? "" : this.race.getPlayerTime(player.startTimer),
  //         ...prevWaypointData,
  //       };
  //     });

  //   this.canvas.drawPlayerControls(userPlayers);
  // }

  // showShootingRange() {
  //   const shootingPlayers = this.race.getShootingPlayers();
  //   this.canvas.drawShootingRange(shootingPlayers);
  // }

  // RACE CONTROLS
  // simulateRace() {
  //   if (this.stopTimer) cancelAnimationFrame(this.stopTimer);

  //   do {
  //     this.race.run(100);
  //   } while (!this.race.raceFinished);

  //   this.endRace();
  // }

  // pauseGame() {
  //   const button = document.querySelector("#pause");

  //   if (!this.paused) {
  //     //stop
  //     this.paused = true;
  //     cancelAnimationFrame(this.stopTimer);
  //     button.innerText = "Resume";
  //   } else {
  //     //resume
  //     this.paused = false;
  //     oldTimeStamp = performance.now();
  //     requestAnimationFrame(this.runGame.bind(this));
  //     button.innerText = "Pause";
  //   }
  // }

  onSimulateRaceClick() {
    if (this.championship.state === Constants.RACE_STATUS.FINISHED) {
      alert("Season over! Please start a new one");
      return;
    }

    this.engine.simulateRace(this.race, this.endRace);
  }

  onStartRaceClick() {
    if (this.championship.state === Constants.RACE_STATUS.FINISHED) {
      alert("Season over! Please start a new one");
      return;
    }
    this.startNextRace();
  }

  onPlayerSelectorClick(playerId) {
    const nextRaceGender = this.championship.getNextRace().raceGender;
    const player = this.getPlayerById(playerId);
    const team = this.getUserTeam();
    const nextStartGroup = team.getNextStartGroup(nextRaceGender);

    team.addPlayerToRace(player, nextStartGroup);
    this.showPlayerSelector();
  }

  onPlayerSelectorClear() {
    const team = this.getUserTeam();
    team.clearNextRacePlayers();
    this.showPlayerSelector();
  }

  onPlayerSelectionDone() {
    const team = this.getUserTeam();
    team.isTeamReady = true;
    this.showStartList();
  }

  async prepareNextRace() {
    // get next race definition from championship
    const nextRace = this.getNextRace();
    let playerRoster = [];
    let roster = new Roster(this);

    // get players from teamAI as per quotas
    switch (nextRace.raceType) {
      case "Individual":
        playerRoster = roster.selectRacePlayers();
        this.race = new IndividualRace();
        break;
      case "Mass-start":
        playerRoster = roster.selectMassStartPlayers();
        this.race = new MassStartRace();
        break;
      case "Sprint":
        playerRoster = roster.selectRacePlayers();
        this.race = new SprintRace();
        break;
      case "Pursuit":
        playerRoster = roster.selectPursuitPlayers();
        this.race = new PursuitRace();
        break;
      case "Relay":
        // playerRoster = this.aiSelectRelayPlayers(nextRace);
        // this.race = new RelayRace();
        break;
      default:
        console.log("PrepareNextRace() error: Couldn't find racetype");
    }

    // create new race with players list
    await this.race.initRaceData(nextRace);
    this.race.initPlayers(playerRoster);
    this.race.userTeam = this.userTeam;
  }

  startNextRace() {
    // start predefined race
    const { race } = this;
    // READY!
    this.selectedResults = 0;
    // SET!
    this.view.setupRaceView(this.race);
    // GO!!!
    this.race.status = Constants.RACE_STATUS.IN_PROGRESS;
    this.engine.startRace(race, this.endRace);
  }

  endRace() {
    console.log("race finished");
    const team = this.getUserTeam();
    team.clearNextRacePlayers();

    this.view.showMainPanel();
    this.view.renderShortResults(this.race);
    this.championship.onRaceFinish(this.race);
    this.race = null;

    if (this.championship.state === Constants.RACE_STATUS.FINISHED) {
      this.view.renderMenuNextEvent("Season over");
      this.showChampionshipStandings();
    } else {
      this.view.renderMenuNextEvent(this.getNextRace().name);
    }
  }

  // DOM render
  showChampionshipStandings() {
    const standingsMen = this.championship.getPlayersStandings(Constants.GENDER.MEN, 20).map((result) => {
      const player = this.getPlayerById(result.id);
      return {
        id: player.id,
        name: player.name,
        points: result.points,
        team: player.team,
      };
    });
    const standingsWomen = this.championship.getPlayersStandings(Constants.GENDER.WOMEN, 20).map((result) => {
      const player = this.getPlayerById(result.id);
      return {
        id: player.id,
        name: player.name,
        points: result.points,
        team: player.team,
      };
    });

    this.view.renderChampionshipStandings(standingsMen, standingsWomen);
  }

  showCalendar() {
    const races = this.championship.getRaceList();
    this.view.renderRaceList(races);
  }

  showTeamPlayersList(gender) {
    const teamPlayers = this.players
      .filter((p) => p.team === this.userTeam && p.gender === gender)
      .map((player) => ({ ...player, points: this.championship.getPlayerPoints(player) }));

    this.view.renderTeamPlayersList(teamPlayers, 5);
  }

  async showStartList() {
    const nextRace = this.championship.getNextRace();
    const userTeam = this.getUserTeam();

    if (nextRace.raceType === "Sprint" || nextRace.raceType === "Individual") {
      if (!userTeam.isTeamReady) {
        this.showPlayerSelector();
        return;
      }
    }

    if (!this.race) {
      await this.prepareNextRace();
    }

    this.view.renderStartList(this.race.players, this.race.stageName + " - " + this.race.name);
  }

  showPlayerSelector() {
    const gender = this.championship.getNextRace().raceGender;
    const team = this.getUserTeam();
    const teamPlayers = this.players
      .filter((p) => p.team === this.userTeam && p.gender === gender)
      .map((player) => ({ ...player, points: this.championship.getPlayerPoints(player) }));

    this.view.renderPlayerSelector(
      teamPlayers,
      team,
      this.onPlayerSelectorClick,
      this.onPlayerSelectorClear,
      this.onPlayerSelectionDone
    );
  }

  // HELPER FUNCTIONS
  getPlayerTeam(player) {
    return this.teams.find((team) => team.shortName === player.team);
  }

  getTeam(shortName) {
    return this.teams.find((team) => team.shortName === shortName);
  }

  getUserTeam() {
    return this.teams.find((team) => team.shortName === this.userTeam);
  }

  getPlayerById(id) {
    return this.players.find((player) => player.id === id);
  }

  getNextRace() {
    return this.championship.getNextRace();
  }

  // RACE UI DOM EVENTS
  onResultSelect(event) {
    const waypointId = event.target.name;
    this.engine.setSelectedResultWaypoint(+waypointId);
  }

  onResultPageSelect(event) {
    this.engine.setSelectedResultPage(event.target.name);
  }

  onPauseClick() {
    this.engine.pauseGame();
  }

  // CUSTOM SCRIPT
  customScript() {
    this.onSimulateRaceClick();
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
