import { Utils } from "../utils/Utils.js";
import { teamData } from "../data.js";

export class View {
  constructor() {
    this.trackView = document.querySelector("#track-info");
    this.mainView = document.querySelector("#main-view");
    this.resultView = document.querySelector("#results-view");
  }

  drawMapBeta() {}

  renderProgress(race) {
    const players = race.players;
    const raceFinished = race.raceFinished;
    const timer = Utils.convertToMinutes(race.raceTimer / 1000);

    const htmlProgress = players
      .map((player) => {
        return `<div>${player.name} ${player.status} ${player.distance.toFixed(1)}</div>`;
      })
      .join("");

    const htmlRace = `<div>Race finished: ${raceFinished}</div>
		<div>Race timer: ${timer}</div>
		<div>${htmlProgress}</div>`;

    document.querySelector("#run").innerHTML = `<div>${htmlRace}</div>`;
  }

  renderShortRelayResults(results, track) {
    const teamResults = results.data.filter((res) => res.waypoint === track.getFinishWaypoint() && res.leg === 4);

    const htmlResults = teamResults.map((result, i) => {
      const timeStr =
        i > 0
          ? "+" + Utils.convertToMinutes((result.time - teamResults[0].time) / 1000)
          : Utils.convertToMinutes(result.time / 1000);

      const item = `<div>
			<span>${i + 1}</span>
			<span>${result.team}</span>
			<span>${timeStr}</span>
			</div>`;

      return item;
    });

    document.querySelector("#run").innerHTML = `<div>${htmlResults.join("")}</div>`;
  }

  renderRelayResults(results, track) {
    const teamTotalResults = results.data
      .filter((res) => res.waypoint === track.getFinishWaypoint() && res.leg === 4)
      .reduce((acc, result) => {
        const teamName = result.team;
        if (!acc[teamName]) acc[teamName] = [];

        return { ...acc, [teamName]: result.time };
      }, {});

    const teamTotalShooting = results.shootingData.reduce((acc, result) => {
      const teamName = result.team;
      if (!acc[teamName]) acc[teamName] = { misses: 0, ammo: 0 };

      return {
        ...acc,
        [teamName]: {
          misses: acc[teamName].misses + result.result,
          ammo: acc[teamName].ammo + result.ammo,
        },
      };
    }, {});

    const teamPlayerResults = results.data
      .filter((res) => res.waypoint === track.getFinishWaypoint())
      .reduce((acc, result) => {
        const teamName = result.team;
        if (!acc[teamName]) acc[teamName] = [];

        return {
          ...acc,
          [teamName]: [
            ...acc[teamName],
            {
              playerName: result.playerName,
              time: result.time,
              leg: result.leg,
            },
          ],
        };
      }, {});

    const htmlResults = Object.keys(teamTotalResults).map((teamName) => {
      const playerItems = teamPlayerResults[teamName].map((player) => {
        return `<div><span>${player.playerName}</span> <span>${Utils.convertToMinutes(
          player.time / 1000
        )}</span></div>`;
      });

      const item = `<div>
				<span>${teamName}</span>
				<span>${teamTotalShooting[teamName].misses}+${teamTotalShooting[teamName].ammo}</span>
				<span>${Utils.convertToMinutes(teamTotalResults[teamName] / 1000)}</span>
				<div class="relay-player-items">${playerItems.join("")}</div>
			</div>`;

      return item;
    });

    document.querySelector("#run").innerHTML = `<div>${htmlResults.join("")}</div>`;
  }

  renderShortResults(results) {
    const htmlResults = results.map((result, i) => {
      const shootingResult = result.shooting.reduce((acc, val) => acc + val, 0);
      const colors = teamData.find((team) => team.shortName === result.team).colors;

      return `<div class="result-row">
      <div class="player-cell-small">${i + 1}</div> 
      <div class="player-bub" style="background: ${colors[0]}; color: ${colors[1]}">${
        result.playerNumber
      }</div>
			<div class="player-name">${result.playerName}</div>
			<div>${result.team}</div>
			<div>${shootingResult}</div>
			<div>${Utils.convertToMinutes(result.time / 1000)}</div>
			</div>`;
    });

    document.querySelector("#finish-results").innerHTML = `<div>${htmlResults.join("")}</div>`;
  }

  renderResults(results, track) {
    //results fetch
    const playerResults = results.data.reduce((acc, result) => {
      const name = result.playerName;
      if (!acc[name]) {
        acc[name] = [];
      }

      return {
        ...acc,
        [name]: [
          ...acc[name],
          {
            wpName: track.getWaypointName(result.waypoint),
            time: Utils.convertToMinutes(result.time / 1000),
          },
        ],
      };
    }, {});

    const rangeResults = results.shootingData.reduce((acc, result) => {
      const name = result.playerName;
      if (!acc[name]) {
        acc[name] = [];
      }

      return {
        ...acc,
        [name]: [...acc[name], { range: result.range, result: result.result }],
      };
    }, {});

    //html
    const htmlResults = Object.keys(playerResults)
      .map((name) => {
        const resultItems = playerResults[name].map((r) => {
          const item = `<span class="waypoint">${r.wpName}</span><span class="time">${r.time}</span>`;

          return `<li class="result-list-item">${item}</li>`;
        });
        const rangeItems = rangeResults[name].map((r) => {
          const item = `<div>Range ${r.range}: ${r.result}</div>`;

          return `<div>${item}</div>`;
        });

        const list = `<div class="result-block">${name}<ul class="result-list">${resultItems.join(
          ""
        )}</ul>${rangeItems.join("")}</div>`;

        return list;
      })
      .join("");

    document.querySelector("#finish-results").innerHTML = `<div class="results">${htmlResults}</div>`;
  }

  renderTeamList(teams) {
    const htmlResults = teams
      .map((team) => {
        const maleList = team
          .getMalePlayers()
          .map((player) => {
            return `<li>${player.name} S:${player.baseSpeed} A:${player.accuracy}</li>`;
          })
          .join("");

        const femaleList = team
          .getFemalePlayers()
          .map((player) => {
            return `<li>${player.name} S:${player.baseSpeed} A:${player.accuracy}</li>`;
          })
          .join("");

        return `<div>${team.name}</div>
			<div class="player-list">
				<ul>${maleList}</ul>
				<ul>${femaleList}</ul>
			</div>`;
      })
      .join("");

    document.querySelector("#run").innerHTML = `<div>${htmlResults}</div>`;
  }

  renderPlayerList(players) {
    const playerListHtml = players.map((player) => {
      return `<li>${player.name} ${player.team} ${player.gender === "male" ? "M" : "F"} S:${player.baseSpeed} A:${
        player.accuracy
      }</li>`;
    });

    const list = `<ul>${playerListHtml.join("")}</ul>`;

    document.querySelector("#run").innerHTML = `<div>${list}</div>`;
  }

  renderRaceList(races) {
    const container = document.querySelector("#game-div");

    const stages = races.reduce((acc, result) => {
      const stage = result.stageName;

      if (!acc[stage]) acc[stage] = [];

      return { ...acc, [stage]: [...acc[stage], result.name] };
    }, {});

    const racesListHtml = Object.keys(stages).map((stage) => {
      const races = stages[stage].map((race) => {
        return `<li>${race}</li>`;
      });

      return `<p>${stage}</p><ul>${races.join("")}</ul>`;
    });

    container.innerHTML = `<div>${racesListHtml.join("")}</div>`;
  }
}
