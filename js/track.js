class Track {
  constructor(data, gen) {
    this.lapLength = data.lapLength[gen];
    this.trackLength = Math.ceil(data.lapLength[gen] * data.laps);    //overall track distance
    this.penaltyLength = 150;
    this.shootingRange = [];              //specify distances for shooting ranges
    this.waypoints = this.setupWaypoints(this.trackLength, data.waypoints);   // TODO waypoints model should be refactored
    this.laps = data.laps;

    this.setupShootinRanges();
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
    for (let i = 1; i < this.laps; i++) {
      this.shootingRange.push(i * this.lapLength);
    }
  }

  setupWaypoints(tlen, num) {
    let resArr = [];
    for (let step = tlen / num; step <= tlen; step += tlen / num) {
      resArr.push(Math.ceil(step));
    }
    return resArr;
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