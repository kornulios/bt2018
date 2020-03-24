// MAJOR REFACTORING UNDERWAY 17.10.2018
// V2. 21.10.2018 Refac part 2 done

class Results {
  constructor() {
    this.data = [];             // {name$, waypoint%, time!}
    this.shootingData = [];     // { name$, number%, result[ARR] }
    this.relative = true;
  }

  pushResult(player, wp, t) {
    var resObj = {
      playerName: player.name,
      number: player.number,
      team: player.team,
      waypoint: wp,
      time: t
    };
    this.data.push(resObj);
  }

  pushRelayResult(wp, number, playerName, teamName, time) {
    var resObj = {
      waypoint: wp,
      playerName: playerName,
      number: number,
      team: teamName,
      time: time,
    };
    this.data.push(resObj);
  }

  pushShootingResult(player, range, result) {
    this.shootingData.push({ name: player.name, number: player.number, range: range, result: result });
  }

  pushShootingResultRelay(range, playerName, teamName, result) {
    this.shootingData.push({
      range: range,
      name: playerName,
      team: teamName,
      result: result,
    });
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

  getWaypointResults(wp) {
    var me = this,
      results = me.data.filter(function (res) {
        if (res.waypoint == wp) return true;
      });

    results.sort(function (a, b) {
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
    return this.data.filter(function (res, i) {
      if (res.playerName == name) return true;
    });
  }

  getRelayResults(waypoint) {
    var res = this.data.filter(item => {
      return item.waypoint == waypoint;
    });
    return res;
  }
}