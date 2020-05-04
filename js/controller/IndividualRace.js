export class IndividualRace extends Race {
  
  run() {

    const players = [];
    const playerCount = 10;
    const track = new Track();
    const results = new Result();

    let raceFinished = false;
    let timer = 0;
    const frameRate = 1;

    const { PLAYER_STATUS } = Constants;

    for (var i = 1; i <= playerCount; i++) {
      players.push(new Player({
        name: "Player " + i,
        number: i,
        // speed: 19 + (i / 10),
        startTimer: (i - 1) * 30000
      }));
    }

    do {

      for (let i = 0; i < players.length; i++) {
        const player = players[i];

        if (player.status !== PLAYER_STATUS.FINISHED) {

          if (player.status === PLAYER_STATUS.NOT_STARTED && timer >= player.startTimer) {
            player.status = PLAYER_STATUS.RUNNING;
          };

          if (player.status === PLAYER_STATUS.RUNNING) {
            const playerPrevDistance = player.distance;
            player.run(1);

            const passedWaypoint = track.isWaypointPassed(player.distance, playerPrevDistance);
            const passedRange = track.isShootingEntrancePassed(player.distance, playerPrevDistance);

            if (passedWaypoint) {
              this.logPlayerResult(results, player, passedWaypoint, timer + player.penaltyTime - player.startTimer);
            }

            if (passedRange) {
              player.status = PLAYER_STATUS.SHOOTING;
              player.enterShootingRange(passedRange);
            }
          }
          else if (player.status === PLAYER_STATUS.SHOOTING) {
            player.shoot(frameRate);

            if (player.shotCount === 5) {
              this.logShootingResult(results, player, player.rangeNum, player.currentRange);
              const penaltyCount = player.currentRange.filter(r => r === 0).length;

              player.penaltyTime += penaltyCount * 60000;
              player.status = PLAYER_STATUS.RUNNING;
            }
          }

          if (player.distance >= track.getTrackLength()) player.status = PLAYER_STATUS.FINISHED;

        }

      }

      raceFinished = players.every(player => player.status === PLAYER_STATUS.FINISHED);

      timer += frameRate;

    } while (!raceFinished)

    console.log('race finished', timer);

    const view = new View();
    view.renderShortResults(results, track);
  }
}