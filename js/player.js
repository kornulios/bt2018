class Player {
  constructor(args) {
    //base stats
    this.baseSpeed = this.speed = args.speed || 0; // km/h
    this.name = args.name || 'unknown';
    this.index = args.index;
    
    //distance related
    this.distance = 0;
    this._dp = 0;
    this.penalty = 0;
    this.penaltyTime = 0;

    //race related
    this.notstarted = true;
    this.finished = false;
    this.running = false;
    this.shooting = false;
    this.startTimer = args.startTimer;
    this.rangeNum = 0;
    this.rifle = {};
    this.accuracy = args.accuracy || 0.05;

    //AI related
    this.state = CONSTANT.RUNSTATE.NORMAL;
  }


  setSpeed(speed) {
    return this.speed = speed;
  }

  getCoords() {
    return { x: this.x, y: this.y };
  }

  getAccuracy() {
    return 100 - this.accuracy.toFixed(2) * 100;
  }

  addPenalty(length) {
    this.penalty += length;
    return this.penalty;
  }

  addPenaltyTime(time) {
    this.penaltyTime += time;
  }

  run(track) {
    //calc speed
    let speedModifier = this.baseSpeed;
    if (this.state == CONSTANT.RUNSTATE.EASE) speedModifier = this.baseSpeed * 0.8;
    if (this.state == CONSTANT.RUNSTATE.PUSHING) speedModifier = this.baseSpeed * 1.2;
    this.speed = speedModifier;
    //move distance
    this._dp = (this.speed / 3600) * 1000;
    if (this.penalty <= 0) {
      this.status = 'Running';
      this.distance += Math.round(this._dp * 100) / 100;
    } else {
      this.status = 'Penalty';
      this.penalty -= Math.round(this._dp * 100) / 100;
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
    let shootingStatus = true;
    if (!this.shooting) {
      this.rangeNum = range;
      this.shooting = true;
      this.running = false;
      this.rifle = {
        ammo: 5,
        aimTime: Math.random()
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
    let hit;
    this.rifle.aimTime -= 0.1;
    if (this.rifle.aimTime > 0.1) {
      return false;
    }
    this.rifle.ammo -= 1;
    this.rifle.aimTime = Math.random();
    if (Math.random() < this.accuracy) {
      hit = false;
    } else {
      hit = true;
    }
    
    return {result: hit, shotNum: 5 - this.rifle.ammo};
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
    return this.speed = 0;
  }

  getDistance() {
    return this.distance;
  }

  // getPlayer() {
  //   return {
  //     name: this.name,
  //     distance: this.distance.toFixed(2),
  //     dp: this._dp,
  //     speed: this.speed,
  //     misses: this.misses,
  //     status: this.running ? "Running" : (this.shooting ? "Shooting(" + this.rifle.ammo + ")" : "Finished")
  //   }
  // }

  //AI 
  makeDecision() {
    let me = this;
    let choise = Math.floor(Math.random() * Object.keys(CONSTANT.RUNSTATE).length);
    me.state = choise;
  }
}

