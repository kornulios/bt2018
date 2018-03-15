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
      let tpl = `<div>${p.name}</div><div>${p.speed}</div><div>${p.status}
        </div><div>(${p.misses})</div><div>${p.distance.toFixed(2)}m</div>`;
      tpl = `<div class="row">${tpl}</div>`;
      me.mainView.innerHTML += tpl;
    }
  }

  clearMainView() {
    this.mainView.innerHTML = "";
  }
}

function renderResults(results) {
  var mainView = document.querySelector("#results-view");;
  var players = results.playerNames();
  var mainTpl = "";
  var headerTpl = "<div class='head-row'>Name</div>";
  for (var i = 0; i < results.maxWaypointNum(); i++) {
    headerTpl += `<div>WP_${i}</div>`;
  }

  headerTpl = "<div class='row'>" + headerTpl + "</div>";

  players.forEach(function (name) {
    var rslt = results.getPlayerResults(name);
    var resTpl = "";

    rslt.forEach(function (r) {
      resTpl += "<div>" + r.time + "</div>";
    });
    mainTpl += `<div class='row'><div>${name}</div>${resTpl}</div>`;
  });
  mainView.innerHTML = headerTpl + mainTpl;
}

function getMainView() {
  return document.querySelector("#main-view");
}

function clearMainView() {
  var mainView = getMainView();
  mainView.innerHTML = "";
}

function setGameStatus(message) {
  var view = document.querySelector("#turn-box");
  view.innerHTML = message;
}