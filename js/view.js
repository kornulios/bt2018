// renders one player
function renderPlayer(player) {
  var me = player.getPlayer();
  var tpl = "<div class='row'><div class='cell'>"+me.name+"</div><div class='cell'>"+me.distance+"</div></div>";
  var mainView = getMainView();

  mainView.innerHTML = mainView.innerHTML + tpl;
}

function renderGameTurn(turn) {
  var view = document.querySelector("#turn-box");
  view.innerHTML = 'Game turn: ' + turn;
}

function renderResults(results) {
  var mainView = getMainView();
  var players = results.playerNames();
  var mainTpl = "";
  var headerTpl = "<div class='head-row'>Name</div>";
  for (var i = 0; i<results.maxWaypointNum(); i++) {
    headerTpl += `<div>WP_${i}</div>`;
  }

  headerTpl = "<div class='row'>" + headerTpl + "</div>";

  players.forEach(function(name){
    var rslt = results.getPlayerResults(name);
    console.log(rslt);
    var resTpl = "";
    rslt.forEach(function(r){
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