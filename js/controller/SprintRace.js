import { Race } from './Race.js';
import { Track } from '../model/track.js';
import { Result } from '../model/result.js';
import { Player } from '../model/player.js'

import * as Constants from '../constants/constants.js';

export class SprintRace extends Race {

  run() {
    const players = [];
    const playerCount = 105;
    const { track, results, frameRate } = this;

    // const track = new Track();
    // const results = new Result();

    let raceFinished = false;
    let timer = 0;
    // const frameRate = 100;

    for (var i = 1; i <= playerCount; i++) {
      players.push(new Player({
        name: "Player " + i,
        number: i,
        // speed: 19 + (i / 10),
        startTimer: (i - 1) * 30000
      }));
    }

    const { PLAYER_STATUS } = Constants;

    do {

      for (let i = 0; i < players.length; i++) {
        const player = players[i];

        if (player.status === PLAYER_STATUS.NOT_STARTED && timer >= player.startTimer) {
          player.status = PLAYER_STATUS.RUNNING;
        };

        if (player.status !== PLAYER_STATUS.FINISHED && player.status !== PLAYER_STATUS.NOT_STARTED) {

          if (player.status === PLAYER_STATUS.RUNNING) {
            const playerPrevDistance = player.distance;
            player.run(frameRate);

            const passedWaypoint = track.isWaypointPassed(player.distance, playerPrevDistance);
            const passedRange = track.isShootingEntrancePassed(player.distance, playerPrevDistance);

            if (passedWaypoint) {
              this.logPlayerResult(results, player, passedWaypoint, timer - player.startTimer);
            }

            if (passedRange) {
              player.status = PLAYER_STATUS.SHOOTING;
              player.enterShootingRange(passedRange);
            }
          }
          else if (player.status === PLAYER_STATUS.SHOOTING) {
            player.shoot(frameRate);

            if (player.shotCount === 5) {
              this.logShootingResult(results, player, player.rangeNum, player.currentRange);
              const penaltyCount = player.currentRange.filter(r => r === 0).length;

              player.penalty = penaltyCount * track.penaltyLapLength;
              player.status = penaltyCount ? PLAYER_STATUS.PENALTY : PLAYER_STATUS.RUNNING;
            }
          }
          else if (player.status === PLAYER_STATUS.PENALTY) {
            player.runPenaltyLap(frameRate);
            player.status = player.penalty > 0 ? PLAYER_STATUS.PENALTY : PLAYER_STATUS.RUNNING;
          }

          if (player.distance >= track.getTrackLength()) player.status = PLAYER_STATUS.FINISHED;

        }

      }

      raceFinished = players.every(player => player.status === PLAYER_STATUS.FINISHED);

      timer += frameRate;

    } while (!raceFinished)

    console.log('race finished', timer);

  }
}