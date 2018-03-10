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
}