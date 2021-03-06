// Championship View
function championshipScreen() {
    var view = game.view,
        selectedGender = game.selectedGender,
        controlButtons = ['Men', 'Women', 'Schedule'],
        mainDiv = document.createElement('div'),
        champDiv = document.createElement('div'),
        // selectGenderDiv = document.createElement('div'),
        viewControls = document.createElement('ul'),
        tpl;

    view.clearMainView();

    // selectGenderDiv.innerHTML = '<div class="gender-select"><a id="gender-men" data="men">Men</a><a id="gender-woman">Women</a></div>';

    controlButtons.forEach(function (button) {
        var btn = document.createElement('li');
        btn.setAttribute('data', button.toLowerCase());
        btn.id = 'ctrl-' + button.toLowerCase();
        btn.innerHTML = button;
        viewControls.appendChild(btn);
    });

    viewControls.classList.add('control-buttons');

    viewControls.addEventListener('click', function (e) {
        game.onChangeViewGender(e);
    });

    tpl = (selectedGender == 'schedule') ? view.getRaceScheduleTpl() : view.getChampionshipTpl();
    
    champDiv.innerHTML = '<div>' + tpl + '</div>';

    mainDiv.appendChild(viewControls);
    mainDiv.appendChild(champDiv);

    return mainDiv;
}
