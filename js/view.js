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

	renderRaceView(race) {
		var players = race.getPlayers(),
			playerTeam = game.getPlayerTeam(),
			raceName = race.getRaceName(),
			tpl = '';

		this.clearMainView();

		tpl += `<div>Race progress - ${raceName}</div>`;
		for (var p of players) {
			var playerTeamCls = playerTeam == p.team.name ? 'player-team' : '';
			tpl += '<div class="row ' + playerTeamCls + '">';
			tpl += this.drawCell(p.number, 'player-number')
				+ this.drawCell(p.name, 'player-name')
				+ this.drawCell(p.team.shortName)
				+ this.drawCell(p.baseSpeed)
				+ this.drawCell(p.currentSpeed.toFixed(2))
				+ this.drawCell(p.distance.toFixed(2));
			tpl += '</div>';
		}

		this.mainView.innerHTML = tpl;
	}

	renderStartView(race) {

	}

	renderDiv(text, cls) {      //not used, look for further implementation cases
		let myDiv = document.createElement('div');
		let newText = document.createTextNode(text);
		myDiv.classList.add(cls);
		myDiv.appendChild(newText);
		return myDiv;
	}

	renderResults(race, waypoint) { //should render sorted results per waypoint
		// debugger
		var me = this,
			raceName = race.getRaceName(),
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
				+ me.drawCell(r.playerName, 'player-name')
				+ me.drawCell(r.team)
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

	getChampionshipTpl() {
		//TODO screen with player stats and points
		var me = this,
			// players = championship.getStandingsResults(),
			players = game.getPlayers(),
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

		// this.mainView.innerHTML = tpl;

		return tpl;

		document.getElementsByClassName('gender-select')[0].addEventListener('click', function (e) {
			game.onChangeViewGender(e);
		});

		document.getElementById('start-btn').classList.add('hidden');
		document.getElementById('run-btn').classList.add('hidden');
		document.getElementById('finish-btn').classList.add('hidden');
		document.getElementById('next-btn').classList.remove('hidden');
	}

	renderTeamView() {
		var team = game.getPlayerTeam(), 
			players = game.getPlayers();

		// this.mainView.clearMainView();

		var tpl = '';
		tpl += '<div id="team-mgmt">Team management</div>';
		tpl += this.drawRow(['Name', 'Team', 'SPD', 'ACC', 'STR', 'Points']);

		for (var p of players) {
			if (p.team.name == team) {
				// var playerTeamCls = playerTeam == p.team.name ? 'player-team' : '';
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

	// enableTeamSelector(teams) {
	// 	var teamSelector = document.getElementById('team-select');
	// 	for (var i = 0; i < teams.length; i++) {
	// 		var el = document.createElement('option');
	// 		el.text = teams[i].name;
	// 		teamSelector.add(el);
	// 	}

	// 	teamSelector.disabled = false;
	// 	teamSelector.onchange = game.onChangeTeamSelect.bind(game);
	// }

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
