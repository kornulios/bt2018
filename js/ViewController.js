// renders one player
class View {
	constructor() {
		this.trackView = document.querySelector('#track-info');
		this.mainView = document.querySelector('#main-view');
		this.resultView = document.querySelector('#results-view');
	}

	renderScreen(screenDiv) {
		//render 
		this.clearMainView();
		this.mainView.appendChild(screenDiv);
	}

	renderRaceView() {
		var race = game.getCurrentRace(),
			players = race.getPlayers(),
			playerTeam = game.getPlayerTeam(),
			raceName = race.getRaceName(),
			raceStatus = race.getRaceStatus(),
			raceTimer = Util.convertToMinutes(race.getTime()),
			raceResults = race.results,
			tpl = '';

		tpl += `<div>${raceStatus} - ${raceName} Gametime: ${raceTimer}</div>`;
		for (var p of players) {
			var playerTeamCls = playerTeam == p.team.name ? 'player-team' : '',
			shootingResult = raceResults.getShootingResult(p.name);

			tpl += '<div class="row ' + playerTeamCls + '">';
			tpl += this.drawCell(p.number, 'player-number')
				+ this.drawCell(p.name, 'player-name')
				+ this.drawCell(p.team.shortName)
				+ this.drawCell('(' + Util.convertToShootingString(shootingResult) + ')')
				+ this.drawCell(p.baseSpeed)
				+ this.drawCell(p.currentSpeed.toFixed(2))
				+ this.drawCell(p.distance.toFixed(2));
			tpl += '</div>';
		}

		return tpl;
	}

	renderDiv(text, cls) {      //not used, look for further implementation cases
		let myDiv = document.createElement('div');
		let newText = document.createTextNode(text);
		myDiv.classList.add(cls);
		myDiv.appendChild(newText);
		return myDiv;
	}

	getResultsTpl(waypoint) {
		var me = this,
			race = game.championship.getLastRace(),
			playerTeam = game.getPlayerTeam(),
			raceName = race.getRaceName(),
			results = race.getFinishResult(),
			displayWp = waypoint || race.track.waypointsNum() - 1,
			tpl = '', place = 1;

		if (race.status !== 'Finished') {
			return '<div>No results available</div>';
		}

		tpl = `Standings at finish`;
		tpl += `<div>${raceName}</div>`;
		for (var r of results) {
			var playerTeamCls = playerTeam == r.team.name ? 'player-team' : '';
			tpl += '<div class="row ' + playerTeamCls + '">';
			tpl += `<div style="width:30px;">${place}</div>`
				+ me.drawCell(r.playerName, 'player-name')
				+ me.drawCell(r.team.shortName)
				+ me.drawCell('(' + Util.convertToShootingString(r.shooting) + ')')
				+ me.drawCell(Util.convertToMinutes(r.time));
			tpl += '</div>';
			place++;
		}
		tpl = `<div>${tpl}</div>`;
		return tpl;
	}

	getPlayerTeamControlsTpl() {
		var playerTeam = game.getPlayerTeam(),
			players = game.getCurrentRace().getPlayerTeamMembers(),
			tpl = '<div>';

		players.forEach(function(player) {
			tpl += getControlTpl(player.getRaceStats());
		});

		function getControlTpl(p) {
			var tpl = '<div class="player-control">';
			tpl += `<ul><li>${p.number} ${p.name}</li>
				<li>${p.status}</li>
				<li>${p.distance}</li>
				<li>Controls</li>
				<li>SPD:${p.speed} STA:${p.stamina}</li>
				</ul>`;
			tpl += '</div>'
			return tpl;
		}

		tpl += '</div>';
		return tpl;
	}

	

	// renderResults(race, waypoint) { //should render sorted results per waypoint
	// 	// debugger
	// 	var me = this,
	// 		raceName = race.getRaceName(),
	// 		results = race.getFinishResult(),
	// 		displayWp = waypoint || race.track.waypointsNum() - 1,
	// 		tpl = "",
	// 		place = 1;

