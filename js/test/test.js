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
}

function sanityCheck() {
  let mockPlayers = [];
        for (let i=0; i<104; i++){
          let p = { name: "Player " + i}
          mockPlayers.push(p);
        }
  let g = new Championship(mockPlayers, trackData);
  return g;
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