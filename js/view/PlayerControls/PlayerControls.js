export const PlayerControls = (player) => {
  const playerHtml = `<div class="player-control-item">
    <div class="player-control-portrait">
      <div>${player.number}</div>
    </div>
    <div class="player-control-section">
      <div>${player.name}</div>
    </div>
    <div class="player-control-section">
      ${player.distance.toFixed(0)}
    </div>
   </div>`;

  return playerHtml;
};