	// 	//render controls
	// 	tpl = `Standings at ${displayWp}`;
	// 	tpl += `<div>${raceName}</div>`;
	// 	for (let r of results) {
	// 		tpl += '<div class="row">';
	// 		tpl += `<div style="width:30px;">${place}</div>`
	// 			+ me.drawCell(r.playerName, 'player-name')
	// 			+ me.drawCell(r.team)
	// 			+ me.drawCell('(' + Util.convertToShootingString(r.shooting) + ')')
	// 			+ me.drawCell(Util.convertToMinutes(r.time));

	// 		tpl += '</div>';
	// 		place++;
	// 	}
	// 	me.resultView.innerHTML = tpl;
	// }

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

	getChampionshipTpl() {
		//TODO screen with player stats and points
		var me = this,
			championship = game.getChampionship(),
			players = championship.getChampionshipStandings(),
			playerTeam = game.getPlayerTeam(),
			viewGender = game.getViewGender();

		var tpl = '';
		tpl += '<div>Championship standings</div>';
		tpl += me.drawRow(['Name', 'Team', 'SPD', 'ACC', 'STR', 'Points']);
		for (let p of players) {
			if (p.gender == viewGender) {
				var playerTeamCls = playerTeam == p.team.name ? 'player-team' : '';
				tpl += '<div class="row ' + playerTeamCls + '">';
				tpl += this.drawCell(p.name, 'player-name');
				tpl += this.drawCell(p.team.shortName);
				tpl += this.drawCell(p.baseSpeed);
				tpl += this.drawCell(p.accuracy);
				tpl += this.drawCell(p.strength);
				tpl += this.drawCell(p.points);
				tpl += '</div>';
			}
		}

		return tpl;
	}

	getRaceScheduleTpl() {
		var me = this,
			raceNames = game.championship.getRacesSchedule(),
			stageName = game.championship.getStageName(),
			tpl = '';

		tpl = '<div>';
		tpl += `<h2>Stage: ${stageName}</h2>`;
		raceNames.forEach(function (raceData) {
			tpl += `<div>${raceData.name} ${raceData.status}</div>`
		});
		tpl += '</div>'

		return tpl;
	}

	getMyTeamViewTpl(team) {
		var team = team || game.getPlayerTeam(),
			players = game.getPlayers();

		var tpl = '';
		tpl += this.drawRow(['Name', 'Team', 'SPD', 'ACC', 'STR', 'Points']);

		for (var p of players) {
			if (p.team.name == team) {
				tpl += '<div class="row">';
				tpl += this.drawCell(p.name, 'player-name');
				tpl += this.drawCell(p.team.shortName);
				tpl += this.drawCell(p.baseSpeed);
				tpl += this.drawCell(p.accuracy);
				tpl += this.drawCell(p.strength);
				tpl += this.drawCell(p.points);
				tpl += '</div>';
			}
		}

		return tpl;
	}

	getTeamViewTpl(team) {
		var teamDiv = document.createElement('button');

		teamDiv.classList.add('team-button');
		teamDiv.innerHTML = team.name;

		return teamDiv
	}

	selectTeamDetails(team) {
		var teamDiv = document.getElementById('select-team-view'),
			tplDiv = document.getElementById('team-description-view') || document.createElement('div'),
			tpl = '';

		tplDiv.id = 'team-description-view';

		tpl += `<h4>${team.name}</h4>`;
		tpl += `<div>${team.description}</div>`;
		tpl += `<h4>Team members:</h4>`;
		tpl += this.getMyTeamViewTpl(team.name);

		tplDiv.innerHTML = tpl;
		teamDiv.appendChild(tplDiv);
	}

	clearMainView() {
		this.mainView.innerHTML = "";
		this.resultView.innerHTML = "";
	}

	// showRunScreen() {
	// 	document.getElementById('run-btn').classList.remove('hidden');
	// 	document.getElementById('next-btn').classList.add('hidden');
	// }

	showFinishScreen() {
		document.getElementById('finish-btn').classList.remove('hidden');
		document.getElementById('run-btn').classList.add('hidden');
	}

	drawCell(text, cls) {
		return (cls) ? `<div class=${cls}>${text}</div>` : `<div>${text}</div>`;
	}

	drawRow(args, cls) {
		// cls - pass a string of classes
		let tpl = '';
		tpl += cls ? '<div class="row ' + cls + '">' : '<div class="row">';

		for (let a of args) {
			tpl += this.drawCell(a);
		}

		tpl += '</div>';
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
