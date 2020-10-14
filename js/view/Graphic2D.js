import * as Constants from "../constants/constants.js";
import { teamData } from "../data.js";
import { IntermediateResults } from "./IntermediateResults/IntermediateResults.js";
import { PlayerControls } from "./PlayerControls/PlayerControls.js";

import MapBackground from "../../static/background_image.png";
import FlagIcon from "../../static/track_flag.png";

// import Flag from '../../static/flags/flag1.svg';
import { flagImages } from "../services/flagService";

let canvas = document.querySelector("#main-canvas");
let resultCanvas = document.querySelector("#result-canvas");
let controlsCanvas = document.querySelector("#controls-canvas");

let fpsDrops = 0;

export class Graphic2D {
  constructor() {
    this.img = new Image();
    this.img.src = MapBackground;
    this.flagImg = new Image();
    this.flagImg.src = FlagIcon;

    this.flagImages = Object.keys(flagImages).map((name, i) => {
      const img = new Image();
      img.src = flagImages[name];
      return img;
    });

    this.resultContext = resultCanvas.getContext("2d");
    this.controlsCtx = controlsCanvas.getContext("2d");

    this.offscreenCanvas = document.createElement("canvas");
    this.offscreenCanvas.width = resultCanvas.width;
    this.offscreenCanvas.height = resultCanvas.height;
    this.offscreenContext = this.offscreenCanvas.getContext("2d");

    this.offscreenControlsCanvas = document.createElement("canvas");
    this.offscreenControlsCanvas.width = controlsCanvas.width;
    this.offscreenControlsCanvas.height = controlsCanvas.height;
    this.offscreenControlsContext = this.offscreenControlsCanvas.getContext("2d");

    this.intermediateResults = new IntermediateResults();
    this.playerControls = new PlayerControls();
  }

  initRaceCanvas() {
    this.resultContext.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
    this.controlsCtx.clearRect(0, 0, controlsCanvas.width, controlsCanvas.height);
  }

  finalFPSDrops() {
    console.log("FPS drops:" + fpsDrops);
  }

  drawGameTick(tick) {
    let ctx = canvas.getContext("2d");

    ctx.textAlign = "left";
    ctx.fillStyle = "#000000";
    if (1000 / tick < 100) {
      console.log("fps drop");
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
    const { coordsMap, penaltyCoordsMap, finishCoordsMap, flagsCoords } = track;
    let ctx = canvas.getContext("2d");
    const { img } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ctx.drawImage(img, 10, 10, canvas.width - 20, canvas.height - 20);

    this.drawCoordinatesMap(coordsMap, "#ffdd00");
    this.drawCoordinatesMap(penaltyCoordsMap, "green");
    this.drawCoordinatesMap(finishCoordsMap, "red");

    //draw waypoint flags
    flagsCoords.forEach((flag) => {
      ctx.drawImage(this.flagImg, flag.x, flag.y - this.flagImg.height);
    });

    //start / finish line
    // ctx.beginPath();
    // ctx.strokeStyle = "#000000";
    // ctx.fillStyle = "#000000";
    // ctx.lineWidth = 1;
    // ctx.strokeRect(202.5, 204.5, 6, 12);
    // ctx.fillRect(202.5, 204, 3, 3);
    // ctx.fillRect(205.5, 207, 3, 3);
    // ctx.fillRect(202.5, 210, 3, 3);
    // ctx.fillRect(205.5, 213, 3, 3);

    // ctx.beginPath();
    // ctx.strokeStyle = "#000000";
    // ctx.fillStyle = "#000000";
    // ctx.lineWidth = 1;
    // ctx.strokeRect(222.5, 224.5, 6, 12);
    // ctx.fillRect(222.5, 224, 3, 3);
    // ctx.fillRect(225.5, 227, 3, 3);
    // ctx.fillRect(222.5, 230, 3, 3);
    // ctx.fillRect(225.5, 233, 3, 3);
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
            ctx.closePath();
          }
        } catch {
          debugger;
        }
      }
    }
  }

  drawIntermediateResults(resultsData, offset) {
    let ctx = this.offscreenContext;
    let mainCtx = this.resultContext;

    if (this.intermediateResults.compareResults(resultsData)) {
      return;
    }

    this.intermediateResults.draw(ctx, resultsData);
    mainCtx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
    mainCtx.drawImage(this.offscreenCanvas, 0, 0);
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
      ctx.font = "bold 8px Verdana";
      ctx.fillText(number, x, y + 3.25);
    }
  }

  drawPlayerControls(players) {
    let offscreenCtx = this.offscreenControlsContext;
    let ctx = this.controlsCtx;

    if (this.playerControls.compareControls(players)) {
      return;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.playerControls.draw(offscreenCtx, players);

    ctx.drawImage(this.flag1, 10, 100, 18, 13);
    ctx.drawImage(this.flag2, 10, 120, 18, 12);
    ctx.drawImage(this.offscreenControlsCanvas, 0, 0);
  }

  drawFlagTest() {
    let ctx = canvas.getContext("2d");
    for (let i = 0; i < this.flagImages.length; i++) {
      ctx.drawImage(this.flagImages[i], 0, i * 14, 18, 13);
    }
  }
}
