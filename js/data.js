import { Player } from "./model/player.js";
import * as Constants from "./constants/constants.js";
import * as Waypoints from "./constants/waypoints.js";

function getData() {
  return axios.get("http://localhost:3000/data");
}

var debugProfiler = {};

var CONSTANT = {
  PENALTY_TYPE: { LAP: 1, MINUTE: 0 },
  RACE_START_TYPE: {
    ALL: 1,
    SEPARATE: 2,
    PURSUIT: 3,
    RELAY: 4,
  },

  //AI behaviour constants
  AI: {
    AGGRESSIVE: [50, 25, 25],
    WEAK: [25, 25, 50],
    NORMAL: [33, 34, 33],
  },

  RUNSTATE: { NORMAL: 0, EASE: 1, PUSHING: 2 },

  START_TIME_INTERVAL: 30, // in seconds
  PURSUIT_PLAYERS_NUM: 60,
  PENALTY_LAP_LENGTH: 150,
  PENALTY_MINUTE: 100,

  BASE_SPEED_MOD: 0.05,
};

Object.freeze(CONSTANT);

export const raceTypes = {
  sprint_men: {
    type: "Sprint",
    name: "Men 10km Sprint",
    gender: Constants.GENDER.MEN,
    waypoints: Waypoints.WAYPOINTS_10KM_LONG,
    ranges: Waypoints.RANGES_10KM_LONG,
    lapLength: 10000 / 3,
  },
  sprint_women: {
    type: "Sprint",
    name: "Women 7.5km Sprint",
    gender: Constants.GENDER.WOMEN,
    waypoints: Waypoints.WAYPOINTS_7_5KM,
    ranges: Waypoints.RANGES_7_5KM,
    lapLength: 2500,
  },
  individual_men: {
    type: "Individual",
    name: "Men 20km Individual",
    gender: Constants.GENDER.MEN,
    waypoints: Waypoints.WAYPOINTS_20KM,
    ranges: Waypoints.RANGES_20KM,
    lapLength: 4000,
  },
  individual_women: {
    type: "Individual",
    name: "Women 15km Individual",
    gender: Constants.GENDER.WOMEN,
    waypoints: Waypoints.WAYPOINTS_15KM,
    ranges: Waypoints.RANGES_15KM,
    lapLength: 3000,
  },
  pursuit_men: {
    type: "Pursuit",
    name: "Men 12.5km Pursuit",
    gender: Constants.GENDER.MEN,
    waypoints: Waypoints.WAYPOINTS_12_5KM,
    ranges: Waypoints.RANGES_12_5KM,
    lapLength: 2500,
  },
  pursuit_women: {
    type: "Pursuit",
    name: "Women 10km Pursuit",
    gender: Constants.GENDER.WOMEN,
    waypoints: Waypoints.WAYPOINTS_10KM_SHORT,
    ranges: Waypoints.RANGES_10KM_SHORT,
    lapLength: 2000,
  },
  massStart_men: {
    type: "Mass-start",
    name: "Men 15km Mass-start",
    gender: Constants.GENDER.MEN,
    waypoints: Waypoints.WAYPOINTS_15KM,
    ranges: Waypoints.RANGES_15KM,
    lapLength: 3000,
  },
  massStart_women: {
    type: "Mass-start",
    name: "Women 12.5km Mass-start",
    gender: Constants.GENDER.WOMEN,
    waypoints: Waypoints.WAYPOINTS_12_5KM,
    ranges: Waypoints.RANGES_12_5KM,
    lapLength: 2500,
  },
  relay_men: {
    type: "Relay",
    name: "Men 4x7.5km Relay",
    gender: Constants.GENDER.MEN,
    waypoints: Waypoints.WAYPOINTS_7_5KM,
    ranges: Waypoints.RANGES_7_5KM,
    lapLength: 2500,
  },
  relay_women: {
    type: "Relay",
    name: "Women 4x6km Relay",
    gender: Constants.GENDER.WOMEN,
    waypoints: Waypoints.WAYPOINTS_6KM,
    ranges: Waypoints.RANGES_6KM,
    lapLength: 2000,
  },
};

//Season consists of 9 stages and 1 World Cup event

