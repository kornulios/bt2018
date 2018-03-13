class Player {
  constructor(args) {
    this.speed = args.speed || 0; // km/h
    this.distance = 0;
    this._dp = 0;
    this.x = 0;
    this.y = 0;
    this.name = args.name || 'unknown';
    this.running = true;
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

  stop() {
    this.running = false;
    this._dp = 0;
    return this.speed = 0;
  }

  running() {
    return this.running;
  }

  getDistance() {
    return this.distance;
  }

  getPlayer() {
    return {
      name: this.name,
      distance: this.distance.toFixed(2),
      dp: this._dp
    }
  }
}

