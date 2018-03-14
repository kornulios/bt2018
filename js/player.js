class Player {
  constructor(args) {
    this.speed = args.speed || 0; // km/h
    this.distance = 0;
    this._dp = 0;
    this.x = 0;
    this.y = 0;
    this.name = args.name || 'unknown';
    this.running = true;
    this.shooting = false;
    this.rifle = {};
  }

  setSpeed(speed) {
    return this.speed = speed;
  }

  getCoords() {
    return {x: this.x, y: this.y};
  }

  run() {
    this._dp = (this.speed / 3600) * 1000;
    this.distance += Math.round(this._dp * 100) / 100;
  }

  shoot() {
    if(!this.shooting) {
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
      this.rifle.aimTime = Math.random();
      this.rifle.ammo -= 1;
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
      status: this.running ? "Running" : (this.shooting ? "Shooting(" + this.rifle.ammo + ")" : "Finished")
    }
  }
}