export const teamData = [
  {
    name: "Germany",
    shortName: "GER",
    flag: "",
    colors: ["#000000", "#FFD000"],
    raceQuota: { men: 6, women: 6 },
    stageQuota: { men: 8, women: 8 },
  },
  {
    name: "Italy",
    shortName: "ITA",
    flag: "",
    colors: ["#0f8a00", "#ffffff"],
    raceQuota: { men: 5, women: 5 },
    stageQuota: { men: 7, women: 7 },
  },
  {
    name: "Ukraine",
    shortName: "UKR",
    flag: "",
    colors: ["#ffcc00", "#030bff"],
    raceQuota: { men: 5, women: 5 },
    stageQuota: { men: 7, women: 7 },
  },
  {
    name: "Belarus",
    shortName: "BLR",
    flag: "",
    colors: ["#FFFFFF", "#008000"],
    raceQuota: { men: 5, women: 4 },
    stageQuota: { men: 7, women: 6 },
  },
  {
    name: "Norway",
    shortName: "NOR",
    flag: "",
    colors: ["#960c00", "#FFFFFF"],
    raceQuota: { men: 6, women: 6 },
    stageQuota: { men: 8, women: 8 },
  },
  {
    name: "Austria",
    shortName: "AUT",
    flag: "",
    colors: ["#ff230f", "#ffffff"],
    raceQuota: { men: 6, women: 5 },
    stageQuota: { men: 8, women: 7 },
  },
  {
    name: "France",
    shortName: "FRA",
    flag: "",
    colors: ["#0021db", "#FFFFFF"],
    raceQuota: { men: 6, women: 6 },
    stageQuota: { men: 8, women: 8 },
  },
  {
    name: "Finland",
    shortName: "FIN",
    flag: "",
    colors: ["#FFFFFF", "#1486ff"],
    raceQuota: { men: 3, women: 5 },
    stageQuota: { men: 4, women: 6 },
  },
  {
    name: "Romania",
    shortName: "ROM",
    flag: "",
    colors: ["#FCD116", "#CE1126"],
    raceQuota: { men: 2, women: 2 },
    stageQuota: { men: 4, women: 4 },
  },
  {
    name: "Sweden",
    shortName: "SWE",
    flag: "",
    colors: ["#006aa8", "#fecb00"],
    raceQuota: { men: 5, women: 6 },
    stageQuota: { men: 7, women: 8 },
  },
  {
    name: "Bulgaria",
    shortName: "BUL",
    flag: "",
    colors: ["#ace12f", "#000000"],
    raceQuota: { men: 4, women: 3 },
    stageQuota: { men: 6, women: 5 },
  },
  {
    name: "Canada",
    shortName: "CAN",
    flag: "",
    colors: ["#ffb3fc", "#ffffff"],
    raceQuota: { men: 4, women: 4 },
    stageQuota: { men: 6, women: 6 },
  },
  {
    name: "Switzerland",
    shortName: "SUI",
    flag: "",
    colors: ["#919191", "#ffffff"],
    raceQuota: { men: 4, women: 5 },
    stageQuota: { men: 6, women: 7 },
  },
  {
    name: "Poland",
    shortName: "POL",
    flag: "",
    colors: ["#ffffff", "#FF0000"],
    raceQuota: { men: 4, women: 5 },
    stageQuota: { men: 6, women: 7 },
  },
  {
    name: "Russia",
    shortName: "RUS",
    flag: "",
    colors: ["#3399ff", "#FFFFFF"],
    raceQuota: { men: 6, women: 6 },
    stageQuota: { men: 8, women: 8 },
  },
  {
    name: "USA",
    shortName: "USA",
    flag: "",
    colors: ["#6699ff", "#ff1a1a"],
    raceQuota: { men: 4, women: 4 },
    stageQuota: { men: 6, women: 6 },
  },
  {
    name: "Czech Rep.",
    shortName: "CZE",
    flag: "",
    colors: ["#ff1a1a", "#0000ff"],
    raceQuota: { men: 5, women: 5 },
    stageQuota: { men: 7, women: 7 },
  },
  {
    name: "Slovenia",
    shortName: "SLO",
    flag: "",
    colors: ["#ffff99", "#000000"],
    raceQuota: { men: 4, women: 3 },
    stageQuota: { men: 6, women: 5 },
  },
  {
    name: "Slovakia",
    shortName: "SVK",
    flag: "",
    colors: ["#ff00ff", "#ffffff"],
    raceQuota: { men: 3, women: 3 },
    stageQuota: { men: 5, women: 5 },
  },
  {
    name: "Estonia",
    shortName: "EST",
    flag: "",
    colors: ["#000000", "#ffffff"],
    raceQuota: { men: 3, women: 4 },
    stageQuota: { men: 5, women: 6 },
  },
];

var mockData = {
  teamDesc:
    " is a potent team with some strong players as well as fresh growing stars. Player should rely on skill in order to bring his team to victory.",
};

export const racesData = [
  {
    name: "Estersund",
    raceMap: [
      // raceTypes.relay_women,
      raceTypes.sprint_men,
      raceTypes.sprint_women,
      raceTypes.pursuit_men,
      raceTypes.pursuit_women,
      // raceTypes.relay_men,
    ],
  },
  {
    name: "Pokljuka",
    raceMap: [raceTypes.individual_men, raceTypes.individual_women, raceTypes.sprint_men, raceTypes.sprint_women],
  },
  {
    name: "Annecy",
    raceMap: [
      raceTypes.sprint_men,
      raceTypes.sprint_women,
      raceTypes.pursuit_men,
      raceTypes.pursuit_women,
      raceTypes.massStart_men,
      raceTypes.massStart_women,
    ],
  },
];

//don't like it
export const generateTeams = () => {
  // generate teams and players
  let players = [];
  let playerCount = 0;

  for (let i = 0; i < teamData.length; i++) {
    const team = teamData[i];

    for (let j = 0; j < team.stageQuota.men; j++) {
      playerCount++;
      const newPlayer = new Player({
        id: playerCount,
        gender: Constants.GENDER.MEN,
        team: team.shortName,
        colors: team.colors,
      });
      players.push(newPlayer);
    }

    for (let j = 0; j < team.stageQuota.women; j++) {
      playerCount++;
      const newPlayer = new Player({
        id: playerCount,
        gender: Constants.GENDER.WOMEN,
        team: team.shortName,
        colors: team.colors,
      });
      players.push(newPlayer);
    }
  }
  return players;
};
