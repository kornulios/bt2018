export class ControlButton {
  constructor(config) {
    // this.ctx = config.ctx;
    this.x = config.x;
    this.y = config.y;
    this.icon = config.icon || "";
    this.playerId = config.playerId;

    this.render = this.render.bind(this);
  }

  render(ctx) {
    // const { ctx } = this;

    ctx.fillStyle = "white";
    ctx.strokeStyle = "#193B5A";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
}
