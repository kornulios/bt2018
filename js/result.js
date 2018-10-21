// MAJOR REFACTORING UNDERWAY 17.10.2018
// V2. 21.10.2018 Refac part 2 done

class Results {
  constructor() {
    this.data = [];             // {name$, waypoint%, time!}
    this.shootingData = [];     // { name$, number%, result[ARR] }
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

  getPlayerResults(name) {
    return this.data.filter(function(res, i){
      if(res.playerName == name) return true;
    });
  }
}