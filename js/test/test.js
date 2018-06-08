(function () {

  // this.game = new Game();
  var testResults;

  this.assert = function (value, desc) {
    var li = document.createElement('li');
    li.className = value ? 'pass' : 'fail';
    li.appendChild(document.createTextNode(desc));
    testResults.appendChild(li);
    return li;
  };

  this.test = function test(name, fn) {
    var ul = document.createElement('ul');
    ul.className = "test-box";
    testResults = document.getElementById('test-results');
    testResults = assert(true, name).appendChild(ul);
    fn();
  };
})();

window.onload = function () {
  test("Test Suite test", function () {
    assert(true, 'Non-failing test');
    assert(false, 'Failing test');
  });

  var config = {
    baseSpeed: 13
  }

  var game = new Game();
  var player = [];
  player.push({name: 'Player', accuracy: 90, speed: config.baseSpeed});
  var champ = new Championship(player, trackData);
  var testTrack = new Track(trackData[0], 'women');
  
  testGame();

  test("Sanity check", function () {
    assert((champ instanceof Championship), "Champ is instance of Championship");
    assert(champ.players.length == 1, "Champ player count should be 1");
    assert(champ.races.length == 8, "Champ races count should be 8");
  });

  test("Player test", function() {
    var testPlayer = champ.players[0];
    
    assert(testPlayer.name == 'Player', "Player 0 name should be Player");
    assert(testPlayer.nationality == "GER", "Player 0 nationality should be Germany");
    // assert(testPlayer.number == 1, "Player 0 number should be 1"); should go to race numbers!
    assert(testPlayer.getAccuracy() == 90, "Player ACC is 90");
    assert(testPlayer.baseSpeed == config.baseSpeed, "Player base speed is " + config.baseSpeed);
    assert(testPlayer.run(testTrack), "Player runs");
    assert(testPlayer.getDistance() > 0, "Player passed more than 0m: " + testPlayer.getDistance());
    assert(testPlayer.reset().getDistance() == 0, "Reset player distance is 0");
  });

  test("Penalty test", function() {
    var testPlayer = champ.players[0];
    testPlayer.reset();
    assert(testPlayer.addPenalty(50), "50m should be added as penalty distance");
    assert(testPlayer.getDistance() == 0, "Initial distance should be 0");
    testPlayer.run(testTrack);
    assert(testPlayer.penalty < 50, "Penalty after run is lower than 50");
    assert(testPlayer.getDistance() == 0, "After run distance should be 0");
  })

  test("Shooting test", function() {
    var testPlayer = champ.players[0];
    var shootResult;
    testPlayer.reset();
    assert(testPlayer.enterShootingRange(0), "Player enters shooting range");
    assert(testPlayer.rifle.ammo == 5, "Ammo at shooting range is 5");
    assert(testPlayer.rifle.aimTime > 0, "Aiming time is greater than 0");
    do {
      shootResult = testPlayer.shoot();
    } while (!shootResult);
    assert(shootResult, "Player shoots");
    assert(testPlayer.rifle.ammo == 4, "Ammo after shot is 4");

  });
}
