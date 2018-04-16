class Track {
  constructor(data, gen) {
    this.trackLength = data.stats.length[gen];    //overall track distance
    this.penaltyLength = 150;                //length of penalty lap (huh!?)
    this.shootingRange = [500, 1000, 1500, 2000];              //specify distances for shooting ranges
    this.waypoints = this.setupWaypoints(data.stats.length, data.stats.waypoints);
    this.laps = data.stats.laps;
    this.startType = data.startType;
 
    console.log('Track init complete');
  }

  getTrackLength() {
    return this.trackLength;
  }

  setupWaypoints(tlen, num) {
    let resArr = [];
    for (let step = tlen / num; step <= tlen; step += tlen / num) {
      resArr.push(step);
    }
    return resArr;
  }

  waypointsNum() {
    return this.waypoints.length;
  }

  getLapNumber(distance) {
    return Math.ceil(distance / this.trackLength);
  }

  isWaypointPassed(newDist, prevDist) {    //return number of passed waypoint or -1
    for(var i=0; i<this.waypoints.length; i++){
      if(newDist > this.waypoints[i] && (newDist - prevDist) <= this.waypoints[i]) {
        return i;
      }
    }
    return -1;  //no wp passed
  }

  passShootingRange(newDist, prevDist) {
    for (let i = 0; i < this.shootingRange.length; i++) {
      if(newDist > this.shootingRange[i] && (newDist - prevDist) <= this.shootingRange[i]) {
        return i+1;
      }
    }
    return false;
  }
}