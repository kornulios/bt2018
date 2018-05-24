var testGame = function() {
  
  var game = new Game();

  test("Game test", function(){
    assert((game instanceof Game), "Test game is instance of Game");
    assert(game.players.length == 104, "Game players should be 104");
  });
}