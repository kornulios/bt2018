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
		this.playerTeam = "";
	}

	loadPlayers() {
		//AJAX will go there 
		// getData();
		var teams = this.teams,
			res = [];

		for (var i = 0; i < 104; i++) {
			// var p = { name: "Player " + i }   //mock for players
			res.push({ name: "Player " + i, team: teams[Util.rand(teams.length - 1)] });
		}
		return res;
	}

	loadTeams() {
		//mock for teams
		var teamCount = 26;
		var teams = [];
		for (var i = 1; i < teamCount; i++) {
			teams.push({ name: 'Team ' + i, shortName: 'T' + i, flag: '', colors: [] });
		}
		return teams;
	}

	createChampionship(players) {
		return new Championship(players, trackData);
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
			this.championship = this.createChampionship(this.players);
			this.view.renderChampionshipView(this.championship);
			this.view.enableTeamSelector(this.teams);
		} else {
			console.log('No players loaded.');
		}
	}

	prepareNextRace() {
		this.view.showRunScreen();
	}

	render() {
		this.view.renderRaceView(this.championship.currentRace);
		// me.view.renderResults(me.race.results.getWaypointResults(me.selectedResults), me.selectedResults);
	}

	runGame(tFrame) {       //refactored with rAF
		let me = this;

		if (!tNow) {
			tNow = window.performance.now();
		}

		me.stopTimer = window.requestAnimationFrame(me.runGame.bind(me));

		for (let ticks = 0; ticks < 120; ticks++) {
			me.gameRunning = me.championship.runRace();
		}
		me.render();

		if (!me.gameRunning) {
			window.cancelAnimationFrame(me.stopTimer);
			me.view.showFinishScreen();
			alert('Race finished in ' + (tFrame - tNow) + 'ms');
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

	setGameSpeed() {    //not implemented
		debugger
		this.gameSpeed = 10;
	}

	getPlayerTeam() {
		return this.playerTeam;
	}

	onChangeTeamSelect(e) {
		this.playerTeam = e.target.value;
		this.view.renderChampionshipView(this.championship);
	}
}