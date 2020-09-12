// import { racesData } from '../data.js';

export class Championship {
  constructor() {
    // this.stages = { ...gameData.stageData };
    this.results = [];
    this.raceCalendar = [];
    //this.players = [];
    //this.currentRace;
    // this.raceList = createRaceList();

    this.playerPoints = {};
    this.nationPoints = {};

    // this._initPlayers(game.players);

    // this.initNextRace();
    // this.currentRace.initRoster(this.players);
    // window.myRace = this.currentRace;
  }

  createRaceList(racesData) {
    let raceIndex = 1;
    let res = [];

    for (let stage of racesData) {
      for (let race of stage.raceMap) {
        res.push({
          index: raceIndex,
          stageName: stage.name,
          raceType: race.type,
          raceGender: race.gender,
          results: null,
        });
        raceIndex++;
      }
    }
    
    this.raceCalendar = res;
  };

  get calendar() {
    return this.raceCalendar;
  }

  onRaceFinish(results) {}

  createRaceRoster() {}
}
