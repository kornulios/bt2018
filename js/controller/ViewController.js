import { Utils } from '../utils/Utils.js';

export class View {
	constructor() {
		this.trackView = document.querySelector('#track-info');
		this.mainView = document.querySelector('#main-view');
		this.resultView = document.querySelector('#results-view');
	}

	renderShortRelayResults(results, track) {
		const teamResults = results.data
			.filter(res => res.waypoint === track.getFinishWaypoint() && res.leg === 4);

		const htmlResults = teamResults.map((result, i) => {
			const item = `<div>
			<span>${i + 1}</span>
			<span>${result.team}</span>
			<span>${Utils.convertToMinutes(result.time / 1000)}</span>
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

		// console.log(teamTotalResults);
		// console.log(teamPlayerResults);
		const htmlResults = Object.keys(teamTotalResults).map(teamName => {
			const playerItems = teamPlayerResults[teamName].map(player => {
				return `<div><span>${player.playerName}</span> <span>${Utils.convertToMinutes(player.time / 1000)}</span></div>`
			});

			const item = `<div>
				<span>${teamName}</span>
				<span>${Utils.convertToMinutes(teamTotalResults[teamName] / 1000)}</span>
				<div class="relay-player-items">${playerItems.join('')}</div>
			</div>`;

			return item;

		});

		// const htmlResults = teamResults.map((result, i) => {


		// 	return item;
		// });

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

			const shootingTotal = result.result.filter(q => q === 0).length;

			return { ...acc, [name]: acc[name] + shootingTotal }
		}, {});

		const htmlResults = playerResults.map((result, i) => {

			return `<div class="result-row"><span>${i + 1}</span> 
			<span>${result.playerName}</span>
			<span>${rangeResult[result.playerName]}</span>
			<span>${Utils.convertToMinutes(result.time / 1000)}</span>
			</div>`
		});

		document.querySelector('#run').innerHTML = `<div>${htmlResults.join('')}</div>`;
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
				const item = `<div>Range ${r.range}: ${r.result.filter(q => q === 0).length}</div>`;

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
