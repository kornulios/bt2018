//Game controller

function Game() {
  var players = [];

  this.initGame = function (newPlayers) { //array with players
    // var newPlayers = numPlayers || 1;
    for (var i = 0; i < newPlayers.length; i++) {
      players.push(new Player({ name: newPlayers[i].name , speed: Math.round((Math.random() * 14  + 8) * 100) / 100 }));
    }
  }

  this.playGame = function () {
    var ticker;
    var me = this;
    var tickNum = 0, maxTicks = 5;
    ticker = setInterval(function () {
      for (var i = 0; i < players.length; i++) {
        players[i].run();
      }

      me.renderPlayers();
      renderGameTurn(tickNum);

      tickNum++;
      if (tickNum > maxTicks) clearInterval(ticker);
    }, 333);
    
  }

  this.renderPlayers = function() {
    clearMainView();
    players.forEach(function(player, i){
      renderPlayer(player);
    });
    // renderPlayer(players[0]);
  }
}
