class Championship {
  constructor(newPlayers) {
    this.raceCount = 5;
    this.race = [];
    this.points = {};
    this.players = [];
    this.roster = [];   //TBI
    this.nextRace = 0;
    this.pointsMap = [10, 6, 4, 3, 2, 1];

    this.initPlayers(newPlayers);
    this.initRaces();
    this.initResults();
  }

  initPlayers(newPlayers) {
    for (let p of newPlayers) {
      this.players.push(new Player({
        name: p.name,
        speed: Math.round((Math.random() * (22 - 18) + 18) * 100) / 100,
        accuracy: Math.random() * (0.3 - 0.025) + 0.025,
        startTimer: 0
      }));
    }
  }

  initRaces() {
    // TODO create array of races objects
    for (let i = 0; i < this.raceCount; i++) {
      this.race[i] = new Race(this.players, new Track(trackData[0], 'women'));
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
    for (let i = 0; i < this.pointsMap.length; i++) {
      this.points[res[i].playerName] += this.pointsMap[i];
    }
    this.nextRace++;
  }

  getStandingsResults() {
    //return sorted array of points object
    let res = [];
    for (let p of this.players) {
      res.push({name: p.name, points: this.points[p.name], baseSpeed: p.baseSpeed, accuracy: p.getAccuracy(), strength: p.strength});
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

  getNextRace() {
    // return next race object
    return this.race[this.nextRace];
  }

}