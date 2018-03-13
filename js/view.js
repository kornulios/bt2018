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
  var headerTpl = "<div>Name</div>";

  mainView.innerHTML = mainView.innerHTML + headerTpl;
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