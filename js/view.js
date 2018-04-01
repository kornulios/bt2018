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
      let shootTpl = (p.shooting) ? `[${p.shootResult[p.rangeNum].join('')}]` : `(${p.misses})`;
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
      tpl += `<div style="width:20px;">${place}</div>` + me.drawCell(r.playerName) + me.drawCell((r.rTime));
      tpl += '</div>';
      place++;
    }
    me.resultView.innerHTML = tpl;
  }

  renderTrackInfo(track) {
    let tpl = '';
    tpl = `Track length: ${track.trackLength} Laps: ${track.laps} Waypoints: ${track.waypoints}`;
    this.trackView.innerHTML = tpl;
  }

  clearMainView() {
    this.mainView.innerHTML = "";
  }

  drawCell(text) {
    return `<div>${text}</div>`;
  }

}
