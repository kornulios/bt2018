function raceScreen() {
    var mainDiv = document.createElement('div');
    var controlDiv = document.createElement('div');
    
    //create controls
    controlDiv.classList.add('gray-back');
    controlDiv.appendChild(document.createElement('button'));
    controlDiv.appendChild(document.createElement('button'));
    controlDiv.children[0].textContent = 'Start list';
    controlDiv.children[1].textContent = 'Run race';

    //render list

    //render main race div (what graphics will be used: canvas, svg, dom ???)
    mainDiv.appendChild(controlDiv);

    return mainDiv;
}