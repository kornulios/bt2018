export class ControlButton {
  constructor(config) {
    this.icon = config.icon || "";
    this.x = config.x;
    this.y = config.y;
    this.radius = 12;

    //player information
    this.playerId = config.playerId;
    this.action = config.action;

    this.render = this.render.bind(this);
  }

  isClicked(x, y) {
    return Math.sqrt((this.x - x) * (this.x - x) + (this.y - y) * (this.y - y)) < this.radius;
  }

  render(ctx) {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "#193B5A";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
}
