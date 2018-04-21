// renders one player
class View {
  constructor() {
    this.trackView = document.querySelector('#track-info');
    this.mainView = document.querySelector('#main-view');
    this.resultView = document.querySelector('#results-view');
  }

  renderPlayers(race) {
    let me = this;
    this.clearMainView();

    for (let p of race.players) {
      let spColor = (p.state == CONSTANT.RUNSTATE.NORMAL) ? 'black' : (p.state == CONSTANT.RUNSTATE.EASE) ? 'red' : 'green';
      let shootTpl = (p.shooting) ? `[${race.results.getShootingResult(p.name, p.rangeNum)}]` : `(${race.results.getMisses(p.name)})`;
      let pStatus = p.status;

      let tpl = `<div>${p.name}</div>
        <div>${p.baseSpeed}</div>
        <div style="color: ${spColor}">${p.speed.toFixed(2)}</div>
        <div>${p.status}</div>
        <div>${shootTpl}</div>
        <div>${p.distance.toFixed(2)}m</div>`;
      tpl = `<div class="row">${tpl}</div>`;
      me.mainView.innerHTML += tpl;
    }
  }

  renderResults(results) { //should render sorted results per waypoint
    let me = this;
    let tpl = "";
    let place = 1;
    for (let r of results) {
      tpl += '<div class="row">';
      tpl += `<div style="width:20px;">${place}</div>` + me.drawCell(r.playerName) + me.drawCell((r.resultTime));
      tpl += '</div>';
      place++;
    }
    me.resultView.innerHTML = tpl;
  }

  renderTrackInfo(track) {
    let tpl = '';
    tpl = `Track length: ${track.trackLength} Laps: ${track.laps}<br>Waypoints: ${track.waypoints}<br>Shootings: ${track.shootingRange}`;
    this.trackView.innerHTML = tpl;
  }

  renderChampionshipView(championship) {
    //TODO screen with player stats and points
    let me = this;
    this.clearMainView();

    let tpl = '';
    tpl += '<div>Championship standings</div>';
    tpl += me.drawRow(['Name', 'Speed', 'Accuracy', 'Points']);
    for (let p of championship.players) {
      tpl += this.drawRow([p.name, p.baseSpeed, p.getAccuracy(), championship.points[p.name]]);
    }

    this.mainView.innerHTML = tpl;
  }

  renderRaceView(race) {
    //TODO render race with players and results
  }

  clearMainView() {
    this.mainView.innerHTML = "";
  }

  showRunScreen() {
    document.getElementById('run-btn').classList.remove('hidden');
    document.getElementById('start-btn').classList.add('hidden');
  }

  showFinishScreen() {
    document.getElementById('finish-btn').classList.remove('hidden');
    document.getElementById('run-btn').classList.add('hidden');
  }

  drawCell(text) {
    return `<div>${text}</div>`;
  }

  drawRow(args) {
    let tpl = '';
    tpl += '<div class="row">'
      for (let a of args) {
        tpl += this.drawCell(a);
      }
    tpl += '</div>'
    return tpl;
  }

  drawOnCanvas() {
    let myCanvas = document.querySelector('#main-canvas');
    let context = myCanvas.getContext("2d");

    var width = 125;  // Triangle Width
    var height = 105; // Triangle Height
    var padding = 20;

    context.beginPath();
    context.moveTo(padding + width / 2, padding);        // Top Corner
    context.lineTo(padding + width, height + padding); // Bottom Right
    context.lineTo(padding, height + padding);         // Bottom Left
    context.closePath();

    context.fillStyle = "#ffc821";
    context.fill();
  }

}
