function teamScreen() {
    var mainDiv = document.createElement('div');
    var tplDiv = document.createElement('div');
    // var tpl = game.view.renderTeamView();
    
    tplDiv.innerHTML = game.view.getMyTeamViewTpl();
    mainDiv.appendChild(tplDiv);

    mainDiv.addEventListener('click', function(e) { 
        // console.log(e.target);
    });

    return mainDiv;
}