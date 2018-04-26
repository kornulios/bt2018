function getData() {
  return axios.get('http://localhost:3000/data');
}

var Util = {
  rand: function (max, min) {
    max++;
    return Math.floor(Math.random() * (max - min) + min);
  }
};


var CONSTANT = {
  PENALTY_TYPE: { LAP: 1, MINUTE: 0 },
  RACE_START_TYPE: {
    ALL: 1,
    SEPARATE: 2,
    PURSUIT: 3
  },

  RUNSTATE: { NORMAL: 0, EASE: 1, PUSHING: 2 },

  START_TIME_INTERVAL: 30,
  PENALTY_LAP_LENGTH: 150
}

Object.freeze(CONSTANT);

var raceTypes = {
  sprint: {
    lapLength: { men: 3333.33, women: 2500 },
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
    //60 best of sprint race, intervals are taken from spint
    lapLength: { men: 2500, women: 2000 },
    waypoints: 25,
    laps: 5,
    shootings: 4,
    type: 'Pursuit',
    penaltyType: CONSTANT.PENALTY_TYPE.LAP,
    startType: CONSTANT.RACE_START_TYPE.PURSUIT
  },
  massStart: {
    // 30 top ranked championship players
    lapLength: { men: 3333, women: 2500 },
    waypoints: 25,
    laps: 5,
    shootings: 4,
    type: 'Mass Start',
    penaltyType: CONSTANT.PENALTY_TYPE.LAP,
    startType: CONSTANT.RACE_START_TYPE.ALL
  },
  relay: {

  }
};

var trackData = [
  {
    location: 'Ruhpolding',
    coordsMap: [],
    stats: raceTypes.sprint
  },
  {
    location: 'Ruhpolding',
    coordsMap: [],
    stats: raceTypes.pursuit
  },
  {
    location: 'Ruhpolding',
    coordsMap: [],
    stats: raceTypes.individual
  }
];


