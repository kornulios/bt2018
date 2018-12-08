//Game controller

class Race {
	constructor(newTrack, gender) {
		this.track = new Track(newTrack, gender);
		this.players = [];
		this.raceGender = gender;
		this.results = new Results(this);
		this.gameTimer = 0;
		this.status = 'Not started';
		this.startType = this.track.startType;
		this.penaltyType = this.track.penaltyType;

		//misc data
		this.name = newTrack.location + ' ' + this.track.raceType + ' ' + (this.track.getTrackLength() / 1000).toFixed(1) + 'km' + ' ' + this.raceGender;
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
		
		this.players.forEach(function(p) {
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

	getTime() {
		return (this.gameTimer / 1000).toFixed(1);
	}

	run(gameTick) {
		var me = this;

		if (me.status == 'Not started') {
			me.status = 'Started';
			return true;
		}
		if (me.status = 'Started') {
			me.gameTimer += gameTick;
			for (var p of me.players) {
				if (p.notstarted) {
					if (me.getTime() >= p.startTimer) {
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

		me.status = 'Finished';
		return false;
	}

	playerAct(p) {
		var me = this;
		var recalcStats = (me.gameTimer % 1) == 0;			// TODO refactor

		if (recalcStats) {
			p.recalculateStatus();
		}

		if (p.running) {

			var runStatus = p.run(me.track);

			if (runStatus.waypointPassed !== -1) {
				me.results.pushResult(p.getShortInfo(), runStatus.waypointPassed, this.getTime() - p.startTimer + p.penaltyTime);
				p.makeDecision();
				if (p.getDistance() > me.track.trackLength) {
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
