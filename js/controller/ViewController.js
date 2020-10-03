import { Utils } from "../utils/Utils.js";
import { teamData } from "../data.js";
import { RACE_STATUS, PLAYER_STATUS } from "../constants/constants.js";

import { PlayerControls } from "../view/PlayerControls/PlayerControls.js";

export const VIEW_PANELS = {
  PANEL_RACE: "race",
  PANEL_CHAMPIONSHIP: "championship",
  PANEL_FINISH_RESULTS: "finish-results",
};

export class View {
  constructor() {
    this.trackView = document.querySelector("#track-info");
    this.mainView = document.querySelector("#main-view");
    this.resultView = document.querySelector("#results-view");

    this.viewPanels2 = ["#championship-standings", "#finish-results", "#race-main"];

    this.viewPanels = {
      championship: {
        id: "#championship-standings",
        style: "flex",
      },
      "finish-results": {
        id: "#finish-results",
        style: "flex",
      },
      race: {
        id: "#race-main",
        style: "flex",
      },
    };
  }

  hideAllPanels() {
    Object.keys(this.viewPanels).forEach((panel) => {
      const elem = document.querySelector(this.viewPanels[panel].id);
      elem.style.display = "none";
    });
  }

  showPanel(panelName, data) {
    const elem = document.querySelector(this.viewPanels[panelName].id);
    elem.style.display = this.viewPanels[panelName].style;
    if (data) {
      elem.innerHTML = data;
    }
  }

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
    this.hideAllPanels();

    const htmlResults = results.map((result, i) => {
      const shootingResult = result.shooting.reduce((acc, val) => acc + val, 0);
      const colors = teamData.find((team) => team.shortName === result.team).colors;

      return `<div class="result-row">
      <div class="player-cell-small">${i + 1}</div> 
      <div class="player-bub" style="background: ${colors[0]}; color: ${colors[1]}">${result.playerNumber}</div>
			<div class="player-name">${result.playerName}</div>
			<div>${result.team}</div>
			<div>${shootingResult}</div>
			<div>${Utils.convertToMinutes(result.time / 1000)}</div>
			</div>`;
    });

    const resultData = `<div>${htmlResults.join("")}</div>`;

