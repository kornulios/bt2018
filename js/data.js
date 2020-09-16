import { Player } from "./model/player.js";
import * as Constants from "./constants/constants.js";

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
    gender: Constants.GENDER.MALE,
  },
  sprint_women: {
    type: "Sprint",
    name: "Women 7.5km Sprint",
    gender: Constants.GENDER.FEMALE,
  },
  individual_men: {
    type: "Individial",
    name: "Men 20km Individual",
    gender: Constants.GENDER.MALE,
  },
  individual_women: {
    type: "Individial",
    name: "Women 15km Individual",
    gender: Constants.GENDER.FEMALE,
  },
  pursuit_men: {
    type: "Pursuit",
    name: "Men 12.5km Pursuit",
    gender: Constants.GENDER.MALE,
  },
  pursuit_women: {
    type: "Pursuit",
    name: "Women 10km Pursuit",
    gender: Constants.GENDER.FEMALE,
  },
  massStart_men: {
    type: "Mass-start",
    name: "Men 15km Mass-start",
    gender: Constants.GENDER.MALE,
  },
  massStart_women: {
    type: "Mass-start",
    name: "Women 12.5km Mass-start",
    gender: Constants.GENDER.FEMALE,
  },
  relay_men: {
    type: "Relay",
    name: "Men 4x7.5km Relay",
    gender: Constants.GENDER.MALE,
  },
  relay_women: {
    type: "Relay",
    name: "Women 4x6km Relay",
    gender: Constants.GENDER.FEMALE,
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
    name: "Ukraine",
    shortName: "UKR",
    flag: "",
    colors: ["#ffcc00", "#030bff"],
    raceQuota: { men: 5, women: 4 },
    stageQuota: { men: 7, women: 6 },
  },
  {
    name: "Belarus",
    shortName: "BLR",
    flag: "",
    // colors: ["#19a303", "#ff1500"],
    colors: ["#FFFFFF", "#ff1500"],
    raceQuota: { men: 5, women: 4 },
    stageQuota: { men: 7, women: 6 },
  },
  {
    name: "Norway",
    shortName: "NOR",
    flag: "",
    // colors: ["#c71000", "#1e00e3"],
    colors: ["#960c00", "#FFFFFF"],
    raceQuota: { men: 6, women: 6 },
    stageQuota: { men: 8, women: 8 },
  },
  {
    name: "Austria",
    shortName: "AUT",
    flag: "",
    colors: ["#ff230f", "#ffffff"],
    raceQuota: { men: 5, women: 6 },
    stageQuota: { men: 7, women: 8 },
  },
  {
    name: "France",
    shortName: "FRA",
    flag: "",
    // colors: ["#0055A4", "#EF4135"],
    colors: ["#0055A4", "#FFFFFF"],
    raceQuota: { men: 6, women: 6 },
    stageQuota: { men: 8, women: 8 },
  },
  {
    name: "Finland",
    shortName: "FIN",
    flag: "",
    colors: ["#FFFFFF", "#002f6c"],
    raceQuota: { men: 6, women: 6 },
    stageQuota: { men: 8, women: 8 },
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
];

var mockData = {
  teamDesc:
    " is a potent team with some strong players as well as fresh growing stars. Player should rely on skill in order to bring his team to victory.",
};

export const racesData = [
  {
    name: "Pokljuka",
    raceMap: [raceTypes.individual_men, raceTypes.individual_women, raceTypes.sprint_men, raceTypes.sprint_women],
  },
  {
    name: "Estersund",
    raceMap: [
      raceTypes.sprint_men,
      raceTypes.sprint_women,
      raceTypes.pursuit_men,
      raceTypes.relay_women,
      raceTypes.relay_men,
      raceTypes.pursuit_women,
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
        gender: Constants.GENDER.MALE,
        team: team.shortName,
        colors: team.colors,
      });
      players.push(newPlayer);
    }

    for (let j = 0; j < team.stageQuota.women; j++) {
      playerCount++;
      const newPlayer = new Player({
        id: playerCount,
        gender: Constants.GENDER.FEMALE,
        team: team.shortName,
        colors: team.colors,
      });
      players.push(newPlayer);
    }
  }
  return players;
};
