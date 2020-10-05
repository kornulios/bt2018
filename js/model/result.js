// MAJOR REFACTORING UNDERWAY 17.10.2018
// V2. 21.10.2018 Refac part 2 done

import { Utils } from "../utils/Utils.js";

export class Result {
  constructor() {
    this.data = []; // {name$, waypoint%, time!}
    this.shootingData = []; // { name$, number%, result[ARR] }
    this.relative = true;
    this.dataObject = {};
  }

  // pushResult(player, wp, t) {
  //   var resObj = {
  //     playerName: player.name,
  //     number: player.number,
  //     team: player.team,
  //     waypoint: wp,
  //     time: t
  //   };
  //   this.data.push(resObj);
  // }

  // RESULT STRUCTURE
  // playerName, playerNumer, team, waypointId, time (timestamp)

  pushResult(resultData) {
    const result = { ...resultData };

    // this.data.push(result);

    if (!this.dataObject[result.waypoint]) {
      this.dataObject[result.waypoint] = [];
    }

    this.dataObject[result.waypoint].push(result);
    this.dataObject[result.waypoint].sort((r1, r2) => (r1.time > r2.time ? 1 : -1));
  }

  pushRelayResult(wp, number, playerName, teamName, time, leg) {
    var resObj = {
      waypoint: wp,
      playerName: playerName,
      number: number,
      leg: leg,
      team: teamName,
      time: time,
    };
    this.data.push(resObj);
  }

  // pushShootingResult(player, range, result) {
  //   this.shootingData.push({ name: player.name, number: player.number, range: range, result: result });
  // }

  pushShootingResult(resultData) {
    var resObj = { ...resultData };

    this.shootingData.push(resObj);
  }

  pushShootingResultRelay(range, playerName, teamName, result, ammo) {
    this.shootingData.push({
      range: range,
      name: playerName,
      team: teamName,
      result: result.filter((r) => r === 0).length,
      ammo: ammo,
    });
  }

  getShootingResult(name) {
    var res = [];
    for (var i = 0; i < this.shootingData.length; i++) {
      if (this.shootingData[i].playerName === name) {
        res.push(this.shootingData[i].result);
      }
    }
    return res;
  }

  getWaypointResults(waypointId) {
    // const results = this.data.filter((res) => res.waypoint === wp).sort((a, b) => (a.time > b.time ? 1 : -1));
    // for (var i = 0; i < results.length; i++) {
    //   var shooting = this.getShootingResult(results[i].playerName);
    //   results[i].shooting = shooting;
    // }
    const results = this.dataObject[waypointId] || [];

    return results;
  }

  getPlayerResults(name, waypointId) {
    // const result = this.data.filter((res) => res.playerName === name).find((result) => result.waypoint === waypointId);
    const result = this.getWaypointResults(waypointId).find((result) => result.playerName === name);
    return result ? result.time : "";
  }

  getPlayerResultsRelative(name, waypointId) {
    const result = this.getWaypointResults(waypointId);
    const playerResult = result.find((result) => result.playerName === name);
    const timeDiff = playerResult.time - result[0].time;

    if (timeDiff === 0) {
      return playerResult.time;
    }

    return timeDiff;
  }

  getPlayerPlace(name, waypointId) {
    const result = this.getWaypointResults(waypointId).findIndex((result) => result.playerName === name) + 1;
    return result;
  }

  getRelayResults(waypoint) {
    return this.data.filter((item) => item.waypoint === waypoint);
  }
}
