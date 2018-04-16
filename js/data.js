function getData() {
  return axios.get('http://localhost:3000/data');
}

var CONSTANT = {
  PENALTY_TYPE: { LAP: 1, MINUTE: 0 },
  RACE_START_TYPE: { ALL: 1, SEPARATE: 2 },

  RUNSTATE: { NORMAL: 0, EASE: 1, PUSHING: 2 },
}

Object.freeze(CONSTANT);

var raceTypes = {
  sprint: {
    lapLength: { men: 3300, women: 2500 },
    waypoints: 25,
    laps: 3,
    shootings: 2,
    type: 'Sprint',
    penaltyType: CONSTANT.PENALTY_TYPE.LAP,
    startType: CONSTANT.RACE_START_TYPE.SEPARATE
  },
  individual: {
    lapLength: { men: 4000, women: 3000 },
    waypoints: 25,
    laps: 5,
    shootings: 4,
    type: 'Individual',
    penaltyType: CONSTANT.PENALTY_TYPE.MINUTE,
    startType: CONSTANT.RACE_START_TYPE.SEPARATE
  },
  pursuit: {

  },
  massStart: {
    
  }
};

var trackData = [
  {
    location: 'Ruhpolding',
    coordsMap: [],
    stats: raceTypes.individual
  }
];