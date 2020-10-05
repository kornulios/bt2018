import { teamData } from '../../data.js';

export const PlayerBub = (player) => {
  const colors = teamData.find((team) => team.shortName === player.team).colors;

  return `<div class="player-bub" style="background: ${colors[0]}; color: ${colors[1]}">${player.number}</div>`;
};
