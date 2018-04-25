class Player {
  constructor(args) {
    //base stats
    this.baseSpeed = this.currentSpeed = args.speed || 0; // km/h
    this.name = args.name || 'unknown';
    this.index = args.index;
    this.accuracy = args.accuracy || 0.05;
    this.strength = args.strength || Util.rand(100, 45);
    this.stamina = args.stamina || Math.floor(Math.random() * (100-30) + 30);
    
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

    //AI related
    this.state = CONSTANT.RUNSTATE.NORMAL;
  }


  setSpeed(speed) {
    return this.currentSpeed = speed;
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
    //move distance
    this._dp = (this.currentSpeed / 3600) * 1000;
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
    return this.currentSpeed = 0;
  }

  reset() {
    this.currentSpeed = this.baseSpeed;
    this.distance = 0;
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
// debugger
    //calculate new speed
    let newSpeed = me.baseSpeed;
    let speedModifier = (Util.rand(30,10) / 100) * (me.strength / 100);
    if (choise == CONSTANT.RUNSTATE.EASE) newSpeed = me.baseSpeed * (1 - speedModifier);
    if (choise == CONSTANT.RUNSTATE.PUSHING) newSpeed = me.baseSpeed * (1 + speedModifier);
    
    me.setSpeed(newSpeed);
    me.state = choise;  //needed ???
  }
}

