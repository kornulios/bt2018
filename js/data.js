function getData() {
  return axios.get('http://localhost:3000/data');
}

var CONSTANT = {
  PENALTY_TYPE: {LAP: 1, MINUTE: 2},

  RUNSTATE: {NORMAL: 0, EASE: 1, PUSHING: 2},

  TRACK_TYPE: {
    SPRINT: {
      length: 500,
      waypoints: 3,
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
    penaltyType: CONSTANT.PENALTY_TYPE.LAP
  }
];