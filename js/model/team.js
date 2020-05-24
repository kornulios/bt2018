export class Team {
  constructor(team) {
    this.name = team.name;
    this.shortName = team.shortName;
    this.color = team.color;
    this.flag = team.flag;
    this.description = team.description;

    this.raceQuota = team.raceQuota;
    this.stageQuota = team.stageQuota;

    this.players = [];
    this.reservePlayers = [];

    this.playerControlled = false;

  }

  setPlayer(player) {
    player.team = this.name;
    this.players.push(player);
  }

  setPlayerControlled() {
    this.playerControlled = true;
  }

  getMalePlayers() {
    return this.players.filter(player => player.gender === 'male');
  }

  getFemalePlayers() {
    return this.players.filter(player => player.gender === 'female')
  }

  getNextRacePlayers() {

  }

  addPlayerToRace(player) {

  }


}