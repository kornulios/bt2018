//Game controller

function Game() {
  var players = [],
    track,
    gameTimer = 0,
    gameRuns = false,
    gameSpeed = 100,
    gameResults = {};

  this.initGame = function (newPlayers) { //array with players
    track = new Track();
    results = new Results();
    for (var i = 0; i < newPlayers.length; i++) {
      players.push(new Player({ name: newPlayers[i].name, speed: Math.round((Math.random() * 14 + 8) * 100) / 100 }));
    }
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
        var oldDist = players[i].getDistance();
        var newDist; 
        var wpoints = track.getWaypoints();
        var player = players[i];

        player.run();
        newDist = player.getDistance();

        for (var j=0; j<wpoints.length; j++) {
          if(oldDist < wpoints[j] && newDist > wpoints[j]) {
            console.log('Push result ' + players[i].getPlayer().name + ' on WP ' + j + ' time ' + gameTimer.toFixed(1));
            results.pushResult(
              player.name,
              j,
              gameTimer.toFixed(1)
            );
          }  
        }

        //stop condition
        if (newDist > track.getTrackLength()) {
          players[i].stop();
        }

      }

      me.renderPlayers();
      renderGameTurn(tickNum);

      gameRuns = me.checkGameEnd();

      tickNum++;
      if (!gameRuns) {
        clearInterval(ticker);
        setGameStatus('Game ended');
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
