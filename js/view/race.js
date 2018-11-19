function raceScreen() {
    var me = this;
    var view = game.view;

    me.mainDiv = document.createElement('div');
    me.raceDiv = document.createElement('div');
    var controlDiv = document.createElement('div');

    //create controls
    controlDiv.classList.add('gray-back');
    var btnStartList = controlDiv.appendChild(document.createElement('button')),
        btnRunRace = controlDiv.appendChild(document.createElement('button'));

    btnStartList.textContent = 'Start list';
    btnRunRace.textContent = 'Run race';

    btnStartList.addEventListener('click', function (e) {
        // me.update();
    });

    btnRunRace.addEventListener('click', function (e) {
        game.runGame();
    });

    //render list

    //render main race div (what graphics will be used: canvas, svg, dom ???)
    me.raceDiv.id = 'race-view';
    me.raceDiv.innerHTML = view.renderRaceView();

    me.mainDiv.appendChild(controlDiv);
    me.mainDiv.appendChild(me.raceDiv);
};

raceScreen.prototype.update = function () {
    var view = game.view;
    this.raceDiv.innerHTML = view.renderRaceView();
}

raceScreen.prototype.render = function () {
    return this.mainDiv;
}