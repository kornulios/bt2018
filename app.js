console.log('up and running');

function player() {
  this.speed = 10,
  this.x = 0,
  this.y = 0;
  this.distance = 0;
  this.onTrack = false;
  this.track = [];

  this.getPlayer = function() {
    return this;
  }
}

player.prototype.start = function(trackMap) {
  this.distance = 0;
  this.onTrack = true;
}

player.prototype.finish = function() {
  this.onTrack = false;
}

player.prototype.run = function(trackMap) {
  console.log('Im running with speed ' + this.speed);
}

player.prototype.setSpeed = function(speed) {
  return this.speed = speed;
}

player.prototype.getCoords = function() {
  return { x: this.x, y: this.y };
}

var p1 = new player();
p1.setSpeed(20);

p1.run();

console.log(p1.getPlayer());