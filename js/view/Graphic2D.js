
export class Graphic2D {

  drawMapBeta(playerCoords) {
    let canvas = document.querySelector('#main-canvas');
    let ctx = canvas.getContext("2d");

    const lineY = 57.5;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(42.5, lineY);
    ctx.lineTo(550, lineY);
    ctx.moveTo(2500 / 15 + 50, lineY);
    ctx.lineTo(2500 / 15 + 50, lineY - 15);
    ctx.moveTo(5000 / 15 + 50, lineY);
    ctx.lineTo(5000 / 15 + 50, lineY - 15);
    ctx.stroke();

    for (let i = 0; i < playerCoords.length; i++) {
      ctx.beginPath();
      ctx.arc(playerCoords[i].x, 50, 7.5, 0, Math.PI * 2);

      ctx.fillStyle = "#ffc7f0";
      ctx.strokeStyle = "#000000";

      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#000000";
      ctx.font = '12px Consolas';
      if (i <= 8) {
        ctx.fillText(i + 1, playerCoords[i].x - 3.25 , 53.75);
      } else if (i > 8 && i < 99) {
        ctx.fillText(i + 1, playerCoords[i].x - 7 , 53.75);
      } else if (i>=99) {
        ctx.font = '10px Consolas';
        ctx.fillText(i + 1, playerCoords[i].x - 7 , 53.75);
      }
    }


  }

}