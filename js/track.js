class Track {
  constructor(args) {
    this.trackLength = 400;
    this.shootingRange = 250;
    this.penaltyLength = 30;
    this.waypoints = [100, 200, 300, 400];   //waypoint distance from start
  }

  getTrackLength() {
    return this.trackLength;
  }

  getWaypoints() {
    return this.waypoints;
  }

  getWaypointsNum() {
    return this.waypoints.length;
  }

  isWaypointPassed(player) {    //return number of passed waypoint or -1
    for(var i=0; i<this.waypoints.length; i++){
      if(player.distance > this.waypoints[i] && (player.distance - player.dp) <= this.waypoints[i]) {
        return i;
      }
    }
    return -1;  //no wp passed
  }

  passShootingRange(player) {
    if(player.distance > this.shootingRange && (player.distance - player.dp) <= this.shootingRange) {
      return true;
    }
    return false;
  }
}