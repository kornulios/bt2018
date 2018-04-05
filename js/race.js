//Game controller

class Race {
  constructor(newPlayers, newTrack) {
    this.track = newTrack;
    this.players = [];
    this.results = new Results(this);
    this.gameTimer = 0;
    this.gameStatus = 'Not started';
    this.startType = newTrack.startType;

    let startTimer = 0;
    for (let p of newPlayers) {
      this.players.push(new Player({
        name: p.name,
        speed: Math.round((Math.random() * 12 + 12) * 100) / 100,
        accuracy: Math.random() * (1 - 0.5) + 0.5,
        startTimer: startTimer
      }));
      if (this.startType == CONSTANT.RACE_START_TYPE.SEPARATE) {
        startTimer += 5;
      }
    }
  }

  run() {
    let me = this;
    if (me.gameStatus == 'Not started') {
      me.gameStatus = 'Started';
      return true;
    }
    if (me.gameStatus = 'Started') {
      me.gameTimer += 0.1;
      for (let p of me.players) {
        if (p.notstarted) {
          if (me.gameTimer >= p.startTimer) p.start();
        }
        me.playerAct(p);
      }
    }
    //check race end
    for (let p of me.players) {
      if (!p.finished) return true;
    }
    return false;
  }

  playerAct(p) {
    let me = this;
    if (p.running) {
      let runStatus = p.run(me.track);
      if (runStatus.waypointPassed !== -1) {
        me.results.pushResult(p.name, runStatus.waypointPassed, this.gameTimer.toFixed(1) - p.startTimer);
        p.makeDecision();
        if (p.getDistance() > me.track.getTrackLength()) {
          p.stop();
        }
      }
      if (runStatus.shootingPassed) {
        p.enterShootingRange(runStatus.shootingPassed);
      }
    } else if (p.shooting) {
      let shot = p.shoot();

      if (shot) {
        me.results.pushShootingResult(p, shot.result, shot.shotNum);
        if (shot.result == false) {
          p.addPenalty(me.track.penaltyLength);
        }
        if (shot.shotNum == 5) {
          p.quitShootingRange();
          me.results.getMisses(p.name);
        }
      }
    }
  }
}
