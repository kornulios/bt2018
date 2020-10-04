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
    <div class="player-control__next-waypoint">
      ${player.time}
    </div>
    <div class="player-control__next-waypoint">
      ${player.lastWaypoint}
      ${player.lastWaypointResult}
    </div>
   </div>`;

  return playerHtml;
};
