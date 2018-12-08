class Game {
	constructor() {
		this.gameSpeed = 1000 / 60;      //50 ticks per second
		this.gameTimer;
		this.gameRunning = false;

		this.view = new View();
		this.championship = Object.create(null);

		this.teams = this.loadTeams();
		this.players = this.loadPlayers();

		this.selectedResults = 0;
		this.selectedGender = 'men';
		this.playerTeam = "";
	}

	loadPlayers() {
		//AJAX will go there 
		// getData();
		var teams = this.teams,
			playerCount = 208,
			res = [];

		for (var i = 0; i < playerCount; i++) {
			// var p = { name: "Player " + i }   //mock for players
			res.push({
				name: "Player " + i,
				gender: i < playerCount / 2 ? 'men' : 'women',
				team: teams[Util.rand(teams.length - 1)]
			});
		}
		return res;
	}

	loadTeams() {
		//mock for teams
		var teamCount = 26;
		var teams = [];
		for (var i = 1; i < teamCount; i++) {
			teams.push({
				name: 'Team ' + i,
				shortName: 'T' + i,
				flag: '',
				colors: [],
				description: "Team " + i + mockData.teamDesc
			});
		}
		return teams;
	}

	mainScreen() {
		let me = this;
		me.view.renderChampionshipView(me.championship);
	}

	setResultView(viewNum) {
		let me = this;
		me.selectedResults = viewNum;
		me.view.renderResults(me.race.results.getWaypointResults(me.selectedResults), me.selectedResults);
	}

	startNewChampionship() {
		if (this.players.length > 0) {
			this.championship = new Championship(this.players, trackData);
		} else {
			console.log('No players loaded.');
		}
	}

	prepareNextRace() {
		this.view.renderRaceView(this.championship.currentRace);
		this.view.showRunScreen();
	}

	render() {
		this.view.currentScreen.update();
		// this.view.renderRaceView(this.championship.currentRace);
		// me.view.renderResults(me.race.results.getWaypointResults(me.selectedResults), me.selectedResults);
	}

	runGame(tFrame) {       //refactored with rAF
		var me = this,
			gameSpeed = 50,
			gameTick = 1000 / 60,
			raceRunning = true;

		// if (!tNow) {
		// 	tNow = window.performance.now();
		// }
		
		for (var ticks = 0; ticks < gameSpeed; ticks++) {
			raceRunning = me.championship.runRace(gameTick);
			if (!raceRunning) break;
		}
		me.render();

		me.stopTimer = window.requestAnimationFrame(me.runGame.bind(me));

		if (!raceRunning) {
			window.cancelAnimationFrame(me.stopTimer);
			// me.view.showFinishScreen();
			// me.view.renderChampionshipView(me.championship);
			// alert('Race finished in ' + (tFrame - tNow) + 'ms');
		}
	}

	calculateRace() {
		//used to skip race 
		let me = this;
		let gameRunning = true;
		console.time();
		do
			gameRunning = me.championship.runRace();
		while (gameRunning)

		me.view.showFinishScreen();
		me.view.renderChampionshipView(me.championship);
		me.view.renderResults(me.championship.getLastRace());
		console.timeEnd();
	}

	// setGameSpeed() {    //not implemented
	// 	debugger
	// 	this.gameSpeed = 10;
	// }

	getPlayerTeam() {
		return this.playerTeam.name;
	}

	getTeams() {
		return this.teams;
	}

	getPlayers() {
		return this.championship.getPlayers();
	}

	getViewGender() {
		return this.selectedGender;
	}

	getCurrentRace() {
		return this.championship.currentRace;
	}

	onChangeTeamSelect(e) {
		var teamName = e.target.textContent;

		this.startNewChampionship(); //should go to Start button

		for (var i = 0; i < this.teams.length; i++) {
			if (this.teams[i].name == teamName) {
				this.playerTeam = this.teams[i];
				this.view.selectTeamDetails(this.teams[i]);
			}
		}
		if (this.playerTeam == '') {
			console.log('Selected team not defined');
		}
	}

	onChangeViewGender(e) {
		this.selectedGender = e.target.getAttribute('data');
		refreshTab('championship');
	}
}