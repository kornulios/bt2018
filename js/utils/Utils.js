export const Utils = {
	rand: function (max, min) {
		min = min || 0;
		max++;
		return Math.floor(Math.random() * (max - min) + min);
	},

	convertToMinutes: (time) => {
		const hours = Math.floor(time / 3600);
		const minutes = Math.floor(time / 60) - hours * 60;
		const seconds = time - Math.floor(time / 60) * 60;

		const forwardZero = (seconds < 10 && (minutes > 0 || hours > 0)) ? '0' : '';
		const millis = seconds.toFixed(1).split('.')[1];
		let timeStr = "";

		//apply formatting
		const secondsStr = forwardZero + Math.floor(seconds);
		const minutesStr = hours > 0 ?
			(minutes < 10) ? `0${minutes}:` : `${minutes}:`
			: (minutes > 0) ? `${minutes}:` : '';

		const hoursStr = hours > 0 ? hours + ':' : '';


		timeStr = hoursStr + minutesStr + secondsStr + '.' + millis;

		return timeStr;
	},

	convertToMinutesRelative: (time1, time2) => {
		// const hours = Math.floor(time / 3600);
		// const minutes = Math.floor(time / 60) - hours * 60;
		// const seconds = time - Math.floor(time / 60) * 60;

		// const forwardZero = (seconds < 10 && (minutes > 0 || hours > 0)) ? '0' : '';
		// const millis = seconds.toFixed(1).split('.')[1];
		// let timeStr = "";

		// //apply formatting
		// const secondsStr = forwardZero + Math.floor(seconds);
		// const minutesStr = hours > 0 ?
		// 	(minutes < 10) ? `0${minutes}:` : `${minutes}:`
		// 	: (minutes > 0) ? `${minutes}:` : '';

		// const hoursStr = hours > 0 ? hours + ':' : '';


		// timeStr = hoursStr + minutesStr + secondsStr + '.' + millis;

		// return timeStr;
	},

	convertToShootingString: function (shootingResult) {
		var res = [];
		for (var i = 0; i < shootingResult.length; i++) {
			var currentRange = shootingResult[i].filter(function (item) {
				if (!item) return true;
			});
			res.push(currentRange.length);
		}
		return res.length > 0 ? res.join('+') : '-';
	}
};