    this.showPanel(VIEW_PANELS.PANEL_FINISH_RESULTS, resultData);
  }

  renderResults(results) {
    const htmlResults = results.map((result, i) => {
      const colors = teamData.find((team) => team.shortName === result.team).colors;

      return `<div class="intermediate-row">
        <div class="player-cell-small">${i + 1}</div> 
        <div class="player-bub" style="background: ${colors[0]}; color: ${colors[1]}">${result.playerNumber}</div>
        <div class="player-name">${result.playerName}</div>
        <div>${result.team}</div>
        <div>${Utils.convertToMinutes(result.time / 1000)}</div>
			</div>`;
    });

    document.querySelector("#intermediate-results").innerHTML = `<div class="intermediate-results">${htmlResults.join(
      ""
    )}</div>`;
  }

  // renderResults(results, track) {
  //   const pls = game.players;
  //   //results fetch
  //   const playerResults = results.data.reduce((acc, result) => {
  //     const name = result.playerName;
  //     if (!acc[name]) {
  //       acc[name] = [];
  //     }

  //     return {
  //       ...acc,
  //       [name]: [
  //         ...acc[name],
  //         {
  //           wpName: track.getWaypointName(result.waypoint),
  //           time: Utils.convertToMinutes(result.time / 1000),
  //         },
  //       ],
  //     };
  //   }, {});

  //   const rangeResults = results.shootingData.reduce((acc, result) => {
  //     const name = result.playerName;
  //     if (!acc[name]) {
  //       acc[name] = [];
  //     }

  //     return {
  //       ...acc,
  //       [name]: [...acc[name], { range: result.range, result: result.result }],
  //     };
  //   }, {});

  //   //html
  //   const htmlResults = Object.keys(playerResults)
  //     .map((name) => {
  //       const resultItems = playerResults[name].map((r) => {
  //         const item = `<span class="waypoint">${r.wpName}</span><span class="time">${r.time}</span>`;

  //         return `<li class="result-list-item">${item}</li>`;
  //       });
  //       const rangeItems = rangeResults[name].map((r) => {
  //         const item = `<div>Range ${r.range}: ${r.result}</div>`;

  //         return `<div>${item}</div>`;
  //       });

  //       const list = `<div class="result-block">${name}<ul class="result-list">${resultItems.join(
  //         ""
  //       )}</ul>${rangeItems.join("")}</div>`;

  //       return list;
  //     })
  //     .join("");

  //   document.querySelector("#finish-results").innerHTML = `<div class="results">${htmlResults}</div>`;
  // }

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
    const container = document.querySelector("#race-schedule");

    const stages = races.reduce((acc, result) => {
      const stage = result.stageName;

      if (!acc[stage]) acc[stage] = [];

      return { ...acc, [stage]: [...acc[stage], result] };
    }, {});

    const racesListHtml = Object.keys(stages).map((stage) => {
      const races = stages[stage].map((race) => {
        let liClass;
        switch (race.status) {
          case RACE_STATUS.RACE_NEXT:
            liClass = "list-race-next";
            break;
          case RACE_STATUS.FINISHED:
            liClass = "list-race-finished";
            break;
          default:
            liClass = "list-race-normal";
        }

        return `<li class=${liClass}>${race.name}</li>`;
      });

      return `<div class="race-list-header">${stage}</div>
      <ul class="race-list-ul">${races.join("")}</ul>`;
    });

    container.innerHTML = `<div class="race-block">${racesListHtml.join("")}</div>`;
  }

  renderChampionshipStandings(races, standingsMen, standingsWomen) {
    this.hideAllPanels();
    // should render race list, men standings, women standings
    const container = document.querySelector("#standings-men");
    const container_wmn = document.querySelector("#standings-women");

    this.renderRaceList(races);

    const standingsHTML = standingsMen.map((result) => {
      return `
      <div class="standings-row">
      <div class="player-name">${result.name}</div>
      <div class="player-cell-medium">${result.team}</div>
      <div class="player-cell-small">${result.points}</div>
      </div>`;
    });

    const standingsWMN_HTML = standingsWomen.map((result) => {
      return `
      <div class="standings-row">
      <div class="player-name">${result.name}</div>
      <div class="player-cell-medium">${result.team}</div>
      <div class="player-cell-small">${result.points}</div>
      </div>`;
    });

    container.innerHTML = `<div>
      <div class="standings-header">Standings Men</div>
      ${standingsHTML.join("")}
      </div>`;

    container_wmn.innerHTML = `<div>
      <div class="standings-header">Standings Women</div>
      ${standingsWMN_HTML.join("")}
      </div>`;

    this.showPanel(VIEW_PANELS.PANEL_CHAMPIONSHIP);
  }

  // SHOOTING
  renderShootingRange(players = [], target) {
    const shootingTargetsHTML = players.map((player) => {
      const range = player.getShootingRange();
      const shotCount = player.getShootCount();

      const rangeHtml = range.map((r) => {
        return r === 1 ? `<div class="target-closed"></div>` : `<div class="target-open"></div>`;
      });

      let rangeClass;
      const playerClass =
        player.status === PLAYER_STATUS.SHOOTING ? "shooting-player" : "shooting-player shooting-player-delayed";

      if (player.missNotification) {
        rangeClass = "range-missed";
        player.dismissMissNotification();
      }

      return `<div class="range">${rangeHtml.join("")} <div class="${playerClass}">${player.name} ${
        player.team
      }</div></div>`;
    });

    const container = document.querySelector("#range-results");

    container.innerHTML = `<div class="shooting-container">${shootingTargetsHTML.join("")}</div>`;
  }

  setupRaceView(waypoints) {
    this.hideAllPanels();
    //waypoints
    const resultHtml = waypoints.map((waypoint, index) => {
      return `<button type="button" class="btn-waypoint" name="${index}">${waypoint}</button>`;
    });

    this.showPanel(VIEW_PANELS.PANEL_RACE);

    const container = document.querySelector("#results-controls");
    container.innerHTML = `<div class="results-controls">${resultHtml.join("")}</div>`;
  }

  renderPlayerControls(players) {
    const playersHtml = players.map((player) => {
      return PlayerControls(player);
    });

    const container = document.querySelector("#player-controls");
    container.innerHTML = playersHtml.join("");
  }
}
