class Championship {
  constructor(newPlayers, raceConfigs) {
    this.raceCount = 5;
    this.races = [];
    this.points = {};
    this.players = [];
    this.roster = [];   //TBI
    this.nextRace = 0;
    this.pointsMap = [60, 54, 48, 43, 40, 38, 36, 34, 32, 31,
      30, 29, 28, 27, 26, 25, 24, 23, 22, 21,
      20, 19, 18, 17, 16, 15, 14, 13, 12, 11,
      10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    this.pointsMapMS = [60, 54, 48, 43, 40, 38, 36, 34, 32, 31,
      30, 29, 28, 27, 26, 25, 24, 23, 22, 21,
      20, 18, 16, 14, 12, 10, 8, 6, 4, 2];
    this.initPlayers(newPlayers);
    this.initRaces(raceConfigs);
    this.initResults();
  }

  initPlayers(newPlayers) {
    for (let p of newPlayers) {
      this.players.push(new Player({
        name: p.name,
        speed: p.speed,
        accuracy: p.accuracy,
        startTimer: 0
      }));
    }
  }

  resetPlayers() {
    for (let p of this.players) {
      p.reset();
    }
  }

  initRaces(raceConfigs) {
    // TODO create array of races objects
    for (let i = 0; i < raceConfigs.length; i++) {
      this.races.push(new Race(raceConfigs[i], 'men'));
      this.races.push(new Race(raceConfigs[i], 'women'));
    }
  }

  initResults() {
    for (let p of this.players) {
      this.points[p.name] = 0;
    }
  }

  addResults(results) {
    //TODO add points for race results
    let res = results.getFinishResults();
    if (res.length == 30) {
      for (let i = 0; i < this.pointsMapMS.length; i++) {
        this.points[res[i].playerName] += this.pointsMapMS[i];
      }
    } else {
      for (let i = 0; i < this.pointsMap.length; i++) {
        this.points[res[i].playerName] += this.pointsMap[i];
      }
    }
    this.nextRace++;
  }

  getStandingsResults() {
    //return sorted array of points object
    let res = [];
    for (let p of this.players) {
      res.push({ name: p.name, points: this.points[p.name], baseSpeed: p.baseSpeed, accuracy: p.getAccuracy(), strength: p.strength });
    }
    res.sort((a, b) => {
      if (a.points > b.points) {
        return -1;
      } else if (a.points < b.points) {
        return 1;
      }
      return 0;
    });
    return res;
  }

  getTopResults(resultNum) {
    let res = [];
    res = this.players.sort(
      (a, b) => {
        return this.points[a.name] < this.points[b.name] ? 1 : -1
        return 0;
      }
    ).slice(0, resultNum);
    return res;
  }

  getNextRace() {
    // return next race object
    this.resetPlayers();
    let roster = [];
    let number = 1;
    let startTime = 0;
    let _nextRace = this.races[this.nextRace];

    //create start list based on racetype
    if (_nextRace.startType == CONSTANT.RACE_START_TYPE.SEPARATE) {
      for (let p of this.players) {
        p.startTimer = startTime;
        p.number = number++;
        startTime += CONSTANT.START_TIME_INTERVAL;
        roster.push(p);
      }
    } else if (_nextRace.startType == CONSTANT.RACE_START_TYPE.PURSUIT) {
      // TODO hmm, think a bit more about it
      let res = this.races[this.nextRace - 2].results.getTop(CONSTANT.PURSUIT_PLAYERS_NUM);
      let baseTime = res[0].time;
      for (let i = 0; i < res.length; i++) {
        for (let p of this.players) {
          if (p.name == res[i].playerName) {
            p.startTimer = res[i].time - baseTime;
            p.number = number++;
            roster.push(p);
          }
        }
      }
    } else if (_nextRace.startType == CONSTANT.RACE_START_TYPE.ALL) {
      //massstart? pick top 30 from championship ratings
      let r = this.getTopResults(30);
      for (let p of r) {
        p.number = number++;
      }
      roster = r;
    }

    _nextRace.initRoster(roster);

    return _nextRace;
  }

}