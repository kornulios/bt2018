//TODO - remove all direct references to race results
// controller
class Championship {
  constructor(players, raceConfigs) {
    this.points = {};
    this.pointsNations = {};
    this.stage = stageData[0];        // game.getStages()
    this.races = this.initRaces(this.stage);
    this.players = players;
    this.teams = game.getTeams();
    this.roster = [];
    this.nextRace = 0;

    this.currentRace = {};
    this.currentStage = 0;
    this.raceInProgress = false;

    this.pointsMap = [60, 54, 48, 43, 40, 38, 36, 34, 32, 31,
      30, 29, 28, 27, 26, 25, 24, 23, 22, 21,
      20, 19, 18, 17, 16, 15, 14, 13, 12, 11,
      10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    this.pointsMapMS = [60, 54, 48, 43, 40, 38, 36, 34, 32, 31,
      30, 29, 28, 27, 26, 25, 24, 23, 22, 21,
      20, 18, 16, 14, 12, 10, 8, 6, 4, 2];
    this.pointsMapNations = [420, 390, 360, 330, 310, 290, 270, 250,
      230, 220, 210, 200, 190, 180, 170, 160, 150, 140, 130, 120, 110,
      100, 90, 80, 70, 60, 50, 40, 30, 20];

    this.initResults();
  }

  // initPlayers(newPlayers) {
  //   var newArr = [],
  //     tempNum = 0,
  //     tempAI = [];
  //   for (let p of newPlayers) {
  //     tempAI = (tempNum < 20) ? CONSTANT.AI.AGGRESSIVE : (tempNum > 180) ? CONSTANT.AI.WEAK : CONSTANT.AI.NORMAL;
  //     newArr.push(new Player({
  //       name: p.name,
  //       team: p.team,
  //       gender: p.gender,
  //       speed: p.speed,
  //       accuracy: p.accuracy,
  //       startTimer: 0,
  //       aiBehaviour: tempAI
  //     }));
  //     tempNum++;
  //   }
  //   return newArr;
  // }

  resetPlayers() {
    for (let p of this.players) {
      p.reset();
    }
  }

  initRaces(stage) {
    // TODO create array of races objects
    var newRaces = [], race;

    for (var i = 0; i < stage.raceMap.length; i++) {
      race = stage.raceMap[i];
      race.stageName = stage.name;
      if (race.type == 'Relay') {
        newRaces.push(new RelayRace(race, 'men'));
        newRaces.push(new RelayRace(race, 'women'));
      } else {
        newRaces.push(new Race(race, 'men'));
        newRaces.push(new Race(race, 'women'));
      }
    }
    return newRaces;
  }

  initResults() {
    for (let p of this.players) {
      this.points[p.name] = 0;
    }
    for (var t of game.teams) {
      this.pointsNations[t.name] = 0;
    }
  }

  calculatePoints(res) {
    switch (this.currentRace.raceType) {
      case 'Relay':
        for (var i = 0; i < this.pointsMapNations.length; i++) {
          if (res[i]) {
            this.pointsNations[res[i].team] += this.pointsMapNations[i];
          }
        }
        return;
      case 'Mass Start':
        for (let i = 0; i < this.pointsMapMS.length; i++) {
          this.points[res[i].playerName] += this.pointsMapMS[i];
        }
        return;
      default:
        for (let i = 0; i < this.pointsMap.length; i++) {
          this.points[res[i].playerName] += this.pointsMap[i];
        }
        return;
    }
  }

  getChampionshipStandings() {
    //return sorted array of points object
    var res = [];
    for (var p of this.players) {
      res.push({
        name: p.name,
        team: p.team,
        points: this.points[p.name],
        baseSpeed: p.baseSpeed,
        accuracy: p.getAccuracy(),
        strength: p.strength,
        gender: p.gender
      });
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

  getPlayers() {
    var res = [];
    for (var p of this.players) {
      var tempPlayer = p;
      p.points = this.points[p.name];
      res.push(p);
    }
    return res;
  }

  getTeam(teamName) {
    var men = [], women = [];
    for (var p of this.players) {
      if (p.team.name == teamName) {
        p.gender == 'men' ? men.push(p) : women.push(p);
      }
    }
    return { men: men, women: women };
  }

  getTopResults(resultNum, gender) {
    let res = [];
    res = this.players.filter(function (p) {
      return p.gender == gender;
    });

    res = res.sort(
      (a, b) => {
        return this.points[a.name] < this.points[b.name] ? 1 : -1
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

  getRacesSchedule() {
    var races = [];
    this.races.forEach(function (race) {
      races.push({ name: race.getRaceName(), status: race.status });   // TODO add date, location etc.
    });
    return races;
  }

  getNextRaceIndex() {
    for (var i = 0; i < this.races.length; i++) {
      if (this.races[i].getRaceStatus() == 'Not started') {
        return i;
      }
    }
    return false;
  }

  getStageName() {
    return this.stage.name;
  }

  prepareNextStage() {
    var me = this;

    me.currentStage++;
    me.stage = stageData[me.currentStage];
    me.races = me.initRaces(me.stage);

    return me.currentStage;
  }

  prepareNextRace() {
    // return next race object
    this.resetPlayers();      // should be peformed by race!

    var roster = [],
      number = 1,
      startTime = 0,
      _nextRace = this.races[this.getNextRaceIndex()];

    if (!_nextRace) {
      return false;
    }

    //create start list based on racetype
    if (_nextRace.startType == CONSTANT.RACE_START_TYPE.SEPARATE) {
      for (var p of this.players) {
        if (p.gender == _nextRace.raceGender) {
          p.startTimer = startTime;
          p.number = number++;
          startTime += CONSTANT.START_TIME_INTERVAL;
          roster.push(p);
        }
      }
    } else if (_nextRace.startType == CONSTANT.RACE_START_TYPE.PURSUIT) {
      //search for sprint race type with same gender
      var res;
      for (var r = 0; r < this.races.length; r++) {
        var race = this.races[r];
        if (race.raceType == 'Sprint' && race.raceGender == _nextRace.raceGender) {
          res = race.getFinishResult().slice(0, 60);
          break;
        }
      }

      var baseTime = res[0].time;
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
      var top30 = this.getTopResults(30, _nextRace.raceGender);
      for (var p of top30) {
        p.number = number++;
      }
      roster = top30;
    } else if (_nextRace.startType == CONSTANT.RACE_START_TYPE.RELAY) {
      for (var team of game.getTeams()) {
        var teamMembers = [];
        _nextRace.raceGender == 'men' ? teamMembers = this.getTeam(team.name).men : teamMembers = this.getTeam(team.name).women;
        if (teamMembers.length >= 4) {
          roster.push({ name: team.name, id: 1, players: teamMembers.slice(0, 4) })
        }
      }
    }

    _nextRace.initRoster(roster);
    this.currentRace = _nextRace;
    return true;
  }

  getLastRace() {
    return this.races[this.getNextRaceIndex() - 1];
  }

  runRace(gameTick) {
    var me = this;

    me.raceInProgress = me.currentRace.run(gameTick);

    if (!me.raceInProgress) {
      me.calculatePoints(me.currentRace.getFinishResult());
    }
    return me.raceInProgress;
  }

}