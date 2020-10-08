import * as Constants from "../constants/constants.js";
import { teamData } from "../data.js";

let canvas = document.querySelector("#main-canvas");
let resultCanvas = document.querySelector("#result-canvas");

let fpsDrops = 0;

export class Graphic2D {
  constructor() {
    this.img = new Image();
    this.img.src = "../../static/map.gif";

    this.resultContext = resultCanvas.getContext("2d");

    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = resultCanvas.width;
    this.offscreenCanvas.height = resultCanvas.height;
    this.offscreenContext = this.offscreenCanvas.getContext("2d");
  }

  finalFPSDrops() {
    console.log("FPS drops:" + fpsDrops);
  }

  drawGameTick(tick) {
    let ctx = canvas.getContext("2d");

    ctx.textAlign = "left";
    ctx.fillStyle = "#000000";
    if (1000 / tick < 60) {
      fpsDrops++;
    }
    ctx.fillText("FPS: " + (1000 / tick).toFixed(0), 10, 10);
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

    // ctx.drawImage(img, 10, 10, canvas.width - 20, canvas.height - 20);

    this.drawCoordinatesMap(coordsMap, "#ffdd00");
    this.drawCoordinatesMap(penaltyCoordsMap, "green");
    this.drawCoordinatesMap(finishCoordsMap, "red");

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

  drawPlayersBeta(playersData) {
    let ctx = canvas.getContext("2d");
    let shootingNum = 0;

    for (let i = 0; i < playersData.length; i++) {
      if (playersData[i].coords) {
        try {
          const { x, y } = playersData[i].coords;
          const { team, number } = playersData[i];

          this.drawPlayerBub(ctx, number, team, x, y, 9);

          //render shooting range
          ctx.beginPath();
          if (playersData[i].status === Constants.PLAYER_STATUS.SHOOTING || playersData[i].rangeTimer) {
            const fontHeight = 14;

            ctx.fillStyle = playersData[i].rangeTimer ? "#000099" : "#0033cc";
            ctx.strokeStyle = "#999999";
            ctx.strokeWidth = "1px";
            ctx.fillRect(720, 20 * shootingNum, 80, 18);
            ctx.strokeRect(640, 20 * shootingNum, 80, 18);

            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "left";
            ctx.font = "14px Open Sans";
            ctx.fillText(playersData[i].name, 723, 20 * shootingNum + 14);

            for (let target = 0; target < 5; target++) {
              ctx.beginPath();
              ctx.fillStyle = "#000000";
              ctx.strokeStyle = "#000000";
              ctx.arc(653 + 13 * target, 20 * shootingNum + 10, 5, 0, 360);
              if (playersData[i].range[target]) {
                ctx.stroke();
              } else {
                ctx.fill();
              }
            }

            shootingNum++;
          }
        } catch {
          debugger;
        }
      }
    }
  }

  drawIntermediateResults(resultsData) {
    // let ctx = resultCanvas.getContext("2d");
    let ctx = this.offscreenContext;

    ctx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);

    for (let i = 0; i < resultsData.length; i++) {
      this.drawIntermediateResultItem(ctx, i, resultsData[i]);
    }

    this.resultContext.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
    this.resultContext.drawImage(this.offscreenCanvas, 0, 0);
  }

  drawIntermediateResultItem(ctx, index, result) {
    const x = Math.floor(index / 5) * 200;
    const y = (index % 5) * 22;

    ctx.beginPath();
    ctx.fillStyle = "#fff017";
    ctx.fillRect(x, y, 20, 20);

    ctx.fillStyle = "black";
    ctx.font = "bold 12px Open Sans";
    ctx.textAlign = "center";
    ctx.fillText(index + 1, x + 10, y + 16);

    this.drawPlayerBub(ctx, result.playerNumber, result.team, x + 32, y + 10, 8);

    ctx.font = "14px Open Sans";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.fillText(result.playerName, x + 44, y + 16);

    ctx.textAlign = "right";
    ctx.fillText(result.timeString, x + 180, y + 16);
  }

  drawPlayerBub(ctx, number, team, x, y, size) {
    const colors = teamData.find((t) => t.shortName === team).colors;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);

    ctx.fillStyle = colors[0];
    ctx.strokeStyle = "#000000";

    ctx.fill();
    ctx.stroke();

    //render text
    ctx.strokeWidth = "2px";
    ctx.fillStyle = colors[1];
    ctx.font = "bold 10px Verdana";
    ctx.textAlign = "center";

    if (number <= 9) {
      ctx.fillText(number, x, y + 3.25);
    } else if (number > 9 && number < 99) {
      ctx.fillText(number, x, y + 3.25);
    } else if (number >= 99) {
      ctx.font = "8px Verdana";
      ctx.fillText(number, x, y + 3.25);
    }
  }
}
