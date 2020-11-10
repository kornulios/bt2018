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
    this.shootingRange = [];

    this.id = null;
    this.stageName = null;
    this.name = null;
    this.raceType = null;
    this.raceGender = null;

    this.raceTimer = 0;
    this.raceFinished = false;
  }

  async initRaceData(raceData) {
    this.id = raceData.id;
    this.stageName = raceData.stageName;
    this.name = raceData.name;
    this.raceType = raceData.raceType;
    this.raceGender = raceData.raceGender;

    this.track.waypoints = raceData.waypoints;
    this.track.shootingRange = raceData.ranges;
    this.track.lapLength = raceData.lapLength;

    await this.track.loadMapData();
    this.track.initTrack();
  }

  exitShootingRange(id) {
    const index = this.shootingRange.indexOf(id);
    this.shootingRange.splice(index, 1);
  }

  enterShootingRange(id) {
    this.shootingRange.push(id);
  }

  // RENDER RELATED
  getPlayerCoords() {
    const playersData = this.players.map((player) => {
      if (player.status === Constants.PLAYER_STATUS.NOT_STARTED || player.status === Constants.PLAYER_STATUS.FINISHED) {
        return false;
      }

      let playerData = {
        name: player.name,
        team: player.team,
        number: player.number,
        colors: player.colors,
        status: player.status,
      };

      if (player.status === Constants.PLAYER_STATUS.PENALTY) {
        playerData.coords = this.track.getPenaltyCoordinates(player.penalty);
      } else {
        playerData.coords = this.track.getCoordinates(player.distance);
      }

      return playerData;
    });

    return playersData;
  }

  getShootingPlayers() {
    const shootingPlayers = this.shootingRange.map((playerId) => {
      const player = this.getPlayerById(playerId);
      return {
        name: player.name,
        range: player.currentRange,
        team: player.team,
        rangeTimer: player.shootingTimer > 0,
        misses: player.shotCount - player.currentRange.filter((r) => r === 1).length,
      };
    });

    return shootingPlayers;
  }

  // GETTERS
  getPlayers() {
    return this.players;
  }

  getPlayerById(id) {
    return this.players.find((player) => player.id === id);
  }

  logPlayerResult(resultStore, player, passedWaypoint, time) {
    const payload = {
      id: player.id,
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
      id: player.id,
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

  //RESULTS FETCH
  getResults() {
    return this.results;
  }

  getWaypointResults(waypointId) {
    return this.results.getWaypointResults(waypointId);
  }

  getPrevWaypointId(distance) {
    if (distance >= this.track.getTrackLength()) {
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

  getLastWaypointResult(playerId, waypointId) {
    if (waypointId === 0) {
      return {
        time: "--",
        place: "--",
        shootingTotal: 0,
      };
    }

    const resultData = this.results.getWaypointResults(waypointId);
    const playerIndex = resultData.findIndex((result) => result.id === playerId);
    const playerData = resultData[playerIndex];

    let time;
    if (playerIndex === 0) {
      time = Utils.convertToMinutes(playerData.time / 1000);
    } else {
      time = playerData.relativeTime;
    }

    const result = {
      time,
      place: playerIndex + 1,
      shootingTotal: playerData.shootingTotal,
    };

    return result;
  }

  getRaceName() {
    return this.stageName + " - " + this.name;
  }

  getRaceStatus() {
    return this.status;
  }

  getPlayerTime(startTime) {
    if (startTime > this.raceTimer) {
      return "Starting in " + Utils.convertToMinutes((startTime - this.raceTimer) / 1000);
    }
    return Utils.convertToMinutes((this.raceTimer - startTime) / 1000);
  }
}
