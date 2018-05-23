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

  var game = new Game();
  var player = [];
  player.push({name: 'Player', accuracy: 90, speed: 20});
  var champ = game.createChampionship(player, trackData);
  var testTrack = new Track(trackData[0], 'women');
  

  test("Sanity check", function () {
    assert((game instanceof Game), "Test game is instance of Game");
    assert((champ instanceof Championship), "Champ is instance of Championship");
    assert(champ.players.length == 1, "Player count should be 1");
    // assert(champ.players[0].name == 'Player', "Player name should be Player");
  });

  test("Player test", function() {
    var testPlayer = champ.players[0];
    
    assert(testPlayer.name == 'Player', "Player 0 name should be Player");
    assert(testPlayer.getAccuracy() == 90, "Player ACC is 90");
    assert(testPlayer.baseSpeed == 20, "Player base speed is 20");
    assert(testPlayer.run(testTrack), "Player runs");
  });
}

//   this.run = function() {  
//     let testGame = this.createTestGame();
//     // appendTestResult('Test game is instance of Game: ' + (testGame instanceof Game));


//     let champ = createTestChamp();
//     isChampionshipCreated(champ);
//     testTrack(champ);
//     testResults(champ);
//   }

//   this.render = function() {

//   }


//   function createTestChamp() {
//     let mockPlayers = [];
//     var mockTrackData = [
//       {
//         location: 'Ruhpolding',
//         stats: raceTypes.sprint
//       }];

//     for (let i = 0; i < 104; i++) {
//       let p = { name: "Player " + i }
//       mockPlayers.push(p);
//     }
//     let g = new Championship(mockPlayers, mockTrackData);
//     return g;
//   }

//   function testTrack(champ){
//     var race = champ.getNextRace();
//     appendTestResult('Track length should be 10000: ' + (race.track.trackLength == 10000));
//     // champ.addResults(race.results);
//     // race = champ.getNextRace();
//     // appendTestResult('Track length should be 7500: ' + (race.track.trackLength == 7500));
//   }

//   function testResults(champ) {
//     let t = true;

//     let race = champ.getNextRace();
//     let gameRunning = true;
//     do
//       gameRunning = race.run();
//     while (gameRunning)

//     champ.addResults(race.results);
//     // debugger
//     let myRes = race.results;
//     for (let i = 0; i < myRes.waypointsNum; i++) {
//       if (myRes.getWpRes(i).length !== game.championship.players.length) {
//         t = false;
//       }
//     }
//     appendTestResult('Results number is 104 per each waypoint: ' + t);
//   }

//   function appendTestResult(text) {
//     let testdiv = document.querySelector('#test-window');
//     let resdiv = document.createElement('div');
//     resdiv.innerHTML = text;
//     testdiv.appendChild(resdiv);
//   }


// }