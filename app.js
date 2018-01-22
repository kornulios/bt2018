console.log('up and running');

function player() {
  this.speed = 10,
  this.x = 0,
  this.y = 0;
}

player.prototype.run = function() {
  console.log('Im running with speed ' + this.speed);
}

player.prototype.setSpeed = function(speed) {
  return this.speed = speed;
}

var p1 = new player();
p1.setSpeed(20);

p1.run();