class Track {
  constructor(tLength, wNum) {
    this.trackLength = tLength;              //overall track distance
    this.shootingRange = [250];              //specify distances for shooting ranges
    this.penaltyLength = 150;                //length of penalty lap (huh!?)
    this.waypoints = [];

    for (let step = tLength / wNum; step <= tLength; step += tLength / wNum) {
      this.waypoints.push(step);
    }
    console.log('Track init complete');
  }

  getTrackLength() {
    return this.trackLength;
  }

  waypointsNum() {
    return this.waypoints.length;
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
        return true;
      }
    }
    return false;
  }
}