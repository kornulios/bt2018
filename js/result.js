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
      time: t,
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
    let me = this;
    let mapped = me.data.filter(function(res, i) {
      if (res.waypoint == wp) return true;
    });

    mapped.sort(function(a,b){
      if (a.time > b.time) {
        return 1;
      }
      if (a.time < b.time) {
        return -1
      }
      return 0;
    });

    mapped = mapped.map((res, i, arr) => {
      if (res.waypoint == wp) {
        // res.rTime = (i !== 0) ? '+' + (res.time - arr[0].time).toFixed(1) : res.time.toFixed(1);
        if (me.relative) {
          
        } else {
          res.rTime = me.convertToMinutes(res.time);
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

  convertToMinutes(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    let millis = seconds.toFixed(1).split('.')[1];
    seconds = (seconds < 10) ? "0" + seconds.toFixed(0) : seconds.toFixed(0);
    return minutes + ':' + seconds + '.' + millis;
  }
}