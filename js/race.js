//Game controller

class Race {
	constructor(raceConfig, gender) {					// refactor with object for arguments
		this.track = new Track(raceConfig, gender);
		this.players = [];
		this.raceGender = gender;
		this.results = new Results(this);
		this.gameTimer = 0;
		this.status = 'Not started';
		this.raceType = raceConfig.type;
		this.startType = raceConfig.startType;
		this.penaltyType = raceConfig.penaltyType;

		//misc data
		this.name = raceConfig.stageName + ' ' + this.raceType + ' ' + this.track.getTrackLengthKm() + 'km' + ' ' + this.raceGender;
		// this.name = raceConfig.stageName;
	}

	initRoster(roster) {
		for (let p of roster) {
			this.players.push(p);
		}
	}

	getFinishResult() {
		return this.results.getWaypointResults(this.track.waypointsNum() - 1);
	}

	getPlayers() {
		return this.players;
	}

	getPlayerTeamMembers() {
		var team = game.getPlayerTeam(),
			resArray = [];

		this.players.forEach(function (p) {
			if (p.team.name == team) {
				resArray.push(p);
			}
		});
		return resArray;
	}

	getRaceName() {
		return this.name;
	}

	getRaceStatus() {
		return this.status;
	}

	setRaceStatus(status) {
		if (status) {
			this.status = status;
		}
	}

	getRaceTime() {
		return (this.gameTimer / 1000).toFixed(1);
	}

	run(gameTick) {			// 1 tick race progress
		var me = this,
			runningPlayers = false,
			raceRunning = false;

		me.gameTimer += gameTick;

		for (var p of me.players) {
			if (!p.started && me.getRaceTime() >= p.startTimer) {
				p.start();
				if (me.startType == CONSTANT.RACE_START_TYPE.PURSUIT) p.startTimer = 0;   //TODO rework ??????????
			}
			// main action
			if (p.started && !p.finished) {
				runningPlayers = me.playerAct(p, gameTick);
				if (runningPlayers) {
					raceRunning = true;
				}
			}
		}
		return raceRunning;
	}

	playerAct(p, gameTick) {
		var me = this;
		var recalcStats = (me.getRaceTime() % 60) == 0;			// ???? TODO refactor

		if (recalcStats) {
			p.recalculateStatus();
		}

		if (p.running) {
			var runStatus = p.run(me.track, gameTick);

			if (runStatus.waypointPassed !== -1) {
				me.results.pushResult(p.getShortInfo(), runStatus.waypointPassed, this.getRaceTime() - p.startTimer + p.penaltyTime);
				p.makeDecision();
				if (p.getDistance() > me.track.trackLength) {
					p.stop();
				}
			}
			if (runStatus.shootingPassed) {
				p.enterShootingRange(runStatus.shootingPassed);
			}
			// Add Finish check here

			//
		} else if (p.shooting) {
			var shootingStatus = p.shoot(gameTick);
			if (shootingStatus) {
				if (shootingStatus.finishedShooting) {
					me.results.pushShootingResult(p.getShortInfo(), p.rangeNum, shootingStatus.result);
					shootingStatus.result.forEach(shotRes => {
						if (!shotRes) {
							me.penaltyType ? p.addPenalty(me.track.penaltyLength) : p.addPenaltyTime(CONSTANT.PENALTY_MINUTE);
						}
					});
					p.quitShootingRange();
				}
			}
		}
		return p.finished == false;
	}
}
