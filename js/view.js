// renders one player
class View {
	constructor() {
		this.trackView = document.querySelector('#track-info');
		this.mainView = document.querySelector('#main-view');
		this.resultView = document.querySelector('#results-view');
	}

	renderPlayers(race) {
		let me = this;
		// let mainDiv = document.createElement('div');
		let mainDiv = document.createDocumentFragment();

		for (let p of race.players) {
			let rowDiv = document.createElement('div');
			let spColor = (p.state == CONSTANT.RUNSTATE.NORMAL) ? 'black' : (p.state == CONSTANT.RUNSTATE.EASE) ? 'red' : 'green';
			let shootTpl = (p.shooting) ? `[${race.results.getShootingResult(p.name, p.rangeNum)}]` : `(${race.results.getMissesByRange(p.name)})`;
			let pStatus = p.status;

			let tpl = `<div>${p.number} ${p.name}</div>
        <div>${p.baseSpeed}</div>
        <div style="color: ${spColor}">${p.currentSpeed.toFixed(2)}</div>
        <div>${p.status}</div>
        <div>${shootTpl}</div>
        <div>${p.distance.toFixed(2)}m</div>`;
			tpl = `<div class="row">${tpl}</div>`;
			rowDiv.innerHTML = tpl;

			mainDiv.appendChild(rowDiv);
		}

		//render 
		this.clearMainView();
		this.mainView.appendChild(mainDiv);
	}

	renderDiv(text, cls) {      //not used, look for further implementation cases
		let myDiv = document.createElement('div');
		let newText = document.createTextNode(text);
		myDiv.classList.add(cls);
		myDiv.appendChild(newText);
		return myDiv;
	}

	// renderResults_old(results, waypoint) { //should render sorted results per waypoint
	// 	let me = this;
	// 	let tpl = "";
	// 	let place = 1;

	// 	//render controls
	// 	tpl = `Standings at ${waypoint}`;
	// 	for (let r of results) {
	// 		tpl += '<div class="row">';
	// 		tpl += `<div style="width:30px;">${place}</div>` + me.drawCell(r.playerName) + me.drawCell((r.resultTime));
	// 		tpl += '</div>';
	// 		place++;
	// 	}
	// 	me.resultView.innerHTML = tpl;
	// }

	renderResults(race, waypoint) { //should render sorted results per waypoint
		// debugger
		var me = this,
			raceName = race.getName(),
			results = race.getFinishResult(),
			displayWp = waypoint || race.track.waypointsNum() - 1,
			tpl = "",
			place = 1;

		//render controls
		tpl = `Standings at ${displayWp}`;
		tpl += `<div>${raceName}</div>`;
		for (let r of results) {
			tpl += '<div class="row">';
			tpl += `<div style="width:30px;">${place}</div>`
				+ me.drawCell(r.playerName)
				+ me.drawCell(r.team.shortName)
				+ me.drawCell('(' + Util.convertToShootingString(r.shooting) + ')')  
				+ me.drawCell(Util.convertToMinutes(r.time));

			tpl += '</div>';
			place++;
		}
		me.resultView.innerHTML = tpl;
	}

	renderTrackInfo(race) {
		let tpl = '';
		tpl = `<div>${race.name}</div>`;
		this.trackView.innerHTML = tpl;
		for (let i = 0; i < race.track.waypoints.length; i++) {
			let newLink = document.createElement('a');
			newLink.classList.add('res-link');
			newLink.innerHTML = race.track.waypoints[i].toFixed(0);
			newLink.addEventListener('click', function () {
				game.setResultView(i);
			});
			this.trackView.appendChild(newLink);
		}
	}

	renderChampionshipView(championship) {
		//TODO screen with player stats and points
		let me = this;
		let players = championship.getStandingsResults();
		this.clearMainView();

		let tpl = '';
		tpl += '<div>Championship standings</div>';
		tpl += me.drawRow(['Name', 'Team', 'Speed', 'Accuracy', 'Strength', 'Points']);
		for (let p of players) {
			tpl += this.drawRow([p.name, p.team.shortName, p.baseSpeed, p.accuracy, p.strength, championship.points[p.name]]);
		}

		this.mainView.innerHTML = tpl;

		document.getElementById('start-btn').classList.add('hidden');
		document.getElementById('run-btn').classList.add('hidden');
		document.getElementById('finish-btn').classList.add('hidden');
		document.getElementById('next-btn').classList.remove('hidden');
	}

	renderRaceView(race) {
		//TODO render race with players and results
	}

	clearMainView() {
		this.mainView.innerHTML = "";
		this.resultView.innerHTML = "";
	}

	showRunScreen() {
		document.getElementById('run-btn').classList.remove('hidden');
		document.getElementById('next-btn').classList.add('hidden');
	}

	showFinishScreen() {
		document.getElementById('finish-btn').classList.remove('hidden');
		document.getElementById('run-btn').classList.add('hidden');
	}

	drawCell(text) {
		return `<div>${text}</div>`;
	}

	drawRow(args) {
		let tpl = '';
		tpl += '<div class="row">'
		for (let a of args) {
			tpl += this.drawCell(a);
		}
		tpl += '</div>'
		return tpl;
	}

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
