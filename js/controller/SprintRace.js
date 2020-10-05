import { Race } from "./Race.js";
import { Player } from "../model/player.js";

import * as Constants from "../constants/constants.js";

export class SprintRace extends Race {
  constructor() {
    super();
  }

  initPlayers(players) {
    //prepare players
    this.players = players.map((player, i) => {
      const newPlayer = new Player({...player});
      newPlayer.reset();
      newPlayer.number = i + 1;
      newPlayer.startTimer = i * 30000;

      return newPlayer;
    });
  }

  run(gameTick) {
    const { players, track, results } = this;

    this.raceTimer += gameTick;

    const { PLAYER_STATUS } = Constants;

    for (let i = 0; i < players.length; i++) {
      const player = players[i];

      if (player.status === PLAYER_STATUS.NOT_STARTED && this.raceTimer >= player.startTimer) {
        player.status = PLAYER_STATUS.RUNNING;
      }

      if (player.status !== PLAYER_STATUS.FINISHED && player.status !== PLAYER_STATUS.NOT_STARTED) {
        if (player.status === PLAYER_STATUS.RUNNING) {
          const playerPrevDistance = player.distance;
          player.run(gameTick);

          const passedWaypoint = track.isWaypointPassed(player.distance, playerPrevDistance);
          const passedRange = track.isShootingEntrancePassed(player.distance, playerPrevDistance);

          if (passedWaypoint) {
            this.logPlayerResult(results, player, passedWaypoint, this.raceTimer - player.startTimer);
          }

          if (passedRange) {
            player.status = PLAYER_STATUS.SHOOTING;
            player.enterShootingRange(passedRange);
          }
        } else if (player.status === PLAYER_STATUS.SHOOTING) {
          player.shoot(gameTick);

          if (player.shotCount === 5) {
            this.logShootingResult(results, player, player.rangeNum, player.currentRange);
            const penaltyCount = player.currentRange.filter((r) => r === 0).length;

            player.penalty = penaltyCount * track.penaltyLapLength;
            player.quitShootingRange(penaltyCount);
          }
        } else if (player.status === PLAYER_STATUS.PENALTY) {
          player.runPenaltyLap(gameTick);
          player.status = player.penalty > 0 ? PLAYER_STATUS.PENALTY : PLAYER_STATUS.RUNNING;
        }

        if (player.distance >= track.getTrackLength()) player.status = PLAYER_STATUS.FINISHED;
      }
    }

    this.raceFinished = players.every((player) => player.status === PLAYER_STATUS.FINISHED);
  }

  //END OF CLASS
}
