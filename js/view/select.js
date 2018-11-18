function selectScreen() {
    var mainDiv = document.createElement('div'),
        view = game.view,
        teams = game.getTeams();

    mainDiv.classList.add('cls-team');
    mainDiv.id = 'select-team-view';
    mainDiv.append('Select your team:');

    //adding teams from the game
    for (var i = 0; i < teams.length; i++) {
        var el = view.getTeamViewTpl(teams[i]);
        mainDiv.appendChild(el);
    }

    mainDiv.addEventListener('click', function (e) {
        game.onChangeTeamSelect(e);
    });
    
    return mainDiv;
}