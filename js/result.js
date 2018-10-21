// MAJOR REFACTORING UNDERWAY 17.10.2018

class Results {
  constructor() {
    this.data = [];             // {name, waypoint, time}
    this.shootingData = [];     // { name, number, result[ARR] }
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

  pushShootingResult(name, number, range, result) {
    this.shootingData.push({name: name, number: number, range: range, result: result});
  }

  getShootingResult(name) {
    var res = [];
    for (var i = 0; i < this.shootingData.length; i++) {
      if (this.shootingData[i].name == name) {
        res.push(this.shootingData[i].result);
      }
    }
    return res;
  }

  // getMisses(name) {
  //   // get misses count
  //   // var res = this.shootingData.filter((val, i) => {
  //   //   if (val.name == name && !val.result) return true;
  //   // });
  //   var res = [];

  //   for (var i = 0; this.shootingData.length; i++) {
  //     if (this.shootingData[i].name == name) {
  //       // res.push(this.shootingData[i].)
  //     }
  //   }

  //   return res.length;
  // }

  getMissesByRange(name) {
    let rangeResults = [];

    for (let i=1; i<4; i++) {
      let rng = this.getShootingResult(name, i);
      if (rng.length > 0) {
        let res = rng.filter(s => s == '-');
        rangeResults.push(res.length);
      }
    }
    console.log(rangeResults);
    return rangeResults.join('+');
  }

  getWaypointResults(wp) {
    var me = this,
        results = me.data.filter(function(res) {
          if (res.waypoint == wp) return true;
        });

    results.sort(function(a,b){
      if (a.time > b.time) {
        return 1;
      }
      if (a.time < b.time) {
        return -1
      }
      return 0;
	});
	for (var i = 0; i < results.length; i++) {
		var shooting = me.getShootingResult(results[i].playerName);
		results[i].shooting = shooting;
	}

	return results;
  }

  getWaypointResults_old(wp) {
    let me = this;
    let mapped = me.data.filter(function(res) {
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

  // getWpRes(wp) {      // for debug purpose
  //   let me = this;
  //   let mapped = me.data.filter(function(res, i) {
  //     if (res.waypoint == wp) return true;
  //   });
  //   return mapped;
  // }

  // getFinishResults() {
  //   let me = this;
  //   let res = me.getWaypointResults(me.waypointsNum - 1);
  //   return res;
  // }

  getPlayerResults(name) {
    return this.data.filter(function(res, i){
      if(res.playerName == name) return true;
    });
  }

  // getTop(number) {
  //   let finishRes = this.getFinishResults();
  //   let currentRes = finishRes.slice(0, number);
  //   return currentRes.slice(0, number);
  // }

  // playerNames() {
  //   var res = [];
  //   this.data.forEach(function(val, i) {
  //     if (res.indexOf(val.playerName) == -1) {
  //       res.push(val.playerName);
  //     }
  //   });
  //   return res;
  // }

  
}