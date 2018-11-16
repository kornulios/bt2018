function teamScreen() {
    var mainDiv = document.createElement('div');
    
    mainDiv.innerHTML = game.view.renderTeamView();

    return mainDiv;
}