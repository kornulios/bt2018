class Results {
  constructor(race) {
    this.data = [];
    this.shootingData = [];
    this.waypointsNum = race.track.waypointsNum();
    this.relative = true; 
  }

  pushResult(name, wp, t) {
    var resObj = {
      playerName: name,
      waypoint: wp,
      time: +t,
    };
    this.data.push(resObj);
  }

  pushShootingResult(p, result) {
    // debugger
    this.shootingData.push({name: p.name, range: p.rangeNum, result: result});
  }

  getResults() {
    return this.data;
  }

  getShootingResults(name, range) {

  }

  getWaypointResults(wp) {
    let mapped = this.data.filter(function(res, i) {
      if (res.waypoint == wp) return true;
    });
    mapped = mapped.map((res, i, arr) => {
      if (res.waypoint == wp) {
        res.rTime = (i !== 0) ? '+' + (res.time - arr[0].time).toFixed(1) : res.time.toFixed(1);
        return res;
      }
    });
    return mapped;
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

  // maxWaypointNum() {
  //   return this.waypointsNum;
  // }
}