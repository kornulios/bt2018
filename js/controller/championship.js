// import { racesData } from '../data.js';

import { RACE_STATUS, RACE_POINTS_MAP } from "../constants/constants.js";

export class Championship {
  constructor() {
    // this.stages = { ...gameData.stageData };
    this.results = [];
    this.raceCalendar = [];

    this.playerPoints = {};
    this.nationPoints = {};
  }

  createRaceList(racesData) {
    let raceId = 1;
    let res = [];

    for (let stage of racesData) {
      for (let race of stage.raceMap) {
        res.push({
          id: raceId,
          stageName: stage.name,
          name: race.name,
          raceType: race.type,
          raceGender: race.gender,
          results: null,
          status: RACE_STATUS.NOT_STARTED,
        });
        raceId++;
      }
    }

    this.raceCalendar = res;
  }

  onRaceFinish(race) {
    const finishedRace = this.getRaceById(race.id);
    const results = race.getFinishResult().slice(0, 40);

    finishedRace.status = RACE_STATUS.FINISHED;
    finishedRace.results = race.results;

    for (let i = 0; i < results.length; i++) {
      const playerName = results[i].playerName;

      if (!this.playerPoints[playerName]) this.playerPoints[playerName] = 0;
      this.playerPoints[playerName] += RACE_POINTS_MAP[i];

      if (isNaN(this.playerPoints[playerName])) {
        debugger;
      }
    }
    console.log(this.playerPoints);
  }

  getRaceList() {
    return this.raceCalendar;
  }

  getNextRace() {
    for (let race of this.raceCalendar) {
      if (race.status === RACE_STATUS.NOT_STARTED) {
        return race;
      }
    }
  }

  getRaceById(raceId) {
    return this.raceCalendar.find((race) => race.id === raceId);
  }
}
