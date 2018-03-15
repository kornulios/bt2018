class Player {
  constructor(args) {
    this.speed = args.speed || 0; // km/h
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
    return {x: this.x, y: this.y};
  }

  addPenalty(length) {
    this.penalty += length;
    return this.penalty;
  }

  run(track) {
    this.status = 'Running';
    this._dp = (this.speed / 3600) * 1000;
    if (this.penalty < 0) {
      this.distance += Math.round(this._dp * 100) / 100;
    } else {
      this.penalty -= Math.round(this._dp * 100) / 100;
      this._dp = 0;
    }
    let runStatus = { waypointPassed: track.isWaypointPassed(this.distance, this._dp), distancePassed: this.distance };
    return runStatus;
  }

  shoot() {
    if(!this.shooting) {
      this.status = 'Shooting';
      this.shooting = true;
      this.running = false;
      this.rifle = {
        ammo: 5,
        aimTime: Math.random()
      }
      return;
    }
    this.rifle.aimTime -= 0.1;
    if (this.rifle.aimTime < 0.1) {
      // fire
      this.rifle.ammo -= 1;
      if (Math.random() < 0.2) {
        this.penalty += 50;
        this.misses++;
      }
      this.rifle.aimTime = Math.random();
    }
    if (this.rifle.ammo == 0) {
      this.shooting = false;
      this.running = true;
      this.rifle = {};
    }
  }

  stop() {
    // console.log(this.name + ' stopped');
    this.running = false;
    this._dp = 0;
    return this.speed = 0;
  }

  running() {
    return this.running;
  }

  shooting() {
    return this.shooting;
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

