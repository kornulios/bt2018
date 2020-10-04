import { PlayerBub } from "../PlayerBub/PlayerBub.js";

export const PlayerControls = (player) => {
  const playerHtml = `<div class="player-control-item">
    <div class="player-control-portrait">
      IMG
    </div>
    <div class="player-control-section">
      <div>${PlayerBub(player)}</div>
      <div>${player.name}</div>
    </div>
    <div class="player-control-section">
      ${player.distance.toFixed(0)}
    </div>
   </div>`;

  return playerHtml;
};
