// Championship View
function championshipScreen() {
    var view = game.view,
        mainDiv = document.createElement('div');

    view.clearMainView();

    mainDiv.innerHTML = view.getChampionshipTpl();
    mainDiv.addEventListener('click', function(e) {
        game.onChangeViewGender(e);
    });

    return mainDiv;
}
