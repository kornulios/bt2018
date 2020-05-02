import { Utils } from '../utils/Utils.js';

export class View {
	constructor() {
		this.trackView = document.querySelector('#track-info');
		this.mainView = document.querySelector('#main-view');
		this.resultView = document.querySelector('#results-view');
	}

	drawMapBeta() {

	}

	renderProgress(race) {
		const players = race.players;
		const raceFinished = race.raceFinished;
		const timer = Utils.convertToMinutes(race.raceTimer / 1000);

		const htmlProgress = players.map(player => {
			return `<div>${player.name} ${player.status} ${player.distance.toFixed(1)}</div>`;
		}).join('');

		const htmlRace = `<div>Race finished: ${raceFinished}</div>
		<div>Race timer: ${timer}</div>
		<div>${htmlProgress}</div>`;

		document.querySelector('#run').innerHTML = `<div>${htmlRace}</div>`;
	};

	renderShortRelayResults(results, track) {
		const teamResults = results.data
			.filter(res => res.waypoint === track.getFinishWaypoint() && res.leg === 4);

		const htmlResults = teamResults.map((result, i) => {
			const timeStr = i > 0 ?
				'+' + Utils.convertToMinutes((result.time - teamResults[0].time) / 1000)
				: Utils.convertToMinutes(result.time / 1000);

			const item = `<div>
			<span>${i + 1}</span>
			<span>${result.team}</span>
			<span>${timeStr}</span>
			</div>`;

			return item;
		});

		document.querySelector('#run').innerHTML = `<div>${htmlResults.join('')}</div>`;
	}

	renderRelayResults(results, track) {

		const teamTotalResults = results.data
			.filter(res => res.waypoint === track.getFinishWaypoint() && res.leg === 4)
			.reduce((acc, result) => {
				const teamName = result.team;
				if (!acc[teamName]) acc[teamName] = [];

				return { ...acc, [teamName]: result.time };
			}, {});

		const teamTotalShooting = results.shootingData
			.reduce((acc, result) => {
				const teamName = result.team;
				if (!acc[teamName]) acc[teamName] = { misses: 0, ammo: 0 };

				return { ...acc, [teamName]: { misses: acc[teamName].misses + result.result, ammo: acc[teamName].ammo + result.ammo } }
			}, {});

		const teamPlayerResults = results.data
			.filter(res => res.waypoint === track.getFinishWaypoint())
			.reduce((acc, result) => {
				const teamName = result.team;
				if (!acc[teamName]) acc[teamName] = [];

				return {
					...acc,
					[teamName]:
						[...acc[teamName], { playerName: result.playerName, time: result.time, leg: result.leg }]
				};
			}, {});

		const htmlResults = Object.keys(teamTotalResults).map(teamName => {
			const playerItems = teamPlayerResults[teamName].map(player => {
				return `<div><span>${player.playerName}</span> <span>${Utils.convertToMinutes(player.time / 1000)}</span></div>`
			});

			const item = `<div>
				<span>${teamName}</span>
				<span>${teamTotalShooting[teamName].misses}+${teamTotalShooting[teamName].ammo}</span>
				<span>${Utils.convertToMinutes(teamTotalResults[teamName] / 1000)}</span>
				<div class="relay-player-items">${playerItems.join('')}</div>
			</div>`;

			return item;

		});

		document.querySelector('#run').innerHTML = `<div>${htmlResults.join('')}</div>`;
	}


	renderShortResults(results, track) {

		const playerResults = results.data
			.filter(res => res.waypoint === track.getFinishWaypoint())
			.sort((t1, t2) => t1.time >= t2.time ? 1 : -1);

		const rangeResult = results.shootingData.reduce((acc, result) => {
			const name = result.playerName;
			if (!acc[name]) {
				acc[name] = 0;
			}

			const shootingTotal = result.result;

			return { ...acc, [name]: acc[name] + shootingTotal }
		}, {});

		const htmlResults = playerResults.map((result, i) => {

			return `<div class="result-row"><span>${i + 1}</span> 
			<span>${result.playerName}</span>
			<span>${rangeResult[result.playerName]}</span>
			<span>${Utils.convertToMinutes(result.time / 1000)}</span>
			</div>`
		});

		document.querySelector('#finish-results').innerHTML = `<div>${htmlResults.join('')}</div>`;
	}

	renderResults(results, track) {
		//results fetch
		const playerResults = results.data.reduce((acc, result) => {
			const name = result.playerName;
			if (!acc[name]) {
				acc[name] = [];
			}

			return { ...acc, [name]: [...acc[name], { wpName: track.getWaypointName(result.waypoint), time: Utils.convertToMinutes(result.time / 1000) }] }
		}, {});

		const rangeResults = results.shootingData.reduce((acc, result) => {
			const name = result.playerName;
			if (!acc[name]) {
				acc[name] = [];
			}

			return { ...acc, [name]: [...acc[name], { range: result.range, result: result.result }] }
		}, {});

		//html
		const htmlResults = Object.keys(playerResults).map(name => {
			const resultItems = playerResults[name].map(r => {
				const item = `<span class="waypoint">${r.wpName}</span><span class="time">${r.time}</span>`;

				return `<li class="result-list-item">${item}</li>`
			});
			const rangeItems = rangeResults[name].map(r => {
				const item = `<div>Range ${r.range}: ${r.result}</div>`;

				return `<div>${item}</div>`
			});

			const list = `<div class="result-block">${name}<ul class="result-list">${resultItems.join('')}</ul>${rangeItems.join('')}</div>`;

			return list;
		}).join('');

		document.querySelector('#run').innerHTML = `<div class="results">${htmlResults}</div>`;
	}

	// for future race draw
	drawOnCanvas() {
		let myCanvas = document.querySelector('#main-canvas');
		let context = myCanvas.getContext("2d");

		var width = 125;  // Triangle Width
		var height = 105; // Triangle Height
		var padding = 20;

		context.beginPath();
		context.moveTo(padding + width / 2, padding);        // Top Corner
		context.lineTo(padding + width, height + padding); // Bottom Right
		context.lineTo(padding, height + padding);         // Bottom Left
		context.closePath();

		context.fillStyle = "#ffc821";
		context.fill();
	}

}
