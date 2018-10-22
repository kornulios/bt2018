class Game {
	constructor() {
		this.gameSpeed = 1000 / 60;      //50 ticks per second
		this.gameTimer;
		this.gameRunning = false;

		this.view = new View();
		this.championship = Object.create(null);
		this.players = this.loadPlayers();

		this.selectedResults = 0;
	}

	loadPlayers() {
		//AJAX will go there 
		// getData();
		var teams = this.loadTeams(),
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
		} else {
			console.log('No players loaded.');
		}
	}

	prepareNextRace() {
		this.view.showRunScreen();
	}

	render() {
		let me = this;
		me.view.renderPlayers(me.race);
		me.view.renderResults(me.race.results.getWaypointResults(me.selectedResults), me.selectedResults);
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
			// alert('Race finished in ' + (tFrame - tNow) + 'ms');
			me.view.showFinishScreen();
		}
	}

	calculateRace() {
		//used to skip race 
		let me = this;
		let gameRunning = true;

		do
			gameRunning = me.championship.runRace();
		while (gameRunning)

		me.view.showFinishScreen();
		me.view.renderChampionshipView(me.championship);
		me.view.renderResults(me.championship.getLastRace());
	}

	setGameSpeed() {    //not implemented
		debugger
		this.gameSpeed = 10;
	}
}