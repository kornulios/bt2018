function selectScreen() {
    var mainDiv = document.createElement('div'),
        teamSelector = document.createElement('select'),
        option = document.createElement("option"),
        teams = game.getTeams();

    mainDiv.classList.add('cls-team');
    teamSelector.setAttribute('id', 'team-select');
    option.text = 'Select your team...';
    teamSelector.add(option);

    //adding teams from the game
    for (var i = 0; i < teams.length; i++) {
        var el = document.createElement('option');
        el.text = teams[i].name;
        teamSelector.add(el);
    }

    teamSelector.onchange = game.onChangeTeamSelect.bind(game);
    
    mainDiv.appendChild(teamSelector);

    return mainDiv;
}