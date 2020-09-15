// import { racesData } from '../data.js';
import { RACE_STATUS } from "../constants/constants.js";

export class Championship {
  constructor() {
    // this.stages = { ...gameData.stageData };
    this.results = [];
    this.raceCalendar = [];

    this.playerPoints = {};
    this.nationPoints = {};
  }

  createRaceList(racesData) {
    let raceIndex = 1;
    let res = [];

    for (let stage of racesData) {
      for (let race of stage.raceMap) {
        res.push({
          index: raceIndex,
          stageName: stage.name,
          name: race.name,
          raceType: race.type,
          raceGender: race.gender,
          results: null,
          status: RACE_STATUS.NOT_STARTED,
        });
        raceIndex++;
      }
    }

    this.raceCalendar = res;
  }

  get calendar() {
    return this.raceCalendar;
  }

  onRaceFinish(results) {}

  createRaceRoster() {}

  getRaceList() {
    return this.raceCalendar;
  }

  getNextRace() {
    for (let race in this.raceCalendar) {
      if (race.status === RACE_STATUS.NOT_STARTED) {
        return race;
      }
    }
  }
}
