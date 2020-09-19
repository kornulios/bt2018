//Game controller
import { View } from "./ViewController.js";
import { Track } from "../model/track.js";
import { Result } from "../model/result.js";
import * as Constants from "../constants/constants.js";

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

  getPlayerTeamMembers() {
    var team = game.getPlayerTeam(),
      resArray = [];

    this.players.forEach(function (p) {
      if (p.team.name == team) {
        resArray.push(p);
      }
    });
    return resArray;
  }

  getResults() {
    // const results = { ...this.results }
    // return JSON.parse(JSON.stringify(results));
    return this.results;
  }

  getRaceName() {
    return this.name;
  }

  getRaceStatus() {
    return this.status;
  }

  setRaceStatus(status) {
    if (status) {
      this.status = status;
    }
  }

  getRaceTime() {
    return (this.gameTimer / 1000).toFixed(1);
  }

  getRaceGender() {
    return this.raceGender;
  }

  // skipRace() {
  //   let raceRunning = false;
  //   this.status = "Started";
  //   do {
  //     raceRunning = this.run(100);
  //   } while (raceRunning);
  //   alert("race finished");
  //   this.status = "Finished";
  // }
}
