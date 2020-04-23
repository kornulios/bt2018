import { Player } from './model/player.js';
import * as gameData from './data.js';
import { Utils } from './utils/Utils.js';
import { Track } from './model/track.js';
import { Result } from './model/result.js';

import * as Constants from './constants/constants.js';

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

  logPlayerResult(resultStore, player, passedWaypoint, time) {
    const payload = {
      playerName: player.name,
      playerNumber: player.number,
      team: player.team,
      waypoint: passedWaypoint,
      time: time,
    };

    resultStore.pushResult(payload);
  }

  logShootingResult(resultStore, player, range, result) {
    const payload = {
      playerName: player.name,
      playerNumber: player.number,
      team: player.team,
      range: range,
      result: result,
    };

    resultStore.pushShootingResult(payload);
  }

  simulatePlayer() {

    const players = this.createPlayers(5);
    const track = new Track();
    const results = new Result();

    let raceFinished = false;
    let timer = 0;
    const frameRate = 1;

    const { PLAYER_STATUS } = Constants;

    do {

      for (let i = 0; i < players.length; i++) {
        const player = players[i];

        if (player.status === PLAYER_STATUS.NOT_STARTED) player.status = PLAYER_STATUS.RUNNING;

        if (player.status !== PLAYER_STATUS.FINISHED) {

          if (player.status === PLAYER_STATUS.RUNNING) {
            const playerPrevDistance = player.distance;
            player.run(1);

            const passedWaypoint = track.isWaypointPassed(player.distance, playerPrevDistance);
            const passedRange = track.isShootingEntrancePassed(player.distance, playerPrevDistance);

            if (passedWaypoint) {
              this.logPlayerResult(results, player, passedWaypoint, timer);
            }

            if (passedRange) {
              player.status = PLAYER_STATUS.SHOOTING;
              player.enterShootingRange(passedRange);
            }
          }
          else if (player.status === PLAYER_STATUS.SHOOTING) {
            player.shoot(frameRate);

            if (player.shotCount === 5) {
              this.logShootingResult(results, player, player.rangeNum, player.currentRange);
              const penaltyCount = player.currentRange.filter(r => r === 0).length;

              player.penalty = penaltyCount * track.penaltyLapLength;
              player.status = penaltyCount ? PLAYER_STATUS.PENALTY : PLAYER_STATUS.RUNNING;
            }
          }
          else if (player.status === PLAYER_STATUS.PENALTY) {
            player.runPenaltyLap(frameRate);
            player.status = player.penalty > 0 ? PLAYER_STATUS.PENALTY : PLAYER_STATUS.RUNNING;
          }

          if (player.distance >= track.trackLength) player.status = PLAYER_STATUS.FINISHED;

        }

      }

      raceFinished = players.every(player => player.status === PLAYER_STATUS.FINISHED);

      timer += frameRate;

    } while (!raceFinished)

    console.log('race finished', timer);

    this.renderResults(results, track);
  }


  renderResults(results, track) {
    //results fetch
    const playerResults = results.data.reduce((acc, result) => {
      const name = result.playerName;
      if (!acc[name]) {
        acc[name] = [];
      }

      return { ...acc, [name]: [...acc[name], { wpName: track.getWaypointName(result.waypoint), time: Utils.convertToMinutes(result.time / 1000) }] }
    }, {});

    const rangeResults = results.shootingData.reduce((acc, result) => {
      const name = result.playerName;
      if (!acc[name]) {
        acc[name] = [];
      }

      return { ...acc, [name]: [...acc[name], { range: result.range, result: result.result }] }
    }, {});

    //html
    const htmlResults = Object.keys(playerResults).map(name => {
      const resultItems = playerResults[name].map(r => {
        const item = `<span class="waypoint">${r.wpName}</span><span class="time">${r.time}</span>`
        return `<li class="result-list-item">${item}</li>`
      });
      const rangeItems = rangeResults[name].map(r => {
        const item = `<div>Range ${r.range}: ${r.result.filter(q => q === 0).length}</div>`
        return `<div>${item}</div>`
      });

      const list = `<div class="result-block">${name}<ul class="result-list">${resultItems.join('')}</ul>${rangeItems.join('')}</div>`;

      return list;
    }).join('');

    document.querySelector('#run').innerHTML = `<div class="results">${htmlResults}</div>`;
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