function Player(args) {
  this.speed = args.speed,
  this.x = 0,
  this.y = 0;
  this.distance = 0;
  this.onTrack = false;
  this.track = [];

  this.getPlayer = function() {
    return this;
  }
}

Player.prototype.start = function(trackMap) {
  this.distance = 0;
  this.onTrack = true;
}

Player.prototype.finish = function() {
  this.onTrack = false;
}

Player.prototype.run = function(trackMap) {
  console.log('Im running with speed ' + this.speed);
}

Player.prototype.setSpeed = function(speed) {
  return this.speed = speed;
}

Player.prototype.getCoords = function() {
  return { x: this.x, y: this.y };
}
