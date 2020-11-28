import { Player } from "../model/player";
import { PlayerControls } from "../view/PlayerControls/PlayerControls";

export class TestModule {
  constructor(config) {
    this.players = config.players;
    document.querySelector("body").innerHTML = '<div id="test-container"></div>';

    this.container = document.querySelector("#test-container");
  }

  renderPlayerControl() {
    this.container.innerHTML =
      '<canvas id="test-canvas" width="600px" height="600px" style="border: 1px solid black"></canvas>';
    const ctx = document.querySelector("#test-canvas").getContext("2d");

    const mockPlayerData = [
      {
        id: 1,
        number: 1,
        team: "ITA",
        name: "Mockaccho",
        time: "0,00.0",
        place: 1,
        currentSpeed: 20,
        strength: 90,
        accuracy: 70,
        shootingTotal: 0,
        lastWaypoint: "1.2km",
      },
      {
        id: 122,
        number: 2,
        team: "ITA",
        name: "Focaccho",
        time: "+0,32.7",
        place: 2,
        currentSpeed: 20,
        strength: 80,
        accuracy: 60,
        shootingTotal: 2,
        lastWaypoint: "1.9km",
      },
    ];

    const playerControl = new PlayerControls(mockPlayerData);

    document.querySelector("#test-canvas").addEventListener("click", (event) => {
      console.log(playerControl.onControlClick(event.offsetX, event.offsetY));
    });

    playerControl.draw(ctx, mockPlayerData);
  }

  testPlayerRun() {
    document.querySelector("body").innerHTML = "<div>Player model test suite</div>";
    const player = new Player(this.players[9]);
    let frameCount = 0;
    let tickCounter = 0;

    const fps = 16.66 * 50;

    do {
      frameCount++;
      player.run(fps);
      player.recalculateStatus(829.749);

      if (frameCount % 1000 === 0) {
        // console.log("Dist", player.distance);
        // console.log("FAT", player.fatigue);
      }
    } while (frameCount * fps < 15000 * 100);

    console.log(frameCount);
    console.log(player.distance);
    console.log(player.fatigue);
    console.log("MS", frameCount * fps);
    console.log(player);
  }
}
