function runTests() {
  // isChampionshipCreated();
  // game.nextRace();
  // game.calculateRace();
  // if (game.race.results) {
  //   appendTestResult('PASS: Results created');
  // }
  // testResults();
  
  let champ = sanityCheck();
  isChampionshipCreated(champ);
  testTrack(champ);
  testResults(champ);
}

function sanityCheck() {
  let mockPlayers = [];
  var mockTrackData = [
    {
      location: 'Ruhpolding',
      stats: raceTypes.sprint
    }];

  for (let i = 0; i < 104; i++) {
    let p = { name: "Player " + i }
    mockPlayers.push(p);
  }
  let g = new Championship(mockPlayers, mockTrackData);
  return g;
}

function testTrack(champ){
  var race = champ.getNextRace();
  appendTestResult('Track length should be 10000: ' + (race.track.trackLength == 10000));
  // champ.addResults(race.results);
  // race = champ.getNextRace();
  // appendTestResult('Track length should be 7500: ' + (race.track.trackLength == 7500));
}

function testResults(champ) {
  let t = 'PASSED';

  let race = champ.getNextRace();
  let gameRunning = true;
  do
    gameRunning = race.run();
  while (gameRunning)

  champ.addResults(race.results);
  // debugger
  let myRes = race.results;
  for (let i = 0; i < myRes.waypointsNum; i++) {
    if (myRes.getWpRes(i).length !== game.championship.players.length) {
      t = 'FAILED';
    }
  }
  appendTestResult('Results per waypoint count: ' + t);
}

function isChampionshipCreated(champ) {
  if (champ === Object(champ)) {
    appendTestResult("PASS: Championship created");
    if (champ.players.length == 104) {
      appendTestResult("PASS: players count is 104");
    }
  } else {
    appendTestResult("FAIL: Championship not created");
  }
}

function appendTestResult(text) {
  let testdiv = document.querySelector('#test-window');
  let resdiv = document.createElement('div');
  resdiv.innerHTML = text;
  testdiv.appendChild(resdiv);
}

class AppTest {
  constructor(args) {
    this.mockPlayers = this.createMockPlayers(104);
  }

  createMockPlayers(num) {
    let mockPlayers = [];
    for (let i = 0; i < num; i++) {
      let p = { name: "Player " + i }
      mockPlayers.push(p);
    }
    return mockPlayers;
  }

  run() {

  }

}