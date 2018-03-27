// renders one player
class View {
  constructor() {
    this.mainView = document.querySelector('#main-view');
    this.resultView = document.querySelector('#results-view');
  }

  renderPlayers(players) {
    let me = this;
    this.clearMainView();
    for (let p of players) {
      let spColor = (p.state == 0) ? 'black' : (p.state == 1) ? 'red' : 'green'; 
      let tpl = `<div>${p.name}</div>
        <div>${p.baseSpeed}</div>
        <div style="color: ${spColor}">${p.speed.toFixed(2)}</div>
        <div>${p.status}</div>
        <div>(${p.misses})</div>
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

  clearMainView() {
    this.mainView.innerHTML = "";
  }

  drawCell(text) {
    return `<div>${text}</div>`;
  }

}
