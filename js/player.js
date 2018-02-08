class Player {
  constructor(args) {
    this.speed = args.speed || 0;
    this.distance = 0;
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
    var _dp = (this.speed / 3600) * 1000;
    this.distance += Math.round(_dp * 100) / 100;
    // console.log(this.name, 'says: I\'m running with speed ' + this.speed, "Distance passed", this.distance, 'm');
  }

  getPlayer() {
    return {
      name: this.name,
      distance: this.distance.toFixed(2)
    }
  }
}

