class Track {
  constructor(args) {
    this.trackLength = 400;                 //overall track distance
    this.shootingRange = [150, 350];        //specify distances for shooting ranges
    this.penaltyLength = 30;                //length of penalty lap (huh!?)
    this.waypoints = [100, 200, 300, 400];  //waypoint distance from start

    console.log('Track init complete');
  }

  getTrackLength() {
    return this.trackLength;
  }

  getWaypoints() {
    return this.waypoints;
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