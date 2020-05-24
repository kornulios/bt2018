function getData() {
  return axios.get('http://localhost:3000/data');
}

var debugProfiler = {};

var CONSTANT = {
  PENALTY_TYPE: { LAP: 1, MINUTE: 0 },
  RACE_START_TYPE: {
    ALL: 1,
    SEPARATE: 2,
    PURSUIT: 3,
    RELAY: 4
  },

  //AI behaviour constants
  AI: {
    AGGRESSIVE: [50, 25, 25],
    WEAK: [25, 25, 50],
    NORMAL: [33, 34, 33],
  },

  RUNSTATE: { NORMAL: 0, EASE: 1, PUSHING: 2 },

  START_TIME_INTERVAL: 30,		// in seconds
  PURSUIT_PLAYERS_NUM: 60,
  PENALTY_LAP_LENGTH: 150,
  PENALTY_MINUTE: 100,

  BASE_SPEED_MOD: 0.05

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
    lapLength: { men: 3000, women: 2500 },
    waypoints: 25,
    laps: 5,
    shootings: 4,
    type: 'Mass Start',
    penaltyType: CONSTANT.PENALTY_TYPE.LAP,
    startType: CONSTANT.RACE_START_TYPE.ALL
  },
  relay: {
    //WHOA!		4x6 women; 4x7,5 men
    lapLength: { men: 2500, women: 2000 },
    waypoints: 25,
    // waypointsPerLap: 3, // 3 is finish
    laps: 12,
    shootings: 8,
    type: 'Relay',
    penaltyType: CONSTANT.PENALTY_TYPE.LAP,
    startType: CONSTANT.RACE_START_TYPE.RELAY
  }
};

// var trackData = [
// 	{
// 		location: 'Ruhpolding',
// 		coordsMap: [],
// 		stats: raceTypes.individual
// 	},
// 	{
// 		location: 'Ruhpolding',
// 		coordsMap: [],
// 		stats: raceTypes.sprint
// 	},
// 	{
// 		location: 'Ruhpolding',
// 		coordsMap: [],
// 		stats: raceTypes.pursuit
// 	},
// 	{
// 		location: 'Ruhpolding',
// 		coordsMap: [],
// 		stats: raceTypes.massStart
// 	}
// ];


//Season consists of 9 stages and 1 World Cup event


export const teamData = [
  { name: 'Germany', shortName: 'GER', flag: '', colors: [], raceQuota: { men: 6, women: 6 }, stageQuota: { men: 8, women: 8 } },
  { name: 'Ukraine', shortName: 'UKR', flag: '', colors: [], raceQuota: { men: 5, women: 4 }, stageQuota: { men: 7, women: 6 } },
  { name: 'Belarus', shortName: 'BEL', flag: '', colors: [], raceQuota: { men: 5, women: 4 }, stageQuota: { men: 7, women: 6 } },
  { name: 'Norway', shortName: 'NOR', flag: '', colors: [], raceQuota: { men: 4, women: 4 }, stageQuota: { men: 6, women: 6 } },
  { name: 'France', shortName: 'FRA', flag: '', colors: [], raceQuota: { men: 6, women: 6 }, stageQuota: { men: 8, women: 8 } },
  { name: 'Finland', shortName: 'FIN', flag: '', colors: [], raceQuota: { men: 6, women: 6 }, stageQuota: { men: 8, women: 8 } },
];

var mockData = {
  teamDesc: ' is a potent team with some strong players as well as fresh growing stars. Player should rely on skill in order to bring his team to victory.'
};

const gameData = {
  stageData: [
    {
      name: 'Pokljuka',
      raceMap: [
        raceTypes.individual,
        raceTypes.sprint,
        raceTypes.pursuit
      ]
    },
    {
      name: 'Hochfilzen',
      raceMap: [raceTypes.sprint, raceTypes.pursuit, raceTypes.relay]
    },
    {
      name: 'Nove Mesto',
      raceMap: [raceTypes.sprint, raceTypes.pursuit, raceTypes.massStart]
    }
  ]
};

const createRaceList = () => {
  let res = [];
  for (let stage of gameData.stageData) {
    for (let race of stage.raceMap) {
      res.push({
        stageName: stage.name,
        raceType: race,
        raceGender: 'men',
        results: null
      });
      res.push({
        stageName: stage.name,
        raceType: race,
        raceGender: 'women',
        results: null
      });
    }
  }
  return res;
};

