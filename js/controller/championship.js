// import { racesData } from '../data.js';

import { RACE_STATUS, RACE_POINTS_MAP, GENDER } from "../constants/constants.js";

export class Championship {
  constructor() {
    this.state = RACE_STATUS.IN_PROGRESS;
    this.results = [];
    this.raceCalendar = [];

    this.standingsMen = {};
    this.standingsWomen = {};
    this.nationPoints = {}; //postponed for future releases
  }

  getPlayerPoints(player) {
    const pointsMap = player.gender === GENDER.MEN ? this.standingsMen : this.standingsWomen;

    return pointsMap[player.id] || 0;
  }

  getPlayersStandings(gender, resultsNum) {
    const points = gender === GENDER.MEN ? this.standingsMen : this.standingsWomen;

    const standings = Object.keys(points)
      .map((playerId) => {
        return { id: +playerId, points: points[playerId] };
      })
      .sort((p1, p2) => {
        return p1.points > p2.points ? -1 : 1;
      });

    return standings.slice(0, resultsNum);
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
          waypoints: race.waypoints,
          ranges: race.ranges,
          lapLength: race.lapLength,
          results: null,
          finish: null,
          status: RACE_STATUS.NOT_STARTED,
        });
        raceId++;
      }
    }
    res[0].status = RACE_STATUS.RACE_NEXT;

    this.raceCalendar = res;
  }

  onRaceFinish(race) {
    const pointResultsNumber = race.raceType === "Mass-start" ? 30 : 40;
    const finishedRace = this.getRaceById(race.id);
    const results = race.getFinishResult().slice(0, pointResultsNumber);
    const standings = race.raceGender === GENDER.MEN ? this.standingsMen : this.standingsWomen;

    finishedRace.status = RACE_STATUS.FINISHED;
    finishedRace.results = race.results;
    finishedRace.finish = race.getFinishResult();

    //points calculation
    for (let i = 0; i < results.length; i++) {
      const id = results[i].id;

      if (!standings[id]) standings[id] = 0;
      standings[id] += RACE_POINTS_MAP[i];
    }

    this._setNextRace();
  }

  _setNextRace() {
    for (let race of this.raceCalendar) {
      if (race.status === RACE_STATUS.NOT_STARTED) {
        race.status = RACE_STATUS.RACE_NEXT;
        return;
      }
    }
    // if no more races left - finish the season
    this.state = RACE_STATUS.FINISHED;
  }

  getNextRace() {
    for (let race of this.raceCalendar) {
      if (race.status === RACE_STATUS.RACE_NEXT) {
        return race;
      }
    }
  }

  getRaceList() {
    return this.raceCalendar;
  }

  getRaceById(raceId) {
    return this.raceCalendar.find((race) => race.id === raceId);
  }
}
