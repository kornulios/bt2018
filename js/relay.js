class RelayRace extends Race {
  constructor() {
    var race = arguments[0],
      gender = arguments[1];

    super(race, gender);

    this.teams = [];

    // this.players = [];
    window.myRace = this;
  }

  initRoster(roster) {
    // roster - [ {team: %id, %name, [ $players ]} ]
    var number = 0;
    for (var team of roster) {
      var newTeam = {};
      newTeam.id = team.id;
      newTeam.name = team.name;
      newTeam.players = team.players;
      newTeam.leg = 0;
      newTeam.started = false;
      newTeam.switching = false;
      newTeam.number = number++;

      this.teams.push(newTeam);
    }
  }

  getPlayers() {
		return this.teams.map(team => { return team.players[team.leg] });
	}

  run(gameTick) {
    var teamRunning = false;
    var raceRunning = false;

    this.gameTimer += gameTick;

    //need to start using legs
    for (var team of this.teams) {
      if (!team.started) {
        team.started = true;
        team.players[team.leg].start();
      }
      if (team.switching) {
        team.players[team.leg].setDistance((this.track.getLapLength() * 3) * team.leg);
        team.players[team.leg].start();
        team.switching = false;
      }

      // main action
      var p = team.players[team.leg];
      if (p.started && !p.finished) {
        teamRunning = this.playerAct(team, p, gameTick);
        if (teamRunning) raceRunning = true;
      }
    }
    return raceRunning;
  }

  playerAct(team, player, gameTick) {

    if ((this.getRaceTime() % 60) == 0) player.recalculateStatus();

    if (player.running) {
      var runStatus = player.run(this.track, gameTick);

      if (runStatus.waypointPassed !== -1) {
        // this.results.pushResult(p.getShortInfo(), runStatus.waypointPassed, this.getRaceTime() - p.startTimer + p.penaltyTime);
        this.results.pushRelayResult(runStatus.waypointPassed, player.number, player.name, team.name, this.getRaceTime());

        player.makeDecision(); // ???

        if (runStatus.shootingPassed) {
          player.enterShootingRange(runStatus.shootingPassed, true);
        }

        if (player.getDistance() > (this.track.getLapLength() * 3) * (team.leg + 1)) {
          if (team.leg === 3) {   //finish
            player.stop();
            team.started = false;
            return false;
          } else {
            player.stop();
            team.leg++;
            team.switching = true;
            return true;
          }
        }
      }

    } else if (player.shooting) {
      var shootingStatus = player.shoot(gameTick, true);

      if (shootingStatus) {
        if (shootingStatus.finished) {
          // this.results.pushShootingResult(p.getShortInfo(), p.rangeNum, shootingStatus);
          this.results.pushShootingResultRelay(player.rangeNum, player.name, team.name, shootingStatus.result);
          shootingStatus.result.forEach(shootRes => {
            if (!shootRes) {
              player.addPenalty(this.track.penaltyLength);
            }
          });
          player.quitShootingRange();
        }
      }
    }

    return true;
  }

}