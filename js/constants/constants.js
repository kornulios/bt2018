export const PENALTY_TYPE = { LAP: 1, MINUTE: 0 };
export const RACE_START_TYPE = {
  ALL: 1,
  SEPARATE: 2,
  PURSUIT: 3,
  RELAY: 4,
};

export const SHOOTING_DELAY = 60000;

//AI behaviour constants
export const AI_BEHAVIOUR = {
  AGGRESSIVE: [50, 25, 25],
  WEAK: [25, 25, 50],
  NORMAL: [33, 34, 33],
};

export const GENDER = {
  MEN: "men",
  WOMEN: "women",
};

export const AI_PLAYER_RUN_STATUS = { NORMAL: 0, EASE: 0.98, PUSHING: 1.02 };

export const START_TIME_INTERVAL = 30; // in seconds
export const PURSUIT_PLAYERS_NUM = 60;
export const PENALTY_LAP_LENGTH = 150;
export const PENALTY_MINUTE = 100;

export const BASE_SPEED_MOD = 0.05;

export const PLAYER_STATUS = {
  NOT_STARTED: 1,
  RUNNING: 2,
  SHOOTING: 3,
  PENALTY: 4,
  FINISHED: 5,
};

export const RACE_STATUS = {
  NOT_STARTED: 1,
  IN_PROGRESS: 2,
  FINISHED: 3,
  RACE_NEXT: 4,
};

// indi - 20km / 15km
// mass - 15km / 12.5km
// sprint - 10km / 7.5km
// pursuit - 12.5 / 10km
// relay - 4x7.5 / 4x6

// 20km:   [0, 1300, 2600, 3950, 4000,  5300, 6600, 7950, 8000,  9300, 10600, 11950, 12000,  13300, 14600, 15950, 16000, 17300, 18600, 20000],
// 15km:   [0, 1500, 2300, 2950, 3000, 4500, 5300, 5950, 6000, 7500, 8300, 8950, 9000, 10500, 11300, 11950, 12000, 13500, 14300, 15000],
// 12.5km: [0, 800, 1600, 2450, 2500,  3300, 4100, 4950, 5000,   5800, 6600, 7450, 7500,  8300, 9100, 9950,  10000, 10800, 11600, 12500],
// 10km:   [0, 1100, 2200, 3280, 3300, 4400, 5500, 6580, 6600, 7800, 8900, 10000],
// 7.5km:  [0, 800, 1600, 2450, 2500, 3300, 4100, 4950, 5000, 5800, 6600, 7500],
// 6km:    [0, 700, 1400, 1950, 2000,  2700, 3400, 3950, 4000,  4700, 5400, 6000]

//individual / pursuit / mass start
// export const WAYPOINTS_TYPE_1 = 
// { 
//   [GENDER.MEN]: [0, 1500, 2300, 2950, 3000, 4500, 5300, 5950, 6000, 7500, 8300, 8950, 9000, 10500, 11300, 11950, 12000, 13500, 14300, 15000],
//   [GENDER.WOMEN]: [0, 800, 1600, 2450, 2500,  3300, 4100, 4950, 5000,   5800, 6600, 7450, 7500,  8300, 9100, 9950,  10000, 10800, 11600, 12500],
// };
// export const RANGE_TYPE_1 = { [GENDER.MEN]: [0, 2950, 5950, 8950, 11950], [GENDER.WOMEN]: [2450, 4950, 7450, 9950] };



// // relay / sprint
// export const WAYPOINTS_TYPE_2 = { 
//   [GENDER.WOMEN]: [0, 800, 1600, 2450, 2500, 3300, 4100, 4950, 5000, 5800, 6600, 7500],
//   [GENDER.MEN]: [0, 1100, 2200, 3280, 3300, 4400, 5500, 6580, 6600, 7800, 8900, 10000] };
// export const RANGE_TYPE_2 = { [GENDER.WOMEN]: [0, 2450, 4950], [GENDER.MEN]: [0, 3280, 6580] };

// export const RACE_TYPE_LONG = 1;
// export const RACE_TYPE_SHORT = 2;

export const RACE_POINTS_MAP = [
  60, 54, 48, 43, 40, 38, 36, 34, 32, 31, 30, 29, 
  28, 27, 26, 25, 24, 23, 22, 21, 20, 19,
  18, 17, 16, 15, 14, 13, 12, 11, 10, 9,
  8, 7, 6, 5, 4, 3, 2, 1
];

export const RELAY_POINTS_MAP = [];

export const MASS_START_POINTS_MAP = [
  60, 54, 48, 43, 40, 38, 36, 34, 32, 31,
  30, 29, 28, 27, 26, 25, 24, 23, 22, 21,
  20, 18, 16, 14, 12, 10, 8, 6, 4, 2, 1
];
export const NATION_POINTS_MAP = [];
