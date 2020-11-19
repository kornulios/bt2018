import { teamData } from "../../data.js";

export const PlayerBub = {
  draw(ctx, number, team, x, y, size = 8) {
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
    ctx.textBaseline = "alphabetic";

    if (number <= 9) {
      ctx.fillText(number, x, y + 3.25);
    } else if (number > 9 && number < 99) {
      ctx.fillText(number, x, y + 3.25);
    } else if (number >= 99) {
      ctx.font = "bold 8px Verdana";
      ctx.fillText(number, x, y + 3.25);
    }

    ctx.closePath();
  },
};
