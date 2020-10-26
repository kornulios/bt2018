import * as Constants from "../constants/constants";

const startGroupMap = {
  1: [4],
  2: [3, 4],
  3: [2, 3, 4],
  4: [1, 2, 3, 4],
  5: [1, 1, 2, 3, 4],
  6: [1, 1, 2, 2, 3, 4],
};

export class TeamAI {
  constructor(team) {
    this.name = team.name;
    this.shortName = team.shortName;
    this.colors = team.colors;
    this.flag = team.flag;
    this.description = team.description;

    this.raceQuota = team.raceQuota;
    this.stageQuota = team.stageQuota;

    this.players = [];
    this.reservePlayers = [];
    this.nextRacePlayers = [];

    this.playerControlled = false;
    this.isTeamReady = false;
  }

  getColors() {
    return this.colors;
  }

  setPlayer(player) {
    player.team = this.name;
    this.players.push(player);
  }

  setPlayerControlled() {
    this.playerControlled = true;
  }

  getTeamPlayers(players) {
    return players.filter((player) => player.team === this.shortName);
  }

  getMalePlayers() {
    return this.players.filter((player) => player.gender === Constants.GENDER.MEN);
  }

  getFemalePlayers() {
    return this.players.filter((player) => player.gender === Constants.GENDER.WOMEN);
  }

  getNextRacePlayersAI(players, gender) {
    const myPlayers = this.getTeamPlayers(players).filter((player) => player.gender === gender);

    const quota = gender === "male" ? this.raceQuota.men : this.raceQuota.women;

    const playersWeight = this.weightPlayers(myPlayers).slice(0, quota);

    let roster = [];

    for (let i = 0; i < playersWeight.length; i++) {
      const player = myPlayers.find((p) => p.id === playersWeight[i].id);
      player.startGroup = startGroupMap[playersWeight.length][i];
      roster.push(myPlayers.find((p) => p.id === playersWeight[i].id));
    }

    return roster;
  }

  getNextRelayPlayers(players, gender) {
    const myPlayers = this.getTeamPlayers(players).filter((player) => player.gender === gender);

    if (myPlayers.length < 4) return;

    const playersWeight = this.weightPlayers(myPlayers).slice(0, 4);

    return {
      name: this.shortName,
      players: players.filter((player) => {
        return playersWeight.find((pw) => pw.id === player.id);
      }),
    };
  }

  weightPlayers(players) {
    // get best players as per race quota STR+ACC+SPD*2
    return players
      .map((player) => {
        return {
          id: player.id,
          weight: player.accuracy + player.strength + player.baseSpeed * 2,
        };
      })
      .sort((p1, p2) => {
        return p1.weight > p2.weight ? -1 : 1;
      });
  }

  getNextRacePlayers() {
    return this.nextRacePlayers;
  }

  addPlayerToRace(player, startingGroup) {
    if (this.isTeamReady || this.nextRacePlayers.find(p => p.id === player.id)) {
      return;
    }

    const newPlayer = { ...player, startGroup: startingGroup };
    this.nextRacePlayers.push(newPlayer);
    if (this.nextRacePlayers.length === this.raceQuota[player.gender]) {
      this.isTeamReady = true;
    }
  }

  clearNextRacePlayers() {
    this.nextRacePlayers = [];
    this.isTeamReady = false;
  }

  getNextStartGroup(gender) {
    const playersSelected = this.nextRacePlayers.length;
    const quota = startGroupMap[this.raceQuota[gender]];
    return quota[playersSelected];
  }
}
