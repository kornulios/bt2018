// LAPS WAYPONTS DEFINITIONS

// indi - 20km / 15km (4)
// mass - 15km / 12.5km (4)
// sprint - 10km / 7.5km (2)
// pursuit - 12.5 / 10km (4)
// relay - 4x7.5 / 4x6 (2)

// 20km:   [0, 1300, 2600, 3950, 4000,  5300, 6600, 7950, 8000,  9300, 10600, 11950, 12000,  13300, 14600, 15950, 16000, 17300, 18600, 20000],
// 15km:   [0, 1500, 2300, 2950, 3000, 4500, 5300, 5950, 6000, 7500, 8300, 8950, 9000, 10500, 11300, 11950, 12000, 13500, 14300, 15000],
// 12.5km: [0, 800, 1600, 2450, 2500,  3300, 4100, 4950, 5000,   5800, 6600, 7450, 7500,  8300, 9100, 9950,  10000, 10800, 11600, 12500],
// 10km:   [0, 1100, 2200, 3280, 3300, 4400, 5500, 6580, 6600, 7800, 8900, 10000],
// 7.5km:  [0, 800, 1600, 2450, 2500, 3300, 4100, 4950, 5000, 5800, 6600, 7500],
// 6km:    [0, 700, 1400, 1950, 2000,  2700, 3400, 3950, 4000,  4700, 5400, 6000]

export const WAYPOINTS_20KM = [0, 1300, 2600, 3950, 4000,  5300, 6600, 7950, 8000,  9300, 10600, 11950, 12000,  13300, 14600, 15950, 16000, 17300, 18600, 20000];
export const RANGES_20KM = [0, 3950, 7950, 11950, 15950];

export const WAYPOINTS_15KM = [0, 1500, 2300, 2950, 3000, 4500, 5300, 5950, 6000, 7500, 8300, 8950, 9000, 10500, 11300, 11950, 12000, 13500, 14300, 15000];
export const RANGES_15KM = [0, 2950, 5950, 8950, 11950];

export const WAYPOINTS_12_5KM = [0, 800, 1600, 2450, 2500,  3300, 4100, 4950, 5000,   5800, 6600, 7450, 7500,  8300, 9100, 9950,  10000, 10800, 11600, 12500];
export const RANGES_12_5KM = [0, 2450, 4950, 7450, 9950];

export const WAYPOINTS_10KM_LONG = [0, 1100, 2200, 3280, 3300, 4400, 5500, 6580, 6600, 7800, 8900, 10000];
export const RANGES_10KM_LONG = [0, 3280, 6580];

export const WAYPOINTS_10KM_SHORT = [0, 700, 1400, 1950, 2000, 2700, 3400, 3950, 4000, 4700, 5400, 5950, 6000, 6700, 7400, 7950, 8000, 8700, 9400, 10000];
export const RANGES_10KM_SHORT = [0, 1950, 3950, 5950, 7950];

export const WAYPOINTS_7_5KM = [0, 800, 1600, 2450, 2500, 3300, 4100, 4950, 5000, 5800, 6600, 7500];
export const RANGES_7_5KM = [0, 2450, 4950];

export const WAYPOINTS_6KM = [0, 700, 1400, 1950, 2000,  2700, 3400, 3950, 4000,  4700, 5400, 6000];
export const RANGES_6KM = [0, 1950, 3950];