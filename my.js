
axios.get('http://localhost:3000/data').then(
  function(res) {
    console.log(res);
    var p2 = new player();
    p2.setSpeed(50);
    p2.run();
  }
);