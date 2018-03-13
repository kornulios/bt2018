class Track {
  constructor(args) {
    this.trackLength = 100;
    this.waypoints = [25, 50, 75, 100];   //waypoint distance from start
  }

  getTrackLength() {
    return this.trackLength;
  }

  getWaypoints() {
    // window.dispatchEvent(new Event('message'));
    return this.waypoints;
  }

  isWaypointPassed(player) {    //return number of passed waypoint or -1
    for(var i=0; i<this.waypoints.length; i++){
      if(player.distance > this.waypoints[i] && (player.distance - player.dp) <= this.waypoints[i]) {
        console.log('Player ' + player.name + ' passed waypoint ' + i);
        if(player.distance > this.trackLength) {
          return -2;
        }
        return i;
      }
    }
    return -1;  //no wp passed
  }
}