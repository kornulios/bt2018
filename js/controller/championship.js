class Championship {
  constructor() {
    this.raceList = [];
    this.stages = gameData.stageData;
    this.results = [];
    this.players = [];


    this.initPlayers(game.players);

    this.results = this.stages.map((stage, index) => {
      const res = [...stage.raceMap];
      this.raceList.push(res);
    });

  }

  initPlayers(players) {
    players.forEach(player => {
      player.points = 0;
      this.players.push(player);      
    });
  }

  initNextRace() {

  }

  createRaceRoster() {

  }



}