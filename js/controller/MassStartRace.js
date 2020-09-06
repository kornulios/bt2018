import { Race } from "./Race.js";
import { Player } from "../model/player.js";

import * as Constants from "../constants/constants.js";

export class MassStartRace extends Race {
  constructor() {
    const playerCount = 30;

    super({ raceType: Constants.RACE_TYPE_LONG });

    this.players = [];

    for (var i = 1; i <= playerCount; i++) {
      this.players.push(
        new Player({
          name: "Player " + i,
          number: i,
          startTimer: 0,
        })
      );
    }
  }

  run(gameTick) {
    const { players, track, results } = this;

    this.raceTimer += gameTick;

    const { PLAYER_STATUS } = Constants;

    for (let i = 0; i < players.length; i++) {
      const player = players[i];

      if (player.status === PLAYER_STATUS.NOT_STARTED) {
        player.status = PLAYER_STATUS.RUNNING;
      }

      if (player.status !== PLAYER_STATUS.FINISHED) {
        if (player.status === PLAYER_STATUS.RUNNING) {
          const playerPrevDistance = player.distance;
          player.run(gameTick);

          const passedWaypoint = track.isWaypointPassed(
            player.distance,
            playerPrevDistance
          );
          const passedRange = track.isShootingEntrancePassed(
            player.distance,
            playerPrevDistance
          );

          if (passedWaypoint) {
            this.logPlayerResult(
              results,
              player,
              passedWaypoint,
              this.raceTimer - player.startTimer
            );
          }

          if (passedRange) {
            player.status = PLAYER_STATUS.SHOOTING;
            player.enterShootingRange(passedRange);
          }
        } else if (player.status === PLAYER_STATUS.SHOOTING) {
          player.shoot(gameTick);

          if (player.shotCount === 5) {
            this.logShootingResult(
              results,
              player,
              player.rangeNum,
              player.currentRange
            );
            const penaltyCount = player.currentRange.filter((r) => r === 0)
              .length;

            player.penalty = penaltyCount * track.penaltyLapLength;
            player.status = penaltyCount
              ? PLAYER_STATUS.PENALTY
              : PLAYER_STATUS.RUNNING;
          }
        } else if (player.status === PLAYER_STATUS.PENALTY) {
          player.runPenaltyLap(gameTick);
          player.status =
            player.penalty > 0 ? PLAYER_STATUS.PENALTY : PLAYER_STATUS.RUNNING;
        }

        if (player.distance >= track.getTrackLength()) {
          player.status = PLAYER_STATUS.FINISHED;
          player.distance = track.getTrackLength();
        }
      }
    }

    this.raceFinished = players.every(
      (player) => player.status === PLAYER_STATUS.FINISHED
    );
  }

  //END OF CLASS
}
