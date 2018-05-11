function runTests() {
  isChampionshipCreated();
  game.nextRace();
  game.calculateRace();
  if (game.race.results) {
    appendTestResult('PASS: Results created');
  }
  testResults();
}

function testResults() {
  let t = 'PASSED';
  let myRes = game.race.results;
  for (let i=0; i<myRes.waypointsNum; i++){
    if (myRes.getWpRes(i).length !== game.championship.players.length) {
      t = 'FAILED';
    }
  }
  appendTestResult('Results per waypoint count: ' + t);
}

function isChampionshipCreated() {
  if (game.championship === Object(game.championship)) {
    appendTestResult("PASS: Championship created");
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