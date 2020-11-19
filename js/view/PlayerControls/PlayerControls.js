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
        newData[i].time !== this.data[i].time ||
        newData[i].fatigue !== this.data[i].fatigue
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
      this.drawPlayerControlItem(ctx, players[i], 0, i * 70);
    }
  }

  drawPlayerControlItem(ctx, data, x, y) {
    //background
    const gradient = ctx.createLinearGradient(0, 0, 280, 0);
    gradient.addColorStop(0, "#193B5A");
    gradient.addColorStop(1, "#3176B3");
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, 280, 24);

    ctx.fillStyle = "#D2EAFF";
    ctx.fillRect(x, y + 24, 280, 38);

    PlayerBub.draw(ctx, data.number, data.team, x + 15, y + 12, 8);

    // misses bub
    ctx.beginPath();
    ctx.fillStyle = "#00305A";
    ctx.arc(130, y + 12, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    // player name
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = "14px Open sans";
    ctx.fillText(data.name, x + 30, y + 6);
    // misses number
    ctx.font = "bold 12px Bahnschrift";
    ctx.fillText(data.shootingTotal, 127, y + 6);

    //waypoint + time text
    ctx.textAlign = "right";
    ctx.font = "italic 10px Open sans";
    ctx.fillText(data.lastWaypoint, 190, y + 11);

    ctx.font = "14px Open sans";
    ctx.fillText(data.time, 276, y + 6);
    ctx.closePath();

    // position square
    ctx.beginPath();
    ctx.fillStyle = "#fff017";
    ctx.fillRect(200, y + 2, 20, 20);
    // position text
    ctx.textAlign = "center";
    ctx.font = "bold 16px Bahnschrift";
    ctx.fillStyle = "#000000";
    ctx.fillText(data.place, 210, y + 4);
    ctx.closePath();

    // speed info
    ctx.fillStyle = "#193B5A";
    ctx.font = "bold italic 14px Open sans";
    ctx.textAlign = "left";
    ctx.fillText(data.currentSpeed.toFixed(2), 156, y + 42);
    ctx.font = "bold italic 9px Open sans";
    ctx.fillText("km/h", 194, y + 46);

    // stats info
    ctx.font = "bold 10px Open sans";
    ctx.textAlign = "right";
    ctx.fillText("STR: " + data.strength, 275, y + 33);
    ctx.fillText("ACC: " + data.accuracy, 275, y + 43);
    
    // fatigue bar
    ctx.fillStyle = "#193B5A";
    ctx.fillRect(0, y + 24, 280, 5);
    ctx.fillStyle = this.getBarColorHex(data.fatigue);
    ctx.fillRect(0, y + 24, (data.fatigue * 280) / 100, 5);
  }

  getBarColorHex(percent) {
    if (percent > 50) {
      const redW = (100 - percent) * 2;
      const red = (255 * redW) / 100;

      return `rgb(${red}, 255, 0)`;
    } else {
      const greenW = percent * 2;
      const green = (255 * greenW) / 100;

      return `rgb(255, ${green}, 0)`;
    }
  }
}
