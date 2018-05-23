class Game {
  constructor() {
    this.gameSpeed = 1;      //50 ticks per second
    this.gameTimer;
    this.gameRunning = false;
    this.view = new View();
    this.championship = Object.create(null);
    this.race = Object.create(null);

    this.selectedResults = 0;
  }

  createChampionship(players) {
    this.championship = new Championship(players, trackData);
    return this.championship;
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

  nextRace() {
    let me = this,
      race = me.championship.getNextRace();

    me.view.renderPlayers(race);
    me.view.renderTrackInfo(race);
    me.view.showRunScreen();
    me.race = race; 
  }

  startRace() {
    var me = this;
    me.gameTimer = setInterval(function () {
      if (!me.race.run()) {
        clearInterval(me.gameTimer);
        me.championship.addResults(me.race.results);
        me.view.showFinishScreen();
      }
      me.view.renderPlayers(me.race);
      me.view.renderResults(me.race.results.getWaypointResults(me.selectedResults), me.selectedResults);
    }, me.gameSpeed);
  }

  calculateRace() {
    let me = this;
    let gameRunning = true;
    do
      gameRunning = me.race.run();
    while (gameRunning)

    me.championship.addResults(me.race.results);
    me.view.showFinishScreen();
    me.view.renderPlayers(me.race);
    me.view.renderResults(me.race.results.getWaypointResults(me.race.track.waypoints.length - 1));
  }

  setGameSpeed() {
    debugger
    this.gameSpeed = 10;
  }
}