export class Championship {
  constructor() {
    this.stages = { ...gameData.stageData };
    this.results = [];
    this.players = [];
    this.currentRace;
    // this.raceList = createRaceList();

    this.playerPoints = {};
    this.nationPoints = {};

    this._initPlayers(game.players);

    this.initNextRace();
    this.currentRace.initRoster(this.players);
    window.myRace = this.currentRace;
  }

  _initPlayers(players) {}

  initNextRace() {
    for (let race of this.raceList) {
      if (race.results === null)
        this.currentRace = new Race(
          race.stageName,
          race.raceType,
          race.raceGender
        );
    }
  }

  onRaceFinish(results) {}

  createRaceRoster() {}
}
