class Player {
  constructor(args) {
    //base stats
    this.baseSpeed = this.currentSpeed = args.speed || Util.rand(2200, 1600) / 100; // km/h
    this.name = args.name || 'unknown';
    this.team = args.team || 'Missing team';
    this.gender = args.gender || 'unknown';
    this.index = args.index;
    this.accuracy = args.accuracy || Util.rand(99, 70);
    this.strength = args.strength || Util.rand(99, 75);
    this.stamina = args.stamina || Util.rand(99, 30);
    this.fatigue = 100;
    this.technique = args.technique || Util.rand(99, 50);

    //distance related
    this.distance = 0;
    this._dp = 0;
    this.penalty = 0;
    this.penaltyTime = 0;

    //race related
    this.status = 'Not run';
    this.notstarted = true;
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

  getShortInfo() {
    return {
      name: this.name,
      team: this.team.shortName,
      number: this.number
    };
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

  addPenalty(length) {
    this.penalty += length;
    return this.penalty;
  }

  addPenaltyTime(time) {
    this.penaltyTime += time;
  }

  run(track) {
    //move distance

    if (this.penalty <= 0) {
      this.status = 'Running';
      this._dp = (this.currentSpeed / 3600) * 100;
      this.distance += (this._dp * 100) / 100;
    } else {
      this.status = 'Penalty';
      this._dp = ((this.currentSpeed) / 3600) * 100;
      this.penalty -= (this._dp * 100) / 100;
      this._dp = 0;
    }
    let runStatus = {
      waypointPassed: track.isWaypointPassed(this.distance, this._dp),
      shootingPassed: track.passShootingRange(this.distance, this._dp)
    };
    return runStatus;
  }

  enterShootingRange(range) {
    //enter range
    var shootingStatus = true;
    if (!this.shooting) {
      this.rangeNum = range;
      this.currentRange = [];
      this.shooting = true;
      this.status = 'Range';
      this.running = false;
      this.rifle = {
        ammo: 5,
        aimTime: Util.rand(25, 18)
      }
      return shootingStatus;
    }
  }

  quitShootingRange() {
    this.shooting = false;
    this.running = true;
    this.rifle = {};
  }

  shoot() {
    var hit;
    this.rifle.aimTime -= 0.1;

    if (this.rifle.aimTime > 0.1) {
      return false;
    }

    this.status = 'Shooting';
    this.rifle.ammo -= 1;
    this.rifle.aimTime = Util.rand(5, 1);
    if (Util.rand(100, 0) > this.accuracy) {
      hit = false;
    } else {
      hit = true;
    }
    this.currentRange.push(hit);
    return this.currentRange;
  }

  start() {
    this.running = true;
    this.notstarted = false;
    this.finished = false;
    this.shooting = false;
  }

  stop() {
    this.running = false;
    this.finished = true;
    this.status = 'Finished';
    this._dp = 0;
    return this.currentSpeed = 0;
  }

  reset() {
    this.currentSpeed = this.baseSpeed;
    this.fatigue = 100;
    this.distance = 0;
    this._dp = 0;
    this.penalty = 0;
    this.penaltyTime = 0;
    this.notstarted = true;
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

