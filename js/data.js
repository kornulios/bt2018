function getData() {
	return axios.get('http://localhost:3000/data');
}

var debugProfiler = {};

var Util = {
	rand: function (max, min) {
		min = min || 0;
		max++;
		return Math.floor(Math.random() * (max - min) + min);
	},

	convertToMinutes: function (time) {
		var minutes = Math.floor(time / 60),
			seconds = time - minutes * 60,
			forwardZero = (seconds < 10 && minutes > 0) ? '0' : '',
			millis = seconds.toFixed(1).split('.')[1],
			timeStr = "";

		//apply formatting
		seconds = forwardZero + Math.floor(seconds);
		minutes = (minutes > 0) ? minutes + ':' : '';
		timeStr = minutes + seconds + '.' + millis;

		return timeStr;
	},

	convertToShootingString: function (shootingResult) {
		var res = [];
		for (var i = 0; i < shootingResult.length; i++) {
			var currentRange = shootingResult[i].filter(function (el) {
				if (!el) return true;
			});
			res.push(currentRange.length);
		}
		return res.length > 0 ? res.join('+') : '-';
	}
};

var CONSTANT = {
	PENALTY_TYPE: { LAP: 1, MINUTE: 0 },
	RACE_START_TYPE: {
		ALL: 1,
		SEPARATE: 2,
		PURSUIT: 3
	},

	//AI behaviour constants
	AI: {
		AGGRESSIVE : [50, 25, 25],
		WEAK : [25, 25, 50],
		NORMAL : [33, 34, 33],
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
		stats: raceTypes.massStart
	},
	{
		location: 'Ruhpolding',
		coordsMap: [],
		stats: raceTypes.individual
	}
];

var teamData = [
	{ name: 'Germany', shortName: 'GER', flag: '', colors: [] },
	{ name: 'Ukraine', shortName: 'UKR', flag: '', colors: [] },
	{ name: 'Bielarus', shortName: 'BEL', flag: '', colors: [] },
	{ name: 'Germany', shortName: 'GER', flag: '', colors: [] },
	{ name: 'Germany', shortName: 'GER', flag: '', colors: [] },
];

var mockData = {
	teamDesc: ' is a potent team with some strong players as well as fresh growing stars. Player should rely on skill in order to bring this to victory.'
};