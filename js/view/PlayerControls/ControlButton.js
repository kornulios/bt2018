import ButtonSprites from "../../../static/ButtonSprites.png";

const spriteSize = 40;

export class ControlButton {
  constructor(config) {
    this.ctx = config.ctx;
    this.icon = config.icon || "";
    this.x = config.x;
    this.y = config.y;
    this.radius = 12;

    this.sprite = new Image();
    // this.sprite.onload = () => {
    //   this.render();
    // };
    this.sprite.src = ButtonSprites;

    //player information
    this.playerId = config.playerId;
    this.action = config.action;

    this.render = this.render.bind(this);
  }

  isClicked(x, y) {
    return (
      Math.sqrt(
        (this.x + this.radius - x) * (this.x + this.radius - x) +
          (this.y + this.radius - y) * (this.y + this.radius - y)
      ) < this.radius
    );
  }

  render(isActive) {
    const frameHeight = isActive ? spriteSize : 0;
    this.ctx.drawImage(this.sprite, 0 + this.action * spriteSize, frameHeight, 40, 40, this.x, this.y, 24, 24);
  }
}
