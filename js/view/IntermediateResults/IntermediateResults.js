import { PlayerBub } from "../PlayerBub/PlayerBub.js";

export class IntermediateResults {
  constructor() {
    this.prevResults = [];
  }

  compareResults(newResults) {
    // true if results are equal
    if (this.prevResults.length !== newResults.length) {
      this.prevResults = newResults;
      return false;
    }

    for (let i = 0; i < newResults.length; i++) {
      if (this.prevResults[i].playerName !== newResults[i].playerName) {
        this.prevResults = newResults;
        return false;
      }
    }

    this.prevResults = newResults;
    return true;
  }

  draw(ctx, resultsData) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let i = 0; i < resultsData.length; i++) {
      this.drawIntermediateResultItem(ctx, i, resultsData[i]);
    }
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
    ctx.fillText(result.place, x + 10, y + 16);

    PlayerBub.draw(ctx, result.playerNumber, result.team, x + 32, y + 10);

    ctx.font = "14px Open Sans";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.fillText(result.playerName, x + 44, y + 16);

    ctx.textAlign = "right";
    ctx.fillText(result.timeString, x + 180, y + 16);
  }
}
