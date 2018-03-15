class Track {
  constructor(args) {
    this.trackLength = 400;
    this.shootingRange = 250;
    this.penaltyLength = 30;
    this.waypoints = [100, 200, 300, 400];   //waypoint distance from start

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
    if(newDist > this.shootingRange && (newDist - prevDist) <= this.shootingRange) {
      return true;
    }
    return false;
  }
}