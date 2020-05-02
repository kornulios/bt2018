import { Player } from './model/player.js';
import * as gameData from './data.js';
import { Utils } from './utils/Utils.js';
import { Track } from './model/track.js';
import { Result } from './model/result.js';

import { SprintRace } from './controller/SprintRace.js';
import { RelayRace } from './controller/RelayRace.js';

import * as Constants from './constants/constants.js';
import { View } from './controller/ViewController.js';

export class Game {
  constructor() {
    this.gameSpeed = 1000 / 60;      //50 ticks per second
    this.gameTimer;
    this.gameRunning = false;

    // this.view = new View();
    this.championship = Object.create(null);

    this.raceMap = gameData.stageData;

    // this.teams = this.loadTeams();
    // this.players = this.loadPlayers();

    this.selectedResults = 0;
    this.selectedGender = 'men';
    this.playerTeam = "";


  }

  createPlayers(number) {
    var res = [];
    for (var i = 1; i <= number; i++) {
      res.push(new Player({ name: "Player " + i, number: i, speed: 19 + (i / 10) }))
    }
    return res;
  }

  // logPlayerResult(resultStore, player, passedWaypoint, time) {
  //   const payload = {
  //     playerName: player.name,
  //     playerNumber: player.number,
  //     team: player.team,
  //     waypoint: passedWaypoint,
  //     time: time,
  //   };

  //   resultStore.pushResult(payload);
  // }

  // logShootingResult(resultStore, player, range, result) {
  //   const payload = {
  //     playerName: player.name,
  //     playerNumber: player.number,
  //     team: player.team,
  //     range: range,
  //     result: result,
  //   };

  //   resultStore.pushShootingResult(payload);
  // }

  simulatePlayer() {
    const tNow = Date.now();

    const race = new SprintRace();
    const view = new View();

    race.run();

    view.renderShortResults(race.results, race.track);
    // view.renderShortRelayResults(race.results, race.track);

    // let r = 0;
    // for (var i = 0; i < 109; i++) {
    //   for (var j = 0; j < 10; j ++) {
    //     r++;
    //   }
    // }

    const tDiff = Date.now() - tNow;
    console.log((tDiff / 1000) + 's');

  }






  // ********************************************************************

  // OBSOLETE GOWNO for refactoring

  // loadPlayers() {
  //   //AJAX will go there 
  //   // getData();
  //   var teams = this.teams,
  //     teamMemberCount = 8,
  //     counter = 1,
  //     players = [];

  //   for (var i = 0; i < teams.length; i++) {
  //     for (var k = 0; k < teamMemberCount; k++) {
  //       players.push(Player.create('Player ' + counter, teams[i], k < teamMemberCount / 2 ? 'men' : 'women'));
  //       counter++;
  //     }
  //   }
  //   return players;
  // }

  // loadTeams() {
  //   //mock for teams
  //   const teamCount = 26;
  //   const teams = [];
  //   for (let i = 1; i <= teamCount; i++) {
  //     teams.push(Team.create('Team ' + i, 'T' + i, '', [], 'Team ' + i + mockData.teamDesc));
  //   }
  //   return teams;
  // }

  // mainScreen() {
  //   let me = this;
  //   me.view.renderChampionshipView(me.championship);
  // }

  // setResultView(viewNum) {
  //   let me = this;
  //   me.selectedResults = viewNum;
  //   me.view.renderResults(me.race.results.getWaypointResults(me.selectedResults), me.selectedResults);
  // }

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
    race.setRaceStatus('Started');
    this.runGame();
  }

  finishRace() {
    var race = this.getCurrentRace(),
      championship = this.championship,
      nextRace;

    race.setRaceStatus('Finished');
    nextRace = championship.prepareNextRace();
    if (!nextRace) {
      championship.prepareNextStage();
      changeTab('championship');
      return;
    }
    changeTab('results');				// TEMP
  }

  runGame(tFrame) {       //refactored with rAF
    var me = this,
      gameSpeed = 100,
      frameCount = tFrame - tNow,
      gameTick = isNaN(frameCount) ? 0 : frameCount,
      raceRunning = true;

    //update timer
    tNow = tFrame;

    // UPDATE
    raceRunning = me.championship.runRace(gameTick * gameSpeed);

    //RENDER
    me.render();

    me.stopTimer = window.requestAnimationFrame(me.runGame.bind(me));

    if (!raceRunning) {
      window.cancelAnimationFrame(me.stopTimer);
      this.finishRace();
    }
  }

  calculateRace() {
    //used to skip race 
    var me = this,
      race = me.getCurrentRace(),
      raceRunning = true;

    console.time();

    race.setRaceStatus('Started');
    do
      raceRunning = me.championship.runRace(gameFps * 100);
    while (raceRunning)

    me.finishRace();

    // me.render();
    console.timeEnd();
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
    this.selectedGender = e.target.getAttribute('data');
    refreshTab('championship');
  }
}