import { Race } from './Race.js';
import { Player } from '../model/player.js'

import * as Constants from '../constants/constants.js';

export class IndividualRace extends Race {
  constructor() {
    const playerCount = 10;

    super();

    this.players = [];

    for (var i = 1; i <= playerCount; i++) {
      this.players.push(new Player({
        name: "Player " + i,
        number: i,
        // speed: 19 + (i / 10),
        startTimer: (i - 1) * 30000,
      }));
    }
  }


  run(gameTick) {

    const { players, track, results } = this;

    this.raceTimer += gameTick;

    const { PLAYER_STATUS } = Constants;

    for (let i = 0; i < players.length; i++) {
      const player = players[i];

      if (player.status === PLAYER_STATUS.NOT_STARTED && this.raceTimer >= player.startTimer) {
        player.status = PLAYER_STATUS.RUNNING;
      };

      if (player.status !== PLAYER_STATUS.FINISHED) {

        if (player.status === PLAYER_STATUS.RUNNING) {
          const playerPrevDistance = player.distance;
          player.run(gameTick);

          const passedWaypoint = track.isWaypointPassed(player.distance, playerPrevDistance);
          const passedRange = track.isShootingEntrancePassed(player.distance, playerPrevDistance);

          if (passedWaypoint) {
            this.logPlayerResult(results, player, passedWaypoint, this.raceTimer + player.penaltyTime - player.startTimer);
          }

          if (passedRange) {
            player.status = PLAYER_STATUS.SHOOTING;
            player.enterShootingRange(passedRange);
          }
        }
        else if (player.status === PLAYER_STATUS.SHOOTING) {
          player.shoot(gameTick);

          if (player.shotCount === 5) {
            this.logShootingResult(results, player, player.rangeNum, player.currentRange);
            const penaltyCount = player.currentRange.filter(r => r === 0).length;

            player.penaltyTime += penaltyCount * 60000;
            player.status = PLAYER_STATUS.RUNNING;
          }
        }

        if (player.distance >= track.getTrackLength()) player.status = PLAYER_STATUS.FINISHED;

      }

    }

    this.raceFinished = players.every(player => player.status === PLAYER_STATUS.FINISHED);
  }

  //END OF CLASS
}