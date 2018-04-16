function getData() {
  return axios.get('http://localhost:3000/data');
}

var CONSTANT = {
  PENALTY_TYPE: { LAP: 1, MINUTE: 2 },
  RACE_START_TYPE: { ALL: 1, SEPARATE: 2 },

  RUNSTATE: { NORMAL: 0, EASE: 1, PUSHING: 2 },


}

Object.freeze(CONSTANT);

var raceTypes = {
  sprint: {
    length: { men: 3000, women: 2500 },
    waypoints: 25,
    laps: 5,
    shootings: 4,
    type: 'Sprint',
    penaltyType: CONSTANT.PENALTY_TYPE.LAP
  }
};

var trackData = [
  {
    location: 'Ruhpolding',
    season: 'Season 1',
    stats: raceTypes.sprint,
    // penaltyType: CONSTANT.PENALTY_TYPE.LAP,
    startType: CONSTANT.RACE_START_TYPE.SEPARATE
  }
];