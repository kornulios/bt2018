class Results {
  constructor() {
    this.data = [];
  }

  getNextRID() {
    return this.data.length;
  }

  pushResult(name, wp, t) {
    var resObj = {
      playerName: name,
      waypoint: wp,
      time: +t
    };
    this.data.push(resObj);
  }

  getResults() {
    return this.data;
  }

  getWaypointResults(wp) {
    return this.data.filter(function(res, i) {
      if (res.waypoint == wp) return true;
    });
  }

  getMaxWaypoint() {
    var max = 0;
    this.data.forEach(function(val) {       //try to use reduce here...
      if (val.waypoint > max) max = val.waypoint;
    });
    return max+1;
  }
}