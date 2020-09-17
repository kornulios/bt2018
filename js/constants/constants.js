export const PENALTY_TYPE = { LAP: 1, MINUTE: 0 };
export const RACE_START_TYPE = {
  ALL: 1,
  SEPARATE: 2,
  PURSUIT: 3,
  RELAY: 4,
};

//AI behaviour constants
export const AI_BEHAVIOUR = {
  AGGRESSIVE: [50, 25, 25],
  WEAK: [25, 25, 50],
  NORMAL: [33, 34, 33],
};

export const GENDER = {
  MALE: "male",
  FEMALE: "female",
};

export const PLAYER_RUN_STATUS = { NORMAL: 0, EASE: 1, PUSHING: 2 };

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

//individual / pursuit / mass start
export const WAYPOINTS_TYPE_1 = [
  0,  1500,  2300,  2950,  3000,  4500,
  5300,  5950,  6000,  7500,  8300,  8950,
  9000,  10500,  11300,  11950,  12000,
  13500,  14300,  15000];
export const RANGE_TYPE_1 = [0, 2950, 5950, 8950, 11950];

// relay / sprint
export const WAYPOINTS_TYPE_2 = [0, 800, 1600, 2450, 2500, 3300, 4100, 4950, 5000, 5800, 6600, 7500];
export const RANGE_TYPE_2 = [0, 2450, 4950];

export const RACE_TYPE_LONG = 1;
export const RACE_TYPE_SHORT = 2;

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
