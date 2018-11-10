//Game controller

class Race {
  constructor(newTrack, gender) {
    this.track = new Track(newTrack, gender);
    this.players = [];
    this.results = new Results(this);
    this.gameTimer = 0;
    this.status = 'Not started';
    this.startType = this.track.startType;
    this.penaltyType = this.track.penaltyType;

    //misc data
    this.name = newTrack.location + ' ' + this.track.raceType + ' ' + (this.track.getTrackLength() / 1000).toFixed(1) + 'km'
    this.gender = gender;
  }

  initRoster(roster) {
    for(let p of roster) {
      this.players.push(p);
    }
  }

  getFinishResult() {
    return this.results.getWaypointResults(this.track.waypointsNum() - 1);
  }

  getName() {
    return this.name;
  }

  run() {
    let me = this;

    if (me.status == 'Not started') {
      me.status = 'Started';
      return true;
    }
    if (me.status = 'Started') {
      me.gameTimer = parseFloat((me.gameTimer + 0.1).toFixed(1));
      for (let p of me.players) {
        if (p.notstarted) {
          if (me.gameTimer >= p.startTimer) {
            p.start();
            if (me.startType == CONSTANT.RACE_START_TYPE.PURSUIT) p.startTimer = 0;   //TODO rework
          }
        }
        if (!p.finished) {
          me.playerAct(p);
        }
      }
    }
    
    //check race end
    for (let p of me.players) {
      if (!p.finished) return true;
    }

    // var debD = [];
    // for (var i = 0; i < debugProfiler['Player 1'].length; i += 60) {
    //   debD.push([i, debugProfiler['Player 1'][i][0], debugProfiler['Player 1'][i][1]]);
    // }
    // console.table(debD);

    me.status = 'Finished';
    return false;
  }

  playerAct(p) {
    var me = this;
    var recalcStats = (me.gameTimer % 1) == 0;

    if (recalcStats) {
      p.recalculateStatus();
    }

    if (p.running) {

      var runStatus = p.run(me.track);

      if (runStatus.waypointPassed !== -1) {
        me.results.pushResult(p.getShortInfo(), runStatus.waypointPassed, this.gameTimer.toFixed(1) - p.startTimer + p.penaltyTime);
        p.makeDecision();
        if (p.getDistance() > me.track.trackLength) {
          // console.log(p.name, p.fatigue.toFixed(2));
          p.stop();
        }
      }
      if (runStatus.shootingPassed) {
        p.enterShootingRange(runStatus.shootingPassed);
      }
    } else if (p.shooting) {
      var shootingStatus = p.shoot();
      if (shootingStatus) {
        if (shootingStatus.length == 5) {
          me.results.pushShootingResult(p.getShortInfo(), p.rangeNum, shootingStatus);
          shootingStatus.forEach(shotRes => {
            if (!shotRes) {
              me.penaltyType ? p.addPenalty(me.track.penaltyLength) : p.addPenaltyTime(CONSTANT.PENALTY_MINUTE);
            }
          });
          p.quitShootingRange();
        }
      }
    }
    
  }
}
