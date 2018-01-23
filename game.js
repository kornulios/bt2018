//Game controller

function Game() {
  var players = [];

  this.initGame = function(numPlayers) {
    var newPlayers = numPlayers || 1;
    for(var i=0; i<newPlayers; i++){
      players.push(new Player({speed: Math.floor(Math.random() * 40 + 20)}));
    }
  }

  this.playGame = function() {
    for (var i=0; i<players.length; i++) {
      players[i].run();
    }
  }
}
