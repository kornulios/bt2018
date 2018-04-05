class Results {
  constructor(race) {
    this.data = [];
    this.shootingData = [];
    this.waypointsNum = race.track.waypointsNum();
    this.relative = false; 
  }

  pushResult(name, wp, t) {
    var resObj = {
      playerName: name,
      waypoint: wp,
      time: +t,
    };
    this.data.push(resObj);
  }

  pushShootingResult(p, result, shootNum) {
    this.shootingData.push({name: p.name, range: p.rangeNum, result: result, shootNum: shootNum});
  }

  getShootingResult(name, range) {
    let res = [];
    for (let i = 0; i<this.shootingData.length; i++) {
      if (this.shootingData[i].name == name && this.shootingData[i].range == range) {
        (this.shootingData[i].result) ? res.push('+') : res.push('-');
      }
    }
    return res;
  }

  getMisses(name) {
    // get misses count
    let res = this.shootingData.filter((val, i) => {
      if (val.name == name && !val.result) return true;
    });
    return res.length;
  }

  getWaypointResults(wp) {
    let mapped = this.data.filter(function(res, i) {
      if (res.waypoint == wp) return true;
    });
    mapped = mapped.map((res, i, arr) => {
      if (res.waypoint == wp) {
        // res.rTime = (i !== 0) ? '+' + (res.time - arr[0].time).toFixed(1) : res.time.toFixed(1);
        if (this.relative) {
          
        } else {
          res.rTime = res.time.toFixed(1);
        }
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
}