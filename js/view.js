// renders one player
function renderPlayer(player) {
  var tpl = "<div>Text</div>";
  var mainView = getMainView();

  mainView.innerHTML = tpl;
}

function getMainView() {
  return document.querySelector("#main-view");
}