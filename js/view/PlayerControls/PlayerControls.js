export const PlayerControls = (player) => {
  return `<div class="player-controls">${player.name} ${player.distance.toFixed(0)}</div>`;
};
