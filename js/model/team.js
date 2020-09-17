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

    this.playerControlled = false;
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
    return this.players.filter((player) => player.gender === "male");
  }

  getFemalePlayers() {
    return this.players.filter((player) => player.gender === "female");
  }

  getNextRacePlayers(players, gender) {
    // get best players as per race quota STR+ACC+SPD*2
    const myPlayers = this.getTeamPlayers(players).filter(
      (player) => player.gender === gender
    );

    const quota = gender === "male" ? this.raceQuota.men : this.raceQuota.women;

    const playersWeight = myPlayers
      .map((player) => {
        return {
          id: player.id,
          weight: player.accuracy + player.strength + player.baseSpeed * 2,
        };
      })
      .sort((p1, p2) => {
        return p1.weight > p2.weight ? -1 : 1;
      })
      .slice(0, quota);

    return players.filter((player) => {
      return playersWeight.find((pw) => pw.id === player.id);
    });
  }

  addPlayerToRace(player) {}
}
