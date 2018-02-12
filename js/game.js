//Game controller

function Game() {
  var players = [],
    track,
    gameTimer = 0,
    gameRuns = false,
    gameResults = {};

  this.initGame = function (newPlayers) { //array with players
    track = new Track();
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
        players[i].run();
        newDist = players[i].getDistance();
        for (var j=0; j<wpoints.length; j++) {
          if(oldDist < wpoints[j] && newDist > wpoints[j]) {
            console.log('Push result ' + players[i].getPlayer().name + ' on WP ' + j + ' time ' + gameTimer);
          }  
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
    }, 333);

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
