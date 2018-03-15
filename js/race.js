//Game controller

class Race {
  constructor(newPlayers, newTrack) {
    this.track = newTrack;
    this.players = [];
    this.results = new Results(this.track);
    this.gameTimer = 0;
    this.gameStatus = 'Not started';
    for (let p of newPlayers) {
      this.players.push(new Player({ name: p.name, speed: Math.round((Math.random() * 14 + 8) * 100) / 100 }));
    }
  }

  run() {
    let me = this;
    if (me.gameStatus == 'Not started') {
      me.gameStatus = 'Started';
    } else if (me.gameStatus = 'Started') {
      me.gameTimer += 0.1;
      for (let p of me.players) {
        me.playerAct(p);
      }
    }
    //check race end
    for (let p of me.players) {
      if (p.running) return true;
    }

    return false;
  }

  playerAct(p) {
    let me = this;
    if (p.running) {
      let runStatus = p.run(me.track);
      if (runStatus.waypointPassed !== -1) {
        me.results.pushResult(p.name, runStatus.waypointPassed, this.gameTimer.toFixed(1));
        if (p.getDistance() > me.track.getTrackLength()) {
          p.stop();
        }
      }
      if (runStatus.shootingPassed) {
        p.shoot();
      }
    } else if (p.shooting) {
      let shootStatus = p.shoot();
      if (shootStatus == 'missed') {
        p.addPenalty(track.penaltyLength);
      }
    }
  }
}


function oldGame() {
  var players = [],
    track,
    gameTimer = 0,
    gameRuns = false,
    gameSpeed = 100,
    gameResults = {};

  var gm = this;

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
          if (runStatus !== -1) {
            results.pushResult(player.name, runStatus, gameTimer.toFixed(1));
            if (runStatus == track.getWaypointsNum() - 1) player.stop();
          }
          if (track.passShootingRange(player.getPlayer())) {
            player.shoot();
          }
        } else if (player.shooting) {
          player.shoot();
        }
      }

      //render graphics
      me.renderPlayers();
      renderResults(results);
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
