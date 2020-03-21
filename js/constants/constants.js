export const PENALTY_TYPE = { LAP: 1, MINUTE: 0 };
export const RACE_START_TYPE = {
  ALL: 1,
  SEPARATE: 2,
  PURSUIT: 3,
  RELAY: 4
};

//AI behaviour constants
export const AI_BEHAVIOUR = {
  AGGRESSIVE: [50, 25, 25],
  WEAK: [25, 25, 50],
  NORMAL: [33, 34, 33],
};

export const PLAYER_RUN_STATUS = { NORMAL: 0, EASE: 1, PUSHING: 2 };

export const START_TIME_INTERVAL = 30;		// in seconds
export const PURSUIT_PLAYERS_NUM = 60;
export const PENALTY_LAP_LENGTH = 150;
export const PENALTY_MINUTE = 100;

export const BASE_SPEED_MOD = 0.05;

