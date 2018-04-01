function getData() {
  return axios.get('http://localhost:3000/data');
}

var CONSTANT = {
  PENALTY_TYPE: {LAP: 1, MINUTE: 2},
  RACE_START_TYPE: {ALL: 1, SEPARATE: 2},

  RUNSTATE: {NORMAL: 0, EASE: 1, PUSHING: 2},

  TRACK_TYPE: {
    SPRINT: {
      length: 600,
      waypoints: 15,
      laps: 5,
      shootings: 4,
      type: 'Sprint'
    }
  }
}

var trackData = [
  {
    location: 'Ruhpolding',
    season: 'Season 1',
    stats: CONSTANT.TRACK_TYPE.SPRINT,
    penaltyType: CONSTANT.PENALTY_TYPE.LAP,
    startType: CONSTANT.RACE_START_TYPE.SEPARATE
  }
];