class Championship {
  constructor() {
    this.raceList = [];
    this.stages = gameData.stageData;
    this.results = [];
    this.players = [];


    this.initPlayers(game.players);
    this.initRaces(game.raceMap);

    this.results = this.stages.map(stage, index => {
      const res = [];
      
    });

    super();
  }

  initPlayers(players) {
    for (const p in players) {
      p.points = 0;
      this.players.push(p);
    }
  }

  initNextRace() {

  }

  createRaceRoster() {

  }

  get players() {
    return this.players;
  }

  get races() {
    return this.races;
  }

}