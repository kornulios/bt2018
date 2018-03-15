class Results {
  constructor(track) {
    this.data = [];
    this.waypointsNum = track.getWaypointsNum();
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

  getPlayerResults(name) {
    return this.data.filter(function(res, i){
      if(res.playerName == name) return true;
    });
  }

  playerNames() {
    var res = [];
    this.data.forEach(function(val, i) {
      if (res.indexOf(val.playerName) == -1) {
        res.push(val.playerName);
      }
    });
    return res;
  }

  maxWaypointNum() {
    return this.waypointsNum;
  }
}