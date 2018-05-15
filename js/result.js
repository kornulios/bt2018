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
      time: t
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

  getMissesByRange(name) {
    let rangeResults = [];

    for (let i=1; i<4; i++) {
      let rng = this.getShootingResult(name, i);
      if (rng.length > 0) {
        let res = rng.filter(s => s == '-');
        rangeResults.push(res.length);
      }
    }
    return rangeResults.join('+');
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
        if (me.relative) {
          if (i == 0) {
            res.resultTime = me.convertToMinutes(res.time);
          } else {
            res.resultTime = '+' + me.convertToMinutes(res.time - arr[0].time);
          }
        } else {
          res.resultTime = me.convertToMinutes(res.time);
        }
        return res;
      }
    });
    return mapped;
  }

  getWpRes(wp) {      // for debug purpose
    let me = this;
    let mapped = me.data.filter(function(res, i) {
      if (res.waypoint == wp) return true;
    });
    return mapped;
  }

  getFinishResults() {
    let me = this;
    let res = me.getWaypointResults(me.waypointsNum - 1);
    return res;
  }

  getPlayerResults(name) {
    return this.data.filter(function(res, i){
      if(res.playerName == name) return true;
    });
  }

  getTop(number) {
    let finishRes = this.getFinishResults();
    let currentRes = finishRes.slice(0, number);
    return currentRes.slice(0, number);
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
    let forwardZero = (seconds < 10 && minutes > 0) ? '0' : '';
    let millis = seconds.toFixed(1).split('.')[1];
    let timeStr = "";

    //apply formatting
    seconds = forwardZero + Math.floor(seconds);
    minutes = (minutes > 0) ? minutes + ':' : '';
    timeStr = minutes + seconds + '.' + millis;

    return timeStr;
  }
}