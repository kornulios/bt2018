class Track {
  constructor(data, gen) {
    this.lapLength = data.stats.lapLength[gen];
    this.trackLength = Math.ceil(data.stats.lapLength[gen] * data.stats.laps);    //overall track distance
    this.penaltyLength = 150;
    this.shootingRange = [];              //specify distances for shooting ranges
    this.waypoints = this.setupWaypoints(this.trackLength, data.stats.waypoints);   // TODO waypoints model should be refactored
    this.laps = data.stats.laps;
    this.startType = data.stats.startType;
    this.penaltyType = data.stats.penaltyType;
    this.raceType = data.stats.type;

    this.setupShootinRanges();
  }

  getTrackLength() {
    return this.trackLength;
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
    // debugger
    let prevDist = newDist - diff;
    for (var i = 0; i < this.waypoints.length; i++) {
      if ((newDist >= this.waypoints[i]) && (prevDist < this.waypoints[i])) {
        // debugger
        return i;
      }
    }
    if (newDist >= this.trackLength) {
      return this.waypoints.length - 1;
    }
    return -1;  //no wp passed
  }

  passShootingRange(newDist, prevDist) {
    for (let i = 0; i < this.shootingRange.length; i++) {
      if (newDist > this.shootingRange[i] && (newDist - prevDist) <= this.shootingRange[i]) {
        return i + 1;
      }
    }
    return false;
  }
}