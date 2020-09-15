let canvas = document.querySelector("#main-canvas");

export class Graphic2D {
  constructor() {
    this.img = new Image();
    this.img.src = "../../static/map.gif";
  }

  drawGameTick(tick) {
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillText("FPS: " + 1000 / tick, 620, 50);
  }

  drawCoordinatesMap(coordsMap, color) {
    let ctx = canvas.getContext("2d");
    ctx.beginPath();

    ctx.moveTo(coordsMap[0].coords.x, coordsMap[0].coords.y);

    for (let i = 1; i < coordsMap.length; i++) {
      ctx.lineTo(coordsMap[i].coords.x, coordsMap[i].coords.y);
    }
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  drawMapBeta(track) {
    const { coordsMap, penaltyCoordsMap, finishCoordsMap } = track;
    let ctx = canvas.getContext("2d");
    const { img } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img, 10, 10, canvas.width - 20, canvas.height - 20);

    this.drawCoordinatesMap(coordsMap, "#ffdd00");
    this.drawCoordinatesMap(penaltyCoordsMap, "green");
    this.drawCoordinatesMap(finishCoordsMap, "red");

    // ctx.beginPath();
    // ctx.moveTo(coordsMap[0].coords.x, coordsMap[0].coords.y);

    // for (let i = 1; i < coordsMap.length; i++) {
    //   ctx.lineTo(coordsMap[i].coords.x, coordsMap[i].coords.y);
    // }
    // ctx.strokeStyle = "#ffdd00";
    // ctx.stroke();

    // ctx.beginPath();
    // ctx.moveTo(penaltyCoords[0].coords.x, penaltyCoords[0].coords.y);

    // for (let i = 1; i < penaltyCoords.length; i++) {
    //   ctx.lineTo(penaltyCoords[i].coords.x, penaltyCoords[i].coords.y);
    // }
    // ctx.lineTo(penaltyCoords[0].coords.x, penaltyCoords[0].coords.y);
    // ctx.strokeStyle = "green";
    // ctx.stroke();

    //start / finish line
    ctx.beginPath();
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.strokeRect(202.5, 204.5, 6, 12);
    ctx.fillRect(202.5, 204, 3, 3);
    ctx.fillRect(205.5, 207, 3, 3);
    ctx.fillRect(202.5, 210, 3, 3);
    ctx.fillRect(205.5, 213, 3, 3);

    ctx.beginPath();
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.strokeRect(222.5, 224.5, 6, 12);
    ctx.fillRect(222.5, 224, 3, 3);
    ctx.fillRect(225.5, 227, 3, 3);
    ctx.fillRect(222.5, 230, 3, 3);
    ctx.fillRect(225.5, 233, 3, 3);
  }

  drawPlayersBeta(playerCoords) {
    let ctx = canvas.getContext("2d");

    for (let i = 0; i < playerCoords.length; i++) {
      if (playerCoords[i].coords) {
        try {
          const { x, y } = playerCoords[i].coords;
          const { colors } = playerCoords[i];

          //render player bub
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);

          ctx.fillStyle = colors[0] || "#ffc7f0";
          ctx.strokeStyle = "#000000";

          ctx.fill();
          ctx.stroke();

          //render text
          ctx.fillStyle = colors[1] || "#000000";
          ctx.font = "12px Consolas";
          if (i <= 8) {
            ctx.fillText(i + 1, x - 3.25, y + 3.25);
          } else if (i > 8 && i < 99) {
            ctx.fillText(i + 1, x - 7, y + 3.25);
          } else if (i >= 99) {
            ctx.font = "10px Consolas";
            ctx.fillText(i + 1, x - 7, y + 3.25);
          }
        } catch {
          debugger;
        }
      }
    }
  }
}
