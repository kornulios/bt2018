

export class Championship {
  constructor() {
    this.stages = { ...gameData.stageData };
    this.results = [];
    this.players = [];
    this.currentRace;
    this.raceList = createRaceList();

    this._initPlayers(game.players);

    this.initNextRace();
    this.currentRace.initRoster(this.players);
    window.myRace = this.currentRace;
  }

  _initPlayers(players) {
    players.forEach(player => {
      player.points = 0;
      this.players.push(player);
    });
  }

  initNextRace() {
    for (let race of this.raceList) {
      if (race.results === null) 
        this.currentRace = new Race(race.stageName, race.raceType, race.raceGender);
    }
  }

  onRaceFinish() {
    for (let race of this.raceList) {
      if (race.results === null) 
        race.results = this.currentRace.getResults();
        return;
    }
  }

  createRaceRoster() {

  }


}