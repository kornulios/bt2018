//Game controller

function Game() {
  var players = [],
    track,
    gameTimer = 0,
    gameRuns = false,
    gameSpeed = 100,
    gameResults = {};

  var gm = this;

  this.initGame = function (newPlayers) { //array with players
    track = new Track();
    results = new Results(track);
    for (var i = 0; i < newPlayers.length; i++) {
      players.push(new Player({ name: newPlayers[i].name, speed: Math.round((Math.random() * 14 + 8) * 100) / 100 }));
    }

    //test window events
    window.addEventListener('message', function (e) {
      console.log('Hello, message was received');
    });
  }

  this.playGame = function () {
    var ticker;
    var me = this;
    var tickNum = 0, maxTicks = 5;
    gameRuns = true;

    //main game loop
    ticker = setInterval(function () {

      gameTimer += 0.1;

      for (var i = 0; i < players.length; i++) {

        var player = players[i];
        var runStatus;

        if (player.running) {
          player.run();
          runStatus = track.isWaypointPassed(player.getPlayer());
          if (runStatus > -1) {
            results.pushResult(player.name, runStatus, gameTimer.toFixed(1));
          }
          if (runStatus == track.getWaypointsNum - 1) player.stop();
        }

      }

      me.renderPlayers();
      renderGameTurn(tickNum);

      gameRuns = me.checkGameEnd();

      tickNum++;
      if (!gameRuns) {
        clearInterval(ticker);
        setGameStatus('Game ended');
        renderResults(results);
      }
    }, gameSpeed);

  }

  this.checkGameEnd = function () {
    for (i = 0; i < players.length; i++) {
      if (players[i].getDistance() < track.getTrackLength()) return true;
    }
    return false;
  }

  this.renderPlayers = function () {
    clearMainView();
    players.forEach(function (player, i) {
      renderPlayer(player);
    });
  }
}
