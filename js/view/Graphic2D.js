import * as Constants from "../constants/constants.js";
import { teamData } from "../data.js";
import { IntermediateResults } from "./IntermediateResults/IntermediateResults.js";
import { PlayerControls } from "./PlayerControls/PlayerControls.js";
import { ShootingRange } from "./ShootingRange/ShootingRange";

import MapBackground from "../../static/background_image.png";
import FlagIcon from "../../static/track_flag.png";

// import Flag from '../../static/flags/flag1.svg';
import { flagImages } from "../services/flagService";

let canvas = document.querySelector("#main-canvas");
let resultCanvas = document.querySelector("#result-canvas");
let controlsCanvas = document.querySelector("#controls-canvas");
let rangeCanvas = document.querySelector("#range-canvas");

let fpsDrops = 0;

export class Graphic2D {
  constructor() {
    this.img = new Image();
    this.img.src = MapBackground;
    this.flagImg = new Image();
    this.flagImg.src = FlagIcon;

    this.flagImages = flagImages();

    this.resultContext = resultCanvas.getContext("2d");
    this.controlsCtx = controlsCanvas.getContext("2d");
    this.rangeCtx = rangeCanvas.getContext("2d");

    this.offscreenCanvas = document.createElement("canvas");
    this.offscreenCanvas.width = resultCanvas.width;
    this.offscreenCanvas.height = resultCanvas.height;
    this.offscreenContext = this.offscreenCanvas.getContext("2d");

    this.offscreenControlsCanvas = document.createElement("canvas");
    this.offscreenControlsCanvas.width = controlsCanvas.width;
    this.offscreenControlsCanvas.height = controlsCanvas.height;
    this.offscreenControlsContext = this.offscreenControlsCanvas.getContext("2d");

    this.offRangeCanvas = document.createElement("canvas");
    this.offRangeCanvas.width = rangeCanvas.width;
    this.offRangeCanvas.height = rangeCanvas.height;
    this.offscreenRangeContext = this.offRangeCanvas.getContext("2d");

    this.intermediateResults = new IntermediateResults();
    this.playerControls = null;
    this.shootingRange = new ShootingRange();
  }

  initRaceCanvas(userPlayers) {
    this.resultContext.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
    this.controlsCtx.clearRect(0, 0, controlsCanvas.width, controlsCanvas.height);
    this.playerControls = new PlayerControls(userPlayers);
  }

  finalFPSDrops() {
    console.log("FPS drops:" + fpsDrops);
  }

  drawGameTick(tick) {
    let ctx = canvas.getContext("2d");

    ctx.textAlign = "left";
    ctx.fillStyle = "#000000";
    if (1000 / tick < 59) {
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
    ctx.lineWidth = 10;
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.closePath();
    ctx.lineWidth = 1;
  }

  drawMapBeta(track) {
    const { coordsMap, penaltyCoordsMap, finishCoordsMap, flagsCoords } = track;
    let ctx = canvas.getContext("2d");
    const { img } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ctx.drawImage(img, 10, 10, canvas.width - 20, canvas.height - 20);

    this.drawCoordinatesMap(coordsMap, "#ffffff");
    this.drawCoordinatesMap(penaltyCoordsMap, "#ffffff");
    this.drawCoordinatesMap(finishCoordsMap, "#ffffff");

    //draw waypoint flags
    flagsCoords.forEach((flag) => {
      ctx.drawImage(this.flagImg, flag.x, flag.y - this.flagImg.height);
    });
  }

  drawPlayersBeta(playersData) {
    let ctx = canvas.getContext("2d");

    for (let i = 0; i < playersData.length; i++) {
      if (playersData[i].coords) {
        try {
          const { x, y } = playersData[i].coords;
          const { team, number } = playersData[i];

          this.drawPlayerBub(ctx, number, team, x, y, 9);
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
    ctx.lineWidth = 1;
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
    // let offscreenCtx = this.offscreenControlsContext;
    // let ctx = this.controlsCtx;

    // if (this.playerControls.compareControls(players)) {
    //   return;
    // }

    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.playerControls.draw(players);

    // ctx.drawImage(this.offscreenControlsCanvas, 0, 0);
  }

  drawShootingRange(players) {
    let offCtx = this.offscreenRangeContext;
    let ctx = this.rangeCtx;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.shootingRange.draw(offCtx, players);

    ctx.drawImage(this.offRangeCanvas, 0, 0);
  }

  // RENDER TESTING
  drawFlagTest() {
    let ctx = canvas.getContext("2d");
    for (let i = 0; i < this.flagImages.length; i++) {
      ctx.drawImage(this.flagImages[i], 10, i * 15 + 10, 18, 12);
    }
  }
}
