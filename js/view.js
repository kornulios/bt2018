// renders one player
function renderPlayer(player) {
  var me = player.getPlayer();
  var tpl = "<div><div class='cell'>"+me.name+"</div><div class='cell'>"+me.distance+"</dev></div>";
  var mainView = getMainView();

  mainView.innerHTML = tpl;
}

function getMainView() {
  return document.querySelector("#main-view");
}