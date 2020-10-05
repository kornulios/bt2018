import { Race } from "./Race.js";
import { Player } from "../model/player.js";
import * as Constants from "../constants/constants.js";

export class RelayRace extends Race {
  constructor() {
    // const teamsCount = 27;
    // const { PLAYER_STATUS } = Constants;

    super();

    this.teams = [];
    // this.players = [];

    // for (var t = 0; t < teamsCount; t++) {
    //   this.teams[t] = {};
    //   this.teams[t].players = [];
    //   this.teams[t].name = "Team " + (t + 1);

    //   this.teams[t].leg = 0;
    //   this.teams[t].status = PLAYER_STATUS.NOT_STARTED;

    //   for (var i = 1; i <= 4; i++) {
    //     this.teams[t].players.push(
    //       new Player({
    //         name: "Player " + (t + 1) + "-" + i,
    //         team: this.teams[t].name,
    //         number: t + 1 + " " + i,
    //       })
    //     );
    //   }
    // }
  }

  initPlayers(players) {
    let teamNumber = 1;
    // let playerNumber = 1;
    this.teams = [...players];

    for (let team of this.teams) {
      // team.name = team.teamName;
      team.leg = 0;
      team.status = Constants.PLAYER_STATUS.NOT_STARTED;
      for (let [i, player] of team.players.entries()) {
        player.number = teamNumber + " " + (i + 1);
      }
      teamNumber++;
    }
  }

  getPlayers() {
    const players = this.teams.map((team) => {
      return team.players[team.leg];
    });

    return players;
  }

  // getFinishResult() {
  //   return false;
  // }

  run(gameTick) {
    const { teams, track, results } = this;
    const { PLAYER_STATUS } = Constants;

    this.raceTimes += gameTick;

    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];

      if (team.status !== PLAYER_STATUS.FINISHED) {
        if (team.status === PLAYER_STATUS.NOT_STARTED) {
          team.status = PLAYER_STATUS.RUNNING;
          team.players[0].status = PLAYER_STATUS.RUNNING;
        }

        const player = team.players[team.leg];

        if (team.status === PLAYER_STATUS.RUNNING) {
          const playerPrevDistance = player.distance;
          player.run(gameTick);

          const passedWaypoint = track.isWaypointPassed(player.distance, playerPrevDistance);
          const passedRange = track.isShootingEntrancePassed(player.distance, playerPrevDistance);

          if (passedWaypoint) {
            results.pushRelayResult(
              passedWaypoint,
              player.number,
              player.name,
              team.name,
              this.raceTimer - player.startTimer,
              team.leg + 1
            );
          }

          if (passedRange) {
            team.status = PLAYER_STATUS.SHOOTING;
            player.enterShootingRange(passedRange);
          }
        } else if (team.status === PLAYER_STATUS.SHOOTING) {
          player.shoot(gameTick);

          if (player.shotCount === 8 || player.currentRange.indexOf(0) === -1) {
            results.pushShootingResultRelay(
              player.rangeNum,
              player.name,
              team.name,
              player.currentRange,
              player.shotCount - 5
            );
            const penaltyCount = player.currentRange.filter((r) => r === 0).length;

            player.penalty = penaltyCount * track.penaltyLapLength;
            // team.status = penaltyCount ? PLAYER_STATUS.PENALTY : PLAYER_STATUS.RUNNING;
            player.quitShootingRange(penaltyCount);
          }
        } else if (team.status === PLAYER_STATUS.PENALTY) {
          player.runPenaltyLap(gameTick);
          team.status = player.penalty > 0 ? PLAYER_STATUS.PENALTY : PLAYER_STATUS.RUNNING;
        }

        if (player.distance >= track.getTrackLength()) {
          // replace leg
          console.log(team.name + " switching leg to " + (team.leg + 1));
          team.players[team.leg].status = PLAYER_STATUS.FINISHED;

          if (team.leg >= 3) {
            team.status = PLAYER_STATUS.FINISHED;
          } else {
            team.leg++;
            team.players[team.leg].status = PLAYER_STATUS.RUNNING;
          }
        }
      }
    }

    this.raceFinished = teams.every((t) => t.status === PLAYER_STATUS.FINISHED);
  }
}
