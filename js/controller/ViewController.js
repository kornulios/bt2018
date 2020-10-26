import { Utils } from "../utils/Utils";
import { teamData } from "../data";
import { RACE_STATUS, PLAYER_STATUS } from "../constants/constants";
import { flagImages } from "../services/flagService";

export const VIEW_PANELS = {
  PANEL_RACE: "race",
  PANEL_CHAMPIONSHIP: "championship",
  PANEL_FINISH_RESULTS: "finish-results",
  PANEL_TEAM: "team",
  PANEL_MAIN: "main",
  PANEL_CALENDAR: "calendar",
  PANEL_START_LIST: "start-list",
  PANEL_PLAYER_SELECTOR: "player-selection",
};

export class View {
  constructor() {
    this.trackView = document.querySelector("#track-info");
    this.flagImages = flagImages();

    this.screenMainPanel = document.querySelector("#main-panel");
    this.screenRacePanel = document.querySelector("#race-panel");

    this.viewPanels = {
      championship: {
        id: "#championship-standings",
        style: "flex",
      },
      "finish-results": {
        id: "#finish-results",
        style: "flex",
      },
      team: {
        id: "#team-view",
        style: "flex",
      },
      calendar: {
        id: "#race-schedule",
        style: "block",
      },
      "start-list": {
        id: "#start-list",
        style: "flex",
      },
      "player-selection": {
        id: "#player-selection",
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

  getPanel(panelName) {
    return document.querySelector(this.viewPanels[panelName].id);
  }

  // 2 MAIN PANEL ON SCREEN
  showMainPanel() {
    document.querySelector("#main-panel").style.display = "flex";
    document.querySelector("#race-panel").style.display = "none";
  }

  showRacePanel() {
    this.screenMainPanel.style.display = "none";
    this.screenRacePanel.style.display = "block";
  }

  // PLAYER TEAM HEADER
  renderPlayerTeam(team) {
    const panel = document.querySelector("#user-team");
    let img = new Image();
    img = this.flagImages[team.shortName];
    img.height = "70";
    img.width = "106";
    img.className = "head-flag-img";

    const name = document.createElement("span");
    name.innerText = "Team - " + team.name;
    panel.appendChild(img);

    panel.appendChild(name);
  }

  // MENU
  renderMenuNextEvent(eventName) {
    const el = document.querySelector("#next-event-info");
    el.innerHTML = `<div>Next event:</div><div>${eventName}</div>`;
  }

  // SCREENS
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

  renderShortResults(race) {
    this.hideAllPanels();

    const results = race.getFinishResult();
    const raceName = race.getRaceName();

    const htmlResults = results.map((result, i) => {
      const colors = teamData.find((team) => team.shortName === result.team).colors;

      return `
      <div>${i + 1}</div> 
      <div class="player-bub" style="background: ${colors[0]}; color: ${colors[1]}">${result.playerNumber}</div>
			<div>${result.playerName}</div>
			<div>${result.team}</div>
			<div>${result.shootingTotal}</div>
			<div class="player-result-time">${Utils.convertToMinutes(result.time / 1000)}</div>
			`;
    });

    const mainPanel = this.getPanel("finish-results");
    mainPanel.innerHTML = "";

    const headerEl = document.createElement("div");
    headerEl.innerText = raceName;
    headerEl.classList.add("race-results-header");

    const resultEl = document.createElement("div");
    resultEl.classList.add("finish-results-panel");
    resultEl.innerHTML = `
    ${htmlResults.join("")}
    `;

    mainPanel.appendChild(headerEl);
    mainPanel.appendChild(resultEl);

    this.showPanel(VIEW_PANELS.PANEL_FINISH_RESULTS);
  }

  renderStartList(startListPlayers, raceName) {
    this.hideAllPanels();
    const mainPanel = this.getPanel("start-list");
    mainPanel.innerHTML = "";

    const htmlResults = startListPlayers.map((player, i) => {
      const colors = teamData.find((team) => team.shortName === player.team).colors;

      return `
        <div><div class="player-bub" style="background: ${colors[0]}; color: ${colors[1]}">${player.number}</div></div>
        <div class="start-list-name">${player.name}</div>
        <div>${player.team}</div>
        <div>${Utils.convertToMinutes(player.startTimer / 1000)}</div>
			`;
    });

    const headerEl = document.createElement("div");
    headerEl.innerHTML = `<div>Start List</div><div class="start-list-racename">${raceName}</div>`;
    headerEl.classList.add("start-list-header");

    const listEl = document.createElement("div");
    listEl.classList.add("start-list");
    listEl.innerHTML = htmlResults.join("");

    const buttonsEl = document.createElement("div");
    buttonsEl.classList.add("start-race-buttons");
    buttonsEl.innerHTML = `
      <button type="button" name="start-race">Start</button>
      <button type="button" name="simulate-race">Simulate</button>
    `;

    mainPanel.appendChild(headerEl);
    mainPanel.appendChild(listEl);
    mainPanel.appendChild(buttonsEl);
    this.showPanel(VIEW_PANELS.PANEL_START_LIST);
  }

  renderPlayerSelector(players, team, onPlayerSelect, onClearSelection, onSelectionDone) {
    this.hideAllPanels();

    const gender = players[0].gender;
    const selectedPlayers = team.getNextRacePlayers();
    const quota = team.raceQuota[gender];
    const nextStartGroup = team.getNextStartGroup(gender);

    const panel = document.createElement("div");

    panel.innerHTML = `<div>Next Race Federation Quota: ${selectedPlayers.length}/${quota}</div>
    ${nextStartGroup ? `<div>Select next player for start group ${nextStartGroup}</div>` : ""}`;

    players.forEach((player) => {
      const startingGroup = selectedPlayers.find((p) => p.id === player.id)
        ? selectedPlayers.find((p) => p.id === player.id).startGroup
        : 0;

      const button = document.createElement("button");
      button.classList.add("team-grid-row");
      if (startingGroup) {
        button.classList.add(`team-player-selected-group-${startingGroup}`);
      }
      button.innerHTML = `<div>${player.name}</div>
      <div>${player.baseSpeed}</div>
      <div>${player.accuracy}</div>
      <div>${player.points}</div>
      `;

      button.onclick = () => onPlayerSelect(player.id);

      panel.appendChild(button);
    });

    const mainPanel = this.getPanel(VIEW_PANELS.PANEL_PLAYER_SELECTOR);
    mainPanel.innerHTML = "";
    mainPanel.appendChild(panel);

    const buttonPanel = document.createElement("div");
    const clearButton = document.createElement("button");
    const doneButton = document.createElement("button");
    buttonPanel.classList.add("player-selector-buttons");
    clearButton.innerText = "Clear";
    clearButton.onclick = () => onClearSelection();
    doneButton.innerText = "Done";
    doneButton.onclick = () => onSelectionDone();

    buttonPanel.appendChild(clearButton);
    buttonPanel.appendChild(doneButton);

    mainPanel.appendChild(buttonPanel);

    this.showPanel(VIEW_PANELS.PANEL_PLAYER_SELECTOR);
  }

  renderTeamPlayersList(players, raceQuota) {
    this.hideAllPanels();

    const headerHtml = `
    <div class="team-grid-row">
      <div class="row-name"></div>
      <div>PTS</div>
      <div>SPD</div>
      <div>ACC</div>
      <div>STR</div>
    </div>`;

    const panelMenHtml = players.map((player) => {
      return `
      <div class="team-grid-row">
        <div class="row-name">${player.name}</div>
        <div>${player.points}</div>
        <div>${player.baseSpeed}</div>
        <div>${player.accuracy}</div>
        <div>${player.strength}</div>
      </div>
      `;
    });

    const grid = `
    <div class="team-grid">
      <div class="team-grid-section-quota">Next Race Quota: 0/${raceQuota}</div>
      <div class="team-grid-section-header">Team Roster</div>
      ${headerHtml}
      ${panelMenHtml.join("")}
    </div>
    `;

    this.showPanel(VIEW_PANELS.PANEL_TEAM, grid);
  }

  renderRaceList(races) {
    this.hideAllPanels();

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

    container.innerHTML = `<div>${racesListHtml.join("")}</div>`;
    this.showPanel(VIEW_PANELS.PANEL_CALENDAR);
  }

  renderChampionshipStandings(standingsMen, standingsWomen) {
    this.hideAllPanels();
    // should render race list, men standings, women standings
    const container = document.querySelector("#standings-men");
    const container_wmn = document.querySelector("#standings-women");

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

    container.innerHTML = `<div class="results-standings">
      <div class="standings-header">Standings Men</div>
      ${standingsHTML.join("")}
      </div>`;

    container_wmn.innerHTML = `<div class="results-standings">
      <div class="standings-header">Standings Women</div>
      ${standingsWMN_HTML.join("")}
      </div>`;

    this.showPanel(VIEW_PANELS.PANEL_CHAMPIONSHIP);
  }

  // SHOOTING
  // renderShootingRange(players = [], target) {
  //   const shootingTargetsHTML = players.map((player) => {
  //     const rangeHtml = player.range.map((r) => {
  //       return r === 1 ? `<div class="target-closed"></div>` : `<div class="target-open"></div>`;
  //     });

  //     let rangeClass;

  //     const playerClass = player.delayed ? "shooting-player shooting-player-delayed" : "shooting-player";

  //     if (player.missNotification) {
  //       rangeClass = "range-missed";
  //       player.dismissMissNotification();
  //     }

  //     return `<div class="range">${rangeHtml.join("")} <div class="${playerClass}">${player.name} ${
  //       player.team
  //     }</div></div>`;
  //   });

  //   // const container = document.querySelector("#range-results");

  //   this.shootingRange.innerHTML = `<div class="shooting-container">${shootingTargetsHTML.join("")}</div>`;
  // }

  setupRaceView(race) {
    // this.hideAllPanels();
    this.showRacePanel();
    //waypoints
    const raceName = `${race.stageName} ${race.name}`;
    const waypoints = race.getWaypointsNames();
    const resultHtml = waypoints.map((waypoint, index) => {
      return `<button type="button" class="btn-waypoint" name="${index}">${waypoint}</button>`;
    });

    const pagingButtons = `<button type="button" class="btn-paging" name="prev">Prev</button>
    <button type="button" class="btn-paging" name="next">Next</button>`;

    // this.showPanel(VIEW_PANELS.PANEL_RACE);

    const container = document.querySelector("#results-controls");
    const nameContainer = document.querySelector("#race-name");
    const pagingContainer = document.querySelector("#results-paging");

    container.innerHTML = `<div class="results-controls">${resultHtml.join("")}</div>`;
    nameContainer.textContent = raceName;
    pagingContainer.innerHTML = pagingButtons;
  }

  // controls displayed result section
  updateResultsControls(resultsCount) {
    const pagingContainer = document.querySelector("#results-paging");

    const pagesNum = resultsCount / 20;

    let pagingButtons = [];

    pagingButtons.push(`<button type="button" class="btn-paging" name="prev">Prev</button>`);
    for (let i = 0; i < pagesNum; i++) {
      pagingButtons.push(`<button type="button" class="btn-paging" name=${i}>${i * 20 + 1}...${(i + 1) * 20}</button>`);
    }
    pagingButtons.push(`<button type="button" class="btn-paging" name="next">Next</button>`);

    pagingContainer.innerHTML = pagingButtons.join("");
  }
}
