
let canvas = document.querySelector('#main-canvas');


export class Graphic2D {

  drawGameTick(tick) {
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillText('FPS: ' + (1000 / tick), 620, 50);
  }

  drawMapBeta(trackCoords, penaltyCoords) {
    let ctx = canvas.getContext("2d");
    let img = new Image();
    img.src = '../../static/map.gif';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img, 10, 10, canvas.width - 20, canvas.height - 20);


    ctx.beginPath();
    ctx.moveTo(trackCoords[0].coords.x, trackCoords[0].coords.y);

    for (let i = 1; i < trackCoords.length; i++) {
      ctx.lineTo(trackCoords[i].coords.x, trackCoords[i].coords.y);
    }
    ctx.lineTo(trackCoords[0].coords.x, trackCoords[0].coords.y);
    ctx.strokeStyle = "#ffdd00";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(penaltyCoords[0].coords.x, penaltyCoords[0].coords.y);

    for (let i = 1; i < penaltyCoords.length; i++) {
      ctx.lineTo(penaltyCoords[i].coords.x, penaltyCoords[i].coords.y);
    }
    ctx.lineTo(penaltyCoords[0].coords.x, penaltyCoords[0].coords.y);
    ctx.strokeStyle = "green";
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.strokeRect(202.5, 204.5, 6, 12);
    ctx.fillRect(202.5, 204, 3, 3);
    ctx.fillRect(205.5, 207, 3, 3);
    ctx.fillRect(202.5, 210, 3, 3);
    ctx.fillRect(205.5, 213, 3, 3);
  }


  drawPlayersBeta(playerCoords) {
    let ctx = canvas.getContext("2d");

    for (let i = 0; i < playerCoords.length; i++) {
      if (playerCoords[i]) {
        const { x, y } = playerCoords[i].coords;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);

        ctx.fillStyle = "#ffc7f0";
        ctx.strokeStyle = "#000000";

        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#000000";
        ctx.font = '12px Consolas';
        if (i <= 8) {
          ctx.fillText(i + 1, x - 3.25, y + 3.25);
        } else if (i > 8 && i < 99) {
          ctx.fillText(i + 1, x - 7, y + 3.25);
        } else if (i >= 99) {
          ctx.font = '10px Consolas';
          ctx.fillText(i + 1, x - 7, y + 3.25);
        }
      }
    }


  }

}