//Game controller
import { View } from "./ViewController.js";
import { Track } from "../model/track.js";
import { Result } from "../model/result.js";
import * as Constants from "../constants/constants.js";
import { Utils } from "../utils/Utils.js";

export class Race {
  constructor() {
    this.track = new Track();
    this.results = new Result();
    this.players = [];

    this.id = null;
    this.stageName = null;
    this.name = null;
    this.raceType = null;
    this.raceGender = null;

    // this.frameRate = 100;
    this.raceTimer = 0;
    this.raceFinished = false;
  }

  initRaceData(raceData) {
    this.id = raceData.id;
    this.stageName = raceData.stageName;
    this.name = raceData.name;
    this.raceType = raceData.raceType;
    this.raceGender = raceData.raceGender;

    this.track.waypoints = raceData.waypoints;
    this.track.shootingRange = raceData.ranges;
    this.track.lapLength = raceData.lapLength;

    this.track.initTrack();
  }

  getPlayers() {
    return this.players;
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
      result: result.filter((r) => r === 0).length,
    };

    resultStore.pushShootingResult(payload);
  }

  get fullName() {
    return this.stageName + " " + this.raceType + " " + this.track.getTrackLengthKm() + "km" + " " + this.raceGender;
  }

  get shortName() {
    return this.raceType + " " + this.track.getTrackLengthKm() + "km" + " " + this.raceGender;
  }

  getFinishResult() {
    return this.results.getWaypointResults(this.track.waypointsNum() - 1);
  }

  getPlayers() {
    return this.players;
  }

  // getPlayerTeamMembers() {
  //   var team = game.getPlayerTeam(),
  //     resArray = [];

  //   this.players.forEach(function (p) {
  //     if (p.team.name == team) {
  //       resArray.push(p);
  //     }
  //   });
  //   return resArray;
  // }

  //RESULTS FETCH
  getResults() {
    // const results = { ...this.results }
    // return JSON.parse(JSON.stringify(results));
    return this.results;
  }

  getWaypointResults(waypointId) {
    return this.results.getWaypointResults(waypointId);
  }

  getPlayerResults(playerName, waypointId) {
    return this.results.getPlayerResults(playerName, waypointId);
  }

  getPrevWaypointId(distance) {
    if(distance >= this.track.getTrackLength()) {
      return this.track.waypoints.length - 1;
    }

    for (let i = 0; i < this.track.waypoints.length; i++) {
      if (this.track.waypoints[i] < distance && this.track.waypoints[i + 1] > distance) {
        return i;
      }
    }

    return 0;
  }

  getWaypointsNames() {
    return this.track.waypoints.map((waypoint, index) => {
      return this.track.getWaypointName(index);
    });
  }

  getNextWaypointName(distance) {
    if (distance === 0) {
      return "";
    }

    if (distance >= this.track.getTrackLength()) {
      return "Finished";
    }

    for (let i = 0; i < this.track.waypoints.length; i++) {
      if (this.track.waypoints[i] < distance && this.track.waypoints[i + 1] > distance) {
        return this.track.getWaypointName(i + 1);
      }
    }
  }

  getLastWaypointName(waypointId) {
    if (waypointId === 0) {
      return "";
    }

    if (waypointId == this.track.getFinishWaypoint()) {
      return "Finished";
    }

    return this.track.getWaypointName(waypointId);
  }

  getLastWaypointResult(playerName, waypointId) {
    if (waypointId === 0) {
      return {
        time: "--",
        place: "--",
        shootingTotal: 0,
      };
    }

    const resultData = this.results.getWaypointResults(waypointId);
    const playerIndex = resultData.findIndex((result) => result.playerName === playerName);
    const playerData = resultData[playerIndex];

    let time;
    if (playerIndex === 0) {
      time = Utils.convertToMinutes(playerData.time / 1000);
    } else {
      time = '+' + Utils.convertToMinutes(playerData.time / 1000 - resultData[0].time / 1000);
    }

    const result = {
      time,
      place: playerIndex + 1,
      shootingTotal: playerData.shootingTotal,
    };

    return result;
  }

  getRaceName() {
    return this.name;
  }

  getRaceStatus() {
    return this.status;
  }

  // getRaceTime() {
  //   return (this.gameTimer / 1000).toFixed(1);
  // }

  getPlayerTime(startTime) {
    if (startTime > this.raceTimer) {
      return "Starting in " + Utils.convertToMinutes((startTime - this.raceTimer) / 1000);
    }
    return Utils.convertToMinutes((this.raceTimer - startTime) / 1000);
  }
}
