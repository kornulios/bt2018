class Championship {
  constructor(players) {
    this.raceCount = 5;
    this.race = [];
    this.points = {};
    this.players = players;
    this.nextRace = 0;
    this.pointsMap = [10, 6, 4, 3, 2, 1];

    this.initRaces();
    this.initResults();
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
    this.nextRace++;
  }

  getNextRace() {
    // return next race object
    return this.race[this.nextRace];
  }

}