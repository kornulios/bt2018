import { Utils } from "../utils/Utils";

export class Roster {
  constructor(game) {
    this.game = game;
  }

  startListDraw(playerRoster) {
    const sortedRoster = [];

    const groups = [0, 1, 2, 3].map((i) => {
      return playerRoster.filter((p) => p.startGroup === i + 1);
    });

    for (let i = 0; i < groups.length; i++) {
      do {
        const index = Utils.rand(groups[i].length - 1, 0);
        sortedRoster.push(groups[i].splice(index, 1)[0]);
      } while (groups[i].length);
    }

    return sortedRoster;
  }

  selectRacePlayers = () => {
    const game = this.game;

    const nextRace = game.getNextRace();

    const playerRoster = game.teams
      .map((team) => {
        if (team.shortName === game.userTeam) {
          return team.getNextRacePlayers();
        } else {
          return team.getNextRacePlayersAI(game.players, nextRace.raceGender);
        }
      })
      .flat();

    const sortedRoster = this.startListDraw(playerRoster);

    return sortedRoster;
  };

  selectPursuitPlayers = () => {
    const game = this.game;
    const nextRace = game.getNextRace();
    const stage = nextRace.stageName;
    const calendar = game.championship.getRaceList();

    const prevSprint = calendar.find((race) => {
      return race.stageName === stage && race.raceType === "Sprint" && race.raceGender === nextRace.raceGender;
    });

    if (!prevSprint.finish) throw "ERROR: Sprint race has no results! Check race calendar";

    const eligiblePlayers = prevSprint.finish.slice(0, 60).map((result) => {
      const player = game.getPlayerById(result.id);
      player.startTimer = result.time;
      return player;
    });

    return eligiblePlayers;
  };

  selectMassStartPlayers = () => {
    const game = this.game;
    const nextRace = game.getNextRace();
    const standings = game.championship.getPlayersStandings(nextRace.raceGender).slice(0, 30);

    const eligiblePlayers = standings.map((result) => {
      return this.getPlayerById(result.id);
    });

    return eligiblePlayers;
  };
}
