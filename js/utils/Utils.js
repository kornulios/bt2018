export const Utils = {
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
			var currentRange = shootingResult[i].filter(function (item) {
				if (!item) return true;
			});
			res.push(currentRange.length);
		}
		return res.length > 0 ? res.join('+') : '-';
	}
};