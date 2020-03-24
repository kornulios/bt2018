export class Track {
  constructor() {
    this.length = 7500;
    this.laps = 3;
    this.penaltyLength = 150;
    this.waypointsPerLap = 3;
    this.shootingEntry = this.length / this.laps;
    
    // this.lapLength = data.lapLength[gen];
    // this.trackLength = Math.ceil(data.lapLength[gen] * data.laps);    //overall track distance
    // this.type = data.type;
    // this.laps = data.laps;

    // this.waypoints = this.setupWaypoints();   // TODO waypoints model should be refactored
    // this.shootingRange = this.setupShootinRanges();
  }

  getTrackLength() {
    return this.trackLength;
  }

  getLapLength() {
    return this.lapLength;
  }

  getTrackLengthKm() {
    return (this.trackLength / 1000).toFixed(1);
  }

  setupShootinRanges() {
    var resWp = [];
    for (let i = 1; i < this.laps; i++) {
      if (this.type !== 'Relay') {
        resWp.push(i * this.lapLength);
      } else {
        if ((this.lapLength * i) % (this.lapLength * this.waypointsPerLap ) !== 0) {
          resWp.push(i * this.lapLength);
        }
      }
    }
    return resWp;
  }

  setupWaypoints() {
    var resWp = [];
    var step = this.lapLength / this.waypointsPerLap;
    for (var i = 0; i < this.laps * this.waypointsPerLap; i++) {
      resWp.push(Math.ceil(step * (i + 1)));
    }
    return resWp;
  }

  waypointsNum() {
    return this.waypoints.length;
  }

  getLapNumber(distance) {
    return Math.ceil(distance / this.trackLength);
  }

  isWaypointPassed(newDist, diff) {    //return number of passed waypoint or -1
    let prevDist = newDist - diff;
    for (var i = 0; i < this.waypoints.length; i++) {
      if ((newDist >= this.waypoints[i]) && (prevDist < this.waypoints[i])) {
        return i;
      }
    }
    if (newDist >= this.trackLength) {
      return this.waypoints.length - 1;
    }
    return -1;  //no wp passed
  }

  passShootingRange(newDistance, passedDistance) {
    for (let i = 0; i < this.shootingRange.length; i++) {
      if (newDistance > this.shootingRange[i] && (newDistance - passedDistance) <= this.shootingRange[i]) {
        return i + 1;
      }
    }
    return false;
  }
}