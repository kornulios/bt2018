import { Player } from './model/player.js';
import * as gameData from './data.js';
import { Utils } from './utils/Utils.js';
import { Track } from './model/track.js';
import { Result } from './model/result.js';

import { SprintRace } from './controller/SprintRace.js';
import { RelayRace } from './controller/RelayRace.js';

import * as Constants from './constants/constants.js';
import { View } from './controller/ViewController.js';
import { Graphic2D } from './view/Graphic2D.js';
import { Vector } from './view/Vector.js';

let oldTimeStamp = 0;

export class Game {

  constructor() {
    this.gameSpeed = 1000 / 60;      //50 ticks per second
    this.gameTimer;
    this.gameRunning = false;

    // this.view = new View();
    // this.championship = Object.create(null);

    // this.raceMap = gameData.stageData;

    // this.teams = this.loadTeams();
    // this.players = this.loadPlayers();

    this.selectedResults = 0;
    this.selectedGender = 'men';
    this.playerTeam = "";


    this.race = new SprintRace();
    this.view = new View();

    this.canvas = new Graphic2D();

    this.stopTimer = null;
  }

  createPlayers(number) {
    var res = [];
    for (var i = 1; i <= number; i++) {
      res.push(new Player({ name: "Player " + i, number: i, speed: 19 + (i / 10) }))
    }
    return res;
  }

  runGame(timeStamp) {       //refactored with rAF X2
    const gameSpeed = 50;

    const gameTick = timeStamp - oldTimeStamp;

    //update timer
    oldTimeStamp = timeStamp;

    // UPDATE
    this.race.run(gameTick * gameSpeed);

    //RENDER
    this.canvas.drawMapBeta(this.race.track.coordsMap);
    this.canvas.drawPlayersBeta(this.getPlayerCoords(this.race.players));
    // this.view.renderProgress(this.race);



    this.stopTimer = window.requestAnimationFrame(this.runGame.bind(this));

    if (this.race.raceFinished) {
      window.cancelAnimationFrame(this.stopTimer);
      console.log('race finished', timeStamp);
      this.view.renderShortResults(this.race.results, this.race.track);
    }
  }

  getPlayerCoords(players) {

    const res = players.map(player => {
      if (player.status !== Constants.PLAYER_STATUS.NOT_STARTED) {

        return {
          name: player.name,
          number: player.number,
          coords: this.race.track.getCoordinates(player.distance),
        }
      } else {
        return false;
      }
    });

    return res;
  }

  simulatePlayer() {
    const { race } = this;

    oldTimeStamp = performance.now();
    this.canvas.drawMapBeta(race.track.coordsMap);
    // this.canvas.drawPlayersBeta([{ name: 'A', coords: this.race.track.getCoordinates(2500) }]);
    window.requestAnimationFrame(this.runGame.bind(this));


    // this.view.renderProgress(this.race);


    // const canvas = new Graphic2D();
    // canvas.drawMapBeta();

    // const tNow = Date.now();

    // const race = new SprintRace();
    // const view = new View();

    // race.run();

    // view.renderShortResults(race.results, race.track);
    // view.renderShortRelayResults(race.results, race.track);

    // let r = 0;
    // for (var i = 0; i < 109; i++) {
    //   for (var j = 0; j < 10; j ++) {
    //     r++;
    //   }
    // }
    // const tDiff = Date.now() - tNow;
    // console.log((tDiff / 1000) + 's');

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

  runGameOld(tFrame) {       //refactored with rAF
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