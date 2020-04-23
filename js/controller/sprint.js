import { Race } from './race.js';

export class SprintRace extends Race {

  run() {
    const players = this.createPlayers(10);
    const track = new Track();
    const results = new Result();

    let raceFinished = false;
    let timer = 0;
    const frameRate = 1;

    const { PLAYER_STATUS } = Constants;

    do {

      for (let i = 0; i < players.length; i++) {
        const player = players[i];

        if (player.status === PLAYER_STATUS.NOT_STARTED) player.status = PLAYER_STATUS.RUNNING;

        if (player.status !== PLAYER_STATUS.FINISHED) {

          if (player.status === PLAYER_STATUS.RUNNING) {
            const playerPrevDistance = player.distance;
            player.run(1);

            const passedWaypoint = track.isWaypointPassed(player.distance, playerPrevDistance);
            const passedRange = track.isShootingEntrancePassed(player.distance, playerPrevDistance);

            if (passedWaypoint) {
              this.logPlayerResult(results, player, passedWaypoint, timer);
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

          if (player.distance >= track.length) player.status = PLAYER_STATUS.FINISHED;

        }

      }

      raceFinished = players.every(player => player.status === PLAYER_STATUS.FINISHED);

      timer += frameRate;

    } while (!raceFinished)

    console.log('race finished', timer);


    this.renderResults(results, track);
  }
}