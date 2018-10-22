//TODO - remove all direct references to race results

class Championship {
  constructor(newPlayers, raceConfigs) {
    this.points = {};
    this.races = this.initRaces(raceConfigs);
    this.players = this.initPlayers(newPlayers);
    this.roster = [];   
    this.nextRace = 0;

    this.currentRace = this.getNextRace();
    this.raceInProgress = false;

    this.pointsMap = [60, 54, 48, 43, 40, 38, 36, 34, 32, 31,
      30, 29, 28, 27, 26, 25, 24, 23, 22, 21,
      20, 19, 18, 17, 16, 15, 14, 13, 12, 11,
      10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    this.pointsMapMS = [60, 54, 48, 43, 40, 38, 36, 34, 32, 31,
      30, 29, 28, 27, 26, 25, 24, 23, 22, 21,
      20, 18, 16, 14, 12, 10, 8, 6, 4, 2];

    this.initResults();
  }

  initPlayers(newPlayers) {
    var newArr = [];
    for (let p of newPlayers) {
      newArr.push(new Player({
        name: p.name,
        team: p.team,
        speed: p.speed,
        accuracy: p.accuracy,
        startTimer: 0
      }));
    }
    return newArr;
  }

  resetPlayers() {
    for (let p of this.players) {
      p.reset();
    }
  }

  initRaces(raceConfigs) {
    // TODO create array of races objects
    var newRaces = [];
    for (let i = 0; i < raceConfigs.length; i++) {
      newRaces.push(new Race(raceConfigs[i], 'men'));
      newRaces.push(new Race(raceConfigs[i], 'women'));
    }
    return newRaces;
  }

  initResults() {
    for (let p of this.players) {
      this.points[p.name] = 0;
    }
  }

  calculatePoints(res) {
    if (res.length == 30) {
      for (let i = 0; i < this.pointsMapMS.length; i++) {
        this.points[res[i].playerName] += this.pointsMapMS[i];
      }
    } else {
      for (let i = 0; i < this.pointsMap.length; i++) {
        this.points[res[i].playerName] += this.pointsMap[i];
      }
    }
  }

  getStandingsResults() {
    //return sorted array of points object
    let res = [];
    for (let p of this.players) {
      res.push({ name: p.name, team: p.team, points: this.points[p.name], baseSpeed: p.baseSpeed, accuracy: p.getAccuracy(), strength: p.strength });
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

  getRaceResult(raceNum) {
      if (raceNum === undefined) {
        return this.races[this.nextRace - 1].results;  
      }
      return this.races[raceNum].results;
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
      //search for sprint race type with same gender
      var res;
      for (var r = 0; r < this.races.length; r++) {
        var race = this.races[r];
        if (race.track.raceType == 'Sprint' && race.gender == _nextRace.gender) {
          res = race.getFinishResult().slice(0, 60);
          break;
        }
      }
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
      //massstart - pick top 30 from championship ratings
      let r = this.getTopResults(30);
      for (let p of r) {
        p.number = number++;
      }
      roster = r;
    }

    _nextRace.initRoster(roster);
    return _nextRace;
  }

  getLastRace() {
    return this.races[this.nextRace - 1];
  }

  runRace() {

    if (this.nextRace > this.races.length) {
      return false;
    }

    this.raceInProgress = this.currentRace.run();
    if (this.currentRace.status == 'Finished') {
      //update resuts
      this.calculatePoints(this.currentRace.getFinishResult());
      this.nextRace++;
      if(this.nextRace < this.races.length) {
        this.currentRace = this.getNextRace();
      }
    }

    return this.raceInProgress;
  }

}