class Game {
  constructor() {
    this.gameSpeed = 1000 / 60;      //50 ticks per second
    this.gameTimer;
    this.gameRunning = false;

    this.view = new View();
    this.championship = Object.create(null);
    this.players = this.loadPlayers();

    this.selectedResults = 0;
  }

  loadPlayers() {
    //AJAX will go there 
    // getData();
    let me = this;
    let res = [];
    for (let i = 0; i < 104; i++) {
      let p = { name: "Player " + i }   //mock for players
      res.push(p);
    }
    return res;
  }

  createChampionship(players) {
    return new Championship(players, trackData);
  }

  mainScreen() {
    let me = this;
    me.view.renderChampionshipView(me.championship);
  }

  setResultView(viewNum) {
    let me = this;
    me.selectedResults = viewNum;
    me.view.renderResults(me.race.results.getWaypointResults(me.selectedResults), me.selectedResults);
  }

  startNewChampionship() {
    if (this.players.length > 0) {
      this.championship = this.createChampionship(this.players);
      this.view.renderChampionshipView(this.championship);
    } else {
      console.log('No players loaded.');
    }
  }

  prepareNextRace() {
    let me = this;
      // race = me.championship.getNextRace();

    // me.view.renderPlayers(race);
    // me.view.renderTrackInfo(race);

    me.view.showRunScreen();
    // me.race = race;
  }

  render() {
    let me = this;
    me.view.renderPlayers(me.race);
    me.view.renderResults(me.race.results.getWaypointResults(me.selectedResults), me.selectedResults);
  }

  runGame( tFrame ) {       //refactored with rAF
    let me = this;

    if (!tNow) {
      tNow = window.performance.now();
    }

    me.stopTimer = window.requestAnimationFrame(me.runGame.bind(me));

    for (let ticks = 0; ticks < 120; ticks++) {
      me.gameRunning = me.championship.runRace();
    }
    me.render();

    if (!me.gameRunning) {
      window.cancelAnimationFrame(me.stopTimer);
      // alert('Race finished in ' + (tFrame - tNow) + 'ms');
      // me.championship.addResults(me.race.results);
      me.view.showFinishScreen();
    }
  }

  calculateRace() {
    //used to skip race 
    let me = this;
    let gameRunning = true;
    // let raceResults = me.race.results;

    do
      gameRunning = me.championship.runRace();
    while (gameRunning)

    // me.championship.addResults(raceResults);
    me.view.showFinishScreen();
    me.view.renderChampionshipView(me.championship);
    // debugger
    // me.view.renderPlayers(me.race);
    // me.view.renderResults(raceResults.getWaypointResults(me.race.track.waypoints.length - 1));
  }

  setGameSpeed() {    //not implemented
    debugger
    this.gameSpeed = 10;
  }
}