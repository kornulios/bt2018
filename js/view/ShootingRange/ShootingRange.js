import { flagImages } from "../../services/flagService";

export class ShootingRange {
  constructor() {
    this.prevState = [];
    this.flagImages = flagImages();
  }

  // compare(newState) {
  //   const {prevState} = this;

  //   if (newState.length !== prevState.length) {
  //     this.prevState = newState;
  //     return false;
  //   }

  //   for(let i = 0; i < newState.length; i++) {
  //     if(newState[i].name !== prevState[i].name ||
  //       newState[i].)
  //   }
  // }

  draw(ctx, shootingPlayers) {
    const shootingPanelLeft = 0;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let i = 0; i < shootingPlayers.length; i++) {
      this.drawRangeItem(ctx, shootingPlayers[i], shootingPanelLeft, i * 20);
    }
  }

  drawRangeItem(ctx, player, x, y) {
    ctx.beginPath();

    const fontHeight = 14;

    ctx.fillStyle = player.rangeTimer ? "#000099" : "#0033cc";
    ctx.strokeStyle = "#999999";
    ctx.strokeWidth = "1px";
    ctx.strokeRect(x, y, 80, 18);
    ctx.fillRect(x + 80, y, 140, 18);
    ctx.drawImage(this.flagImages[player.team], x + 190, y + 2, 18, 12);

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.font = "14px Open Sans";
    ctx.fillText(player.name, x + 83, y + 14);

    for (let target = 0; target < 5; target++) {
      ctx.beginPath();
      ctx.fillStyle = "#000000";
      ctx.strokeStyle = "#000000";
      ctx.arc(x + 13 + 13 * target, y + 10, 5, 0, 360);

      if (player.range[target]) {
        ctx.stroke();
      } else {
        ctx.fill();
      }
    }
    ctx.closePath();
  }
}
