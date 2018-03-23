class Player {
  constructor(args) {
    this.baseSpeed = args.speed || 0; // km/h
    this.speed = this.baseSpeed;
    this.distance = 0;
    this._dp = 0;
    this.x = 0;
    this.y = 0;
    this.penalty = 0;
    this.misses = 0;
    this.name = args.name || 'unknown';
    this.running = true;
    this.shooting = false;
    this.rifle = {};
    this.status = 'Not run';
  }

  setSpeed(speed) {
    return this.speed = speed;
  }

  getCoords() {
    return { x: this.x, y: this.y };
  }

  addPenalty(length) {
    this.penalty += length;
    return this.penalty;
  }

  run(track) {
    this._dp = (this.speed / 3600) * 1000;
    if (this.penalty <= 0) {
      this.status = 'Running';
      this.distance += Math.round(this._dp * 100) / 100;
    } else {
      this.status = 'Penalty Lap';
      this.penalty -= Math.round(this._dp * 100) / 100;
      this._dp = 0;
    }
    let runStatus = {
      waypointPassed: track.isWaypointPassed(this.distance, this._dp),
      shootingPassed: track.passShootingRange(this.distance, this._dp)
    };
    return runStatus;
  }

  shoot() {
    let shootingStatus = true;
    //enter range
    if (!this.shooting) {
      this.status = 'Shooting';
      this.shooting = true;
      this.running = false;
      this.rifle = {
        ammo: 5,
        aimTime: Math.random()
      }
      return shootingStatus;
    }

    this.rifle.aimTime -= 0.1;

    if (this.rifle.aimTime < 0.1) {
      // fire
      this.rifle.ammo -= 1;
      if (Math.random() < 0.2) {
        this.misses++;
        shootingStatus = false;
      }
      this.rifle.aimTime = Math.random();
    }
    if (this.rifle.ammo == 0) {
      this.shooting = false;
      this.running = true;
      this.rifle = {};
    }
    return shootingStatus ? 'ok' : 'missed';
  }

  stop() {
    this.running = false;
    this.status = 'Finished';
    this._dp = 0;
    return this.speed = 0;
  }

  getDistance() {
    return this.distance;
  }

  getPlayer() {
    return {
      name: this.name,
      distance: this.distance.toFixed(2),
      dp: this._dp,
      speed: this.speed,
      misses: this.misses,
      status: this.running ? "Running" : (this.shooting ? "Shooting(" + this.rifle.ammo + ")" : "Finished")
    }
  }
}

