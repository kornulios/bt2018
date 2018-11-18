// Championship View
function championshipScreen() {
    var view = game.view,
        mainDiv = document.createElement('div'),
        champDiv = document.createElement('div'),
        selectGenderDiv = document.createElement('div');

    view.clearMainView();

    selectGenderDiv.innerHTML = '<div class="gender-select"><a id="gender-men" data="men">Men</a><a id="gender-woman">Women</a></div>';
    champDiv.innerHTML = view.getChampionshipTpl();
    selectGenderDiv.addEventListener('click', function(e) {
        game.onChangeViewGender(e);
    });

    mainDiv.appendChild(selectGenderDiv);
    mainDiv.appendChild(champDiv);

    return mainDiv;
}
