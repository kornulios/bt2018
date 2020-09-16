// import { racesData } from '../data.js';

import { RACE_STATUS, RACE_POINTS_MAP, GENDER } from "../constants/constants.js";

export class Championship {
  constructor() {
    // this.stages = { ...gameData.stageData };
    this.results = [];
    this.raceCalendar = [];

    this.standingsMen = {};
    this.standingsWomen = {};
    this.nationPoints = {}; //postponed for future releases
  }

  getPlayersStandings(gender) {
    const points = gender === GENDER.MALE ? this.standingsMen : this.standingsWomen;

    const standings = Object.keys(points)
      .map((player) => {
        return { name: player, points: points[player] };
      })
      .sort((p1, p2) => {
        return p1.points > p2.points ? -1 : 1;
      });

    return standings;
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
    const standings = race.raceGender === GENDER.MALE ? this.standingsMen : this.standingsWomen;

    finishedRace.status = RACE_STATUS.FINISHED;
    finishedRace.results = race.results;

    for (let i = 0; i < results.length; i++) {
      const playerName = results[i].playerName;

      if (!standings[playerName]) standings[playerName] = 0;
      standings[playerName] += RACE_POINTS_MAP[i];

      //debugger ----------------
      // if (isNaN(this.playerPoints[playerName])) {
      //   debugger;
      // }
      //------------------
    }
    console.log(this.getPlayersStandings(race.raceGender));
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
