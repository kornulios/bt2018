import { Race } from './Race.js';
import { Track } from '../model/track.js';
import { Result } from '../model/result.js';

export class RelayRace extends Race {

  simulatePlayer() {

    const players = [];
    const playerCount = 60;
    const track = new Track();
    const results = new Result();
    const teams = [];

    let raceFinished = false;
    let timer = 0;
    const frameRate = 1;

    const { PLAYER_STATUS } = Constants;

    for (var t = 0; t < 27; t++) {
      teams[t] = {};
      teams[t].players = [];
      teams[t].leg = 0;
      teams[t].name = 'Team ' + (t + 1);
      teams[t].status = PLAYER_STATUS.NOT_STARTED;

      for (var i = 1; i <= 4; i++) {
        teams[t].players.push(new Player({
          name: "Player " + (t + 1) + "-" + i,
          team: teams[t].name,
          number: (t + 1) + ' ' + i,
          // speed: 21,
          // accuracy: 20,
        }));
      }
    }

    do {

      for (let i = 0; i < teams.length; i++) {
        const team = teams[i];

        if (team.status !== PLAYER_STATUS.FINISHED) {

          if (team.status === PLAYER_STATUS.NOT_STARTED) {
            team.status = PLAYER_STATUS.RUNNING;
          };

          const player = team.players[team.leg];

          if (team.status === PLAYER_STATUS.RUNNING) {
            const playerPrevDistance = player.distance;
            player.run(1);

            const passedWaypoint = track.isWaypointPassed(player.distance, playerPrevDistance);
            const passedRange = track.isShootingEntrancePassed(player.distance, playerPrevDistance);

            if (passedWaypoint) {
              results.pushRelayResult(passedWaypoint, player.number, player.name, team.name, timer, team.leg + 1);
            }

            if (passedRange) {
              team.status = PLAYER_STATUS.SHOOTING;
              player.enterShootingRange(passedRange);
            }
          }
          else if (team.status === PLAYER_STATUS.SHOOTING) {
            player.shoot(frameRate);

            if (player.shotCount === 8 || player.currentRange.indexOf(0) === -1) {
              results.pushShootingResultRelay(player.rangeNum, player.name, team.name, player.currentRange, player.shotCount - 5);
              const penaltyCount = player.currentRange.filter(r => r === 0).length;

              player.penalty = penaltyCount * track.penaltyLapLength;
              team.status = penaltyCount ? PLAYER_STATUS.PENALTY : PLAYER_STATUS.RUNNING;
            }
          }
          else if (team.status === PLAYER_STATUS.PENALTY) {
            player.runPenaltyLap(frameRate);
            team.status = player.penalty > 0 ? PLAYER_STATUS.PENALTY : PLAYER_STATUS.RUNNING;
          }


          if (player.distance >= track.getTrackLength()) {
            // replace leg
            console.log(team.name + ' switching leg to ' + (team.leg + 1));
            if (team.leg >= 3) {
              team.status = PLAYER_STATUS.FINISHED;
            } else {
              team.leg++;
            }
          };

        }

      }

      raceFinished = teams.every(t => t.status === PLAYER_STATUS.FINISHED);

      timer += frameRate;

    } while (!raceFinished)

    console.log('race finished', timer);

    const view = new View();
    view.renderRelayResults(results, track);
  }



}