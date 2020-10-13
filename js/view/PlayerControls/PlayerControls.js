import { PlayerBub } from "../PlayerBub/PlayerBub.js";

export class PlayerControls {
  constructor() {
    this.data = [];
  }

  compareControls(newData) {
    if (!this.data.length) {
      this.data = newData;
      return false;
    }

    for (let i = 0; i < newData.length; i++) {
      if (
        newData[i].place !== this.data[i].place ||
        newData[i].lastWaypoint !== this.data[i].lastWaypoint ||
        newData[i].time !== this.data[i].time
      ) {
        this.data = newData;
        return false;
      }
    }

    return true;
  }

  draw(ctx, players) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let i = 0; i < players.length; i++) {
      this.drawPlayerControlItem(ctx, players[i], 10, i * 65 + 10);
    }
  }

  drawPlayerControlItem(ctx, data, x, y) {
    
    PlayerBub.draw(ctx, data.number, data.team, x + 16, y + 14);

    ctx.beginPath();
    ctx.strokeStyle = "#cccccc";
    ctx.strokeWidth = "1px";
    ctx.strokeRect(x, y, ctx.canvas.width - 20, 60);
    ctx.font = "14px Open sans";
    ctx.fillStyle = "black";


    ctx.textAlign = "left";
    ctx.fillText(data.name, x + 30, y + 18);

    ctx.textAlign = "right";
    ctx.fillText(data.lastWaypoint, 180, y + 18);
    ctx.fillText(data.time, 280, y + 18);
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "#fff017";
    ctx.fillRect(200, y + 4, 20, 20);

    ctx.textAlign = "center";
    ctx.font = "bold 14px Open sans";
    ctx.fillStyle = "#000000";
    ctx.fillText(data.place, 210, y + 18);
    ctx.closePath();
  }
}
