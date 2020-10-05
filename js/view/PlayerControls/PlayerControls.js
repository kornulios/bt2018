import { PlayerBub } from "../PlayerBub/PlayerBub.js";

export const PlayerControls = (player) => {
  // <div class="player-control-portrait">
  //   IMG
  // </div>
  const playerHtml = `<div class="player-control-item">
    <div class="player-control-section">
      <div>${PlayerBub(player)}</div>
      <div>${player.name}</div>
    </div>
    <div class="player-control-section__race-data">

      <div class="player-control__next-waypoint">
        ${player.time}
      </div>
      <div class="player-control__next-waypoint">
        <div class="player-control__waypoint-name">${player.lastWaypoint}</div>
        <div class="player-control__position-box">${player.lastWaypointPlace ? player.lastWaypointPlace : ""}</div>
        <div class="player-control__waypoint-time">${player.lastWaypointResult}</div>
      </div>

    </div>
   </div>`;

  return playerHtml;
};