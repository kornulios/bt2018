import { Race } from "./RaceController.js";
import { Player } from "../model/player.js";

import * as Constants from "../constants/constants.js";

export class IndividualRace extends Race {
  constructor() {
    super();
  }

  initPlayers(players) {
    //prepare players
    this.players = players.map((player, i) => {
      const newPlayer = new Player({ ...player });
      newPlayer.reset();
      newPlayer.number = i + 1;
      newPlayer.startTimer = i * 30000;

      return newPlayer;
    });
  }

  run(gameTick) {
    const { players, track, results } = this;

    this.raceTimer += gameTick | 0;

    const { PLAYER_STATUS } = Constants;

    for (let i = 0; i < players.length; i++) {
      const player = players[i];

      if (player.status === PLAYER_STATUS.NOT_STARTED && this.raceTimer >= player.startTimer) {
        player.status = PLAYER_STATUS.RUNNING;
      }

      if (player.status !== PLAYER_STATUS.FINISHED) {
        if (
          this.shootingRange.indexOf(player.id) > -1 &&
          player.shootingTimer <= 0 &&
          player.status !== PLAYER_STATUS.SHOOTING
        ) {
          this.exitShootingRange(player.id);
        }
        
        if (player.status === PLAYER_STATUS.RUNNING) {
          const playerPrevDistance = player.distance;
          player.run(gameTick);

          const passedWaypoint = track.isWaypointPassed(player.distance, playerPrevDistance);
          const passedRange = track.isShootingEntrancePassed(player.distance, playerPrevDistance);

          if (passedWaypoint) {
            this.logPlayerResult(
              results,
              player,
              passedWaypoint,
              this.raceTimer + player.penaltyTime - player.startTimer
            );
          }

          if (passedRange) {
            player.status = PLAYER_STATUS.SHOOTING;
            player.enterShootingRange(passedRange);
            this.enterShootingRange(player.id);
          }
        } else if (player.status === PLAYER_STATUS.SHOOTING) {
          player.shoot(gameTick);

          if (player.shotCount === 5) {
            this.logShootingResult(results, player, player.rangeNum, player.currentRange);
            const penaltyCount = player.currentRange.filter((r) => r === 0).length;

            player.penaltyTime += penaltyCount * 60000;
            player.quitShootingRange(0);
          }
        }

        if (player.distance >= track.getTrackLength()) player.status = PLAYER_STATUS.FINISHED;
      }
    }

    this.raceFinished = players.every((player) => player.status === PLAYER_STATUS.FINISHED);
  }

  //END OF CLASS
}
