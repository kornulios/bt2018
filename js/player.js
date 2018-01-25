class Player {
  constructor(args) {
    this.speed = args.speed || 0;
    this.x = 0;
    this.y = 0;
    this.name = args.name || 'unknown';
  }

  setSpeed(speed) {
    return this.speed = speed;
  }

  getCoords() {
    return {x: this.x, y: this.y};
  }

  run() {
    console.log(this.name, 'says: I\'m running with speed ' + this.speed);
  }
}

