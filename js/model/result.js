// MAJOR REFACTORING UNDERWAY 17.10.2018
// V2. 21.10.2018 Refac part 2 done

import { Utils } from "../utils/Utils";

export class Result {
  constructor() {
    // this.data = []; // {name$, waypoint%, time!}
    this.shootingData = {}; // { name$, number%, result[ARR] }
    this.dataObject = {};
    // this.relative = true;
    // this.shootingObject = {};
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
  // id, playerName, playerNumber, team, waypoint, time (timestamp)

  pushResult(resultData) {
    const result = { ...resultData };

    // this.data.push(result);

    if (!this.dataObject[result.waypoint]) {
      this.dataObject[result.waypoint] = [];
    }

    result.shootingTotal = this.getShootingTotal(result.id);
    result.timeString = Utils.convertToMinutes(result.time / 1000);

    this.dataObject[result.waypoint].push(result);
    this.dataObject[result.waypoint].sort((r1, r2) => (r1.time >= r2.time ? 1 : -1));
    this.recalculateRelative(result.waypoint);
  }

  recalculateRelative(waypointId) {
    const baseTime = this.dataObject[waypointId][0].time / 1000;
    this.dataObject[waypointId] = this.dataObject[waypointId].map((result) => {
      result.relativeTime = "+" + Utils.convertToMinutes(result.time / 1000 - baseTime);
      return result;
    });
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

  pushShootingResult(resultData) {
    var result = { ...resultData };

    if (!this.shootingData[result.id]) {
      this.shootingData[result.id] = [];
    }

    this.shootingData[result.id].push(result.result);
  }

  getShootingTotal(id) {
    if (!this.shootingData[id]) return 0;

    return this.shootingData[id].reduce((acc, cur) => {
      return acc + cur;
    }, 0);
  }

  // pushShootingResultRelay(range, playerName, teamName, result, ammo) {
  //   this.shootingData.push({
  //     range: range,
  //     name: playerName,
  //     team: teamName,
  //     result: result.filter((r) => r === 0).length,
  //     ammo: ammo,
  //   });
  // }

  // getShootingResult(name) {
  //   var res = [];
  //   for (var i = 0; i < this.shootingData.length; i++) {
  //     if (this.shootingData[i].playerName === name) {
  //       res.push(this.shootingData[i].result);
  //     }
  //   }
  //   return res;
  // }

  getWaypointResults(waypointId) {
    const results = this.dataObject[waypointId] || [];

    return results;
  }

  // getPlayerResults(name, waypointId) {
  //   const result = this.getWaypointResults(waypointId).find((result) => result.playerName === name);
  //   return result ? result.time : "";
  // }

  // getPlayerResultsRelative(name, waypointId) {
  //   const result = this.getWaypointResults(waypointId);
  //   const playerResult = result.find((result) => result.playerName === name);
  //   const timeDiff = playerResult.time - result[0].time;

  //   if (timeDiff === 0) {
  //     return playerResult.time;
  //   }

  //   return timeDiff;
  // }

  // getPlayerPlace(name, waypointId) {
  //   const result = this.getWaypointResults(waypointId).findIndex((result) => result.playerName === name) + 1;
  //   return result;
  // }

  getRelayResults(waypoint) {
    return this.data.filter((item) => item.waypoint === waypoint);
  }
}
