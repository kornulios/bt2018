class Player {
	constructor(args) {
		//base stats
		this.baseSpeed = this.currentSpeed = args.speed || Util.rand(2500, 1900) / 100; // km/h
		this.name = args.name || 'unknown';
		this.team = args.team || 'Missing team';
		this.gender = args.gender || 'unknown';
		this.index = args.index;
		this.accuracy = args.accuracy || Util.rand(99, 70);
		this.strength = args.strength || Util.rand(99, 75);
		this.stamina = args.stamina || Util.rand(99, 30);
		this.fatigue = 100;
		this.technique = args.technique || Util.rand(99, 50);
		this.points = 0;

		//distance related
		this.distance = 0;
		// this._dp = 0;
		this.penalty = 0;
		this.penaltyTime = 0;

		//race related
		this.status = 'Not run';
		this.started = false;
		this.finished = false;
		this.running = false;
		this.shooting = false;
		this.startTimer = args.startTimer;
		this.rangeNum = 0;
		this.currentRange = [];
		this.rifle = {};
		this.speedMod = 1;

		//AI related
		this.aiBehaviour = args.aiBehaviour || CONSTANT.AI.NORMAL;
		this.state = CONSTANT.RUNSTATE.NORMAL;

	}

	static create(name, team, gender) {
		return new Player({name, team, gender});
	}

	getShortInfo() {
		return {
			name: this.name,
			team: this.team,
			number: this.number
		};
	}

	getRaceStats() {
		return {
			number: this.number,
			name: this.name,
			team: this.team,
			status: this.status,
			distance: this.distance.toFixed(2),
			speed: this.currentSpeed.toFixed(2),
			stamina: this.fatigue.toFixed(2)
		}
	}

	setSpeed(speed) {
		return this.currentSpeed = speed;
	}

	getCoords() {
		return { x: this.x, y: this.y };
	}

	getAccuracy() {
		return this.accuracy;
	}

	getDistance() {
		return this.distance;
	}

	setDistance(newDistance) {		//required for relay placement
		this.distance = newDistance;
	}

	addPenalty(length) {
		this.penalty += length;
		return this.penalty;
	}

	addPenaltyTime(time) {
		this.penaltyTime += time;
	}

	run(track, elapsedTime) {
		//move forward on track
		var fps = elapsedTime, 
		distancePassed = (this.currentSpeed / 3600) * fps;   // m/ms

		if (this.penalty <= 0) {
			this.status = 'Running';
			this.distance += distancePassed;
		} else {
			this.status = 'Penalty';
			this.penalty -= distancePassed;
			distancePassed = 0;
		}
		let runStatus = {
			waypointPassed: track.isWaypointPassed(this.distance, distancePassed),
			shootingPassed: track.passShootingRange(this.distance, distancePassed)
		};
		return runStatus;
	}

	enterShootingRange(range, relay) {
		//enter range
		var shootingStatus = true;
		if (!this.shooting) {
			this.rangeNum = range;
      this.currentRange = [0,0,0,0,0];
      this.nextTarget = 0;
			this.shooting = true;
			this.status = 'Range';
			this.running = false;
			this.rifle = {
				ammo: relay ? 8 : 5,
				aimTime: 20 * 60
			}
			return shootingStatus;
		}
	}

	quitShootingRange() {
		this.shooting = false;
		this.running = true;
		this.rifle = {};
	}

	shoot(elapsedTime, relay) {
		var finishedShooting = false;
		this.rifle.aimTime -= elapsedTime;	// !!!!!

		if (this.rifle.aimTime > 0) {
			return false;
		}

		this.status = 'Shooting';
		this.rifle.ammo -= 1;
		this.rifle.aimTime = Util.rand(6, 2) * 60;
		if (Util.rand(100, 0) < this.accuracy) {
      this.currentRange[this.nextTarget] = 1; /// GOOD!
    }
    
    if (relay && this.rifle.ammo <= 3 && this.currentRange.indexOf(0) > -1) {
      this.nextTarget = this.currentRange.indexOf(0);
    } else {
      this.nextTarget++;
    }

    //leaves range only if all targets are closed OR run out of ammo
    if (this.currentRange.indexOf(0) === -1 || this.rifle.ammo < 1) finishedShooting = true;

		return {finishedShooting: finishedShooting, result: this.currentRange};
	}

	start() {
		this.running = true;
		this.started = true;
		this.finished = false;
		this.shooting = false;
	}

	stop() {
		this.running = false;
		this.finished = true;
		this.status = 'Finished';
		this.currentSpeed = 0;
	}

	reset() {
		this.currentSpeed = this.baseSpeed;
		this.fatigue = 100;
		this.distance = 0;
		this.penalty = 0;
		this.penaltyTime = 0;
		this.started = false;
		this.finished = false;
		this.running = false;
		this.shooting = false;
		this.rangeNum = 0;
		this.rifle = {};
		this.state = CONSTANT.RUNSTATE.NORMAL;
		this.status = 'Not run';
		return this;
	}

	recalculateStatus() {
		//FATIGUE
		if (this.running) {
			var newSpeed = this.baseSpeed * this.speedMod * Math.pow((this.fatigue / 100), 0.33);
			switch (this.state) {
				case CONSTANT.RUNSTATE.EASE:
					this.fatigue = this.fatigue * (1 - 0.0001);
					break;
				case CONSTANT.RUNSTATE.NORMAL:
					this.fatigue = this.fatigue * (1 - 0.0002);
					break;
				case CONSTANT.RUNSTATE.PUSHING:
					this.fatigue = this.fatigue * (1 - 0.0004);
					break;
			}

			this.setSpeed(newSpeed);
		}

		if (this.shooting) {
			this.fatigue = this.fatigue * (1 + 0.0004);
		}

		if (debugProfiler[this.name]) {
			debugProfiler[this.name].push([newSpeed, this.fatigue, this.currentSpeed]);
		} else {
			debugProfiler[this.name] = [newSpeed, this.fatigue];
		}
	}

	//AI 
	makeDecision() {
		var me = this,
			newSpeed = me.baseSpeed,
			dice = Util.rand(100),
			aggro = me.aiBehaviour[0],
			norm = aggro + me.aiBehaviour[1],
			choise;
		// var choise = Math.floor(Math.random() * Object.keys(CONSTANT.RUNSTATE).length);

		//make ai decide
		if (dice < aggro) {
			choise = CONSTANT.RUNSTATE.PUSHING;
			this.speedMod = 1 + (CONSTANT.BASE_SPEED_MOD + (me.strength / 1000));
			// newSpeed = me.baseSpeed * (1 + (CONSTANT.BASE_SPEED_MOD + (me.strength / 1000)));
		} else if (dice > norm) {
			choise = CONSTANT.RUNSTATE.EASE;
			this.speedMod = 1 - (CONSTANT.BASE_SPEED_MOD + ((100 - me.strength) / 1000));
			// newSpeed = me.baseSpeed * (1 - (CONSTANT.BASE_SPEED_MOD + ((100 - me.strength) / 1000)));
		} else {
			choise = CONSTANT.RUNSTATE.NORMAL;
		}
		me.state = choise;
	}
}

