import { Utils } from "../utils/Utils.js";
import * as Constants from "../constants/constants.js";
import { PLAYER_STATUS } from "../constants/constants.js";

const healthStateMap = [
  { name: "Exausted", modifier: 0.92, maxFatigue: 0 },
  { name: "Tired", modifier: 0.96, maxFatigue: 30 },
  { name: "Normal", modifier: 1, maxFatigue: 60 },
  { name: "Rested", modifier: 1.02, maxFatigue: 90 },
];

const [EXAUSTED, TIRED, NORMAL, RESTED] = [0, 1, 2, 3];

const baseFatigueLoss = 0.0025;

export class Player {
  constructor(args) {
    //base stats
    this.id = args.id; //unique player ID
    // this.baseSpeed = this.currentSpeed =
    //   args.baseSpeed || args.gender === "men" ? Utils.rand(2600, 2200) / 100 : Utils.rand(2300, 1900) / 100; // km/h
    this.gender = args.gender || "men";
    this.name = args.name || "Player " + args.id;
    this.team = args.team || "Team 1";
    this.colors = args.colors || [];

    this.baseSpeed = args.baseSpeed ? args.baseSpeed : this._getRandomSpeed();
    this.currentSpeed = this.baseSpeed;
    this.accuracy = args.accuracy || Utils.rand(95, 65);
    this.strength = args.strength || Utils.rand(99, 65);
    this.stamina = args.stamina || Utils.rand(99, 30);
    this.fatigue = 100;
    this.technique = args.technique || Utils.rand(99, 50);
    this.points = 0;
    this.healthState = healthStateMap[RESTED];

    //distance related
    this.distance = 0;
    this.penalty = 0;
    this.penaltyTime = 0;

    //race related
    this.startGroup = null;
    this.number = null;
    this.status = PLAYER_STATUS.NOT_STARTED;
    this.startTimer = args.startTimer;
    this.shootingTimer = 0; // to delay shooting results

    //shooting related
    this.rangeNum = 0;
    this.currentRange = [];
    this.rifle = {};
    this.shotCount = 0;
    this.missNotification = false;

    //balance related
    this.fatigueLossPerTick = baseFatigueLoss / (this.strength * 0.01);
    this.speedMod = 1;
    this.aiBehaviour = args.aiBehaviour || Constants.AI_BEHAVIOUR.NORMAL;
    this.runState = Constants.AI_PLAYER_RUN_STATUS.NORMAL;
  }

  _getRandomSpeed() {
    return this.gender === "men" ? Utils.rand(2600, 2200) / 100 : Utils.rand(2450, 1900) / 100;
  }

  static create(name, team, gender) {
    return new Player({ name, team, gender });
  }

  getShortInfo() {
    return {
      name: this.name,
      team: this.team,
      number: this.number,
    };
  }

  getRaceStats() {
    return {
      number: this.number,
      name: this.name,
      team: this.team,
      status: this.status,
      distance: this.distance.toFixed(2),
      speed: this.currentSpeed.toFixed(2),
      fatigue: this.fatigue.toFixed(2),
    };
  }

  setSpeed(speed) {
    return (this.currentSpeed = speed);
  }

  getCoords() {
    return { x: this.x, y: this.y };
  }

  getAccuracy() {
    return this.accuracy;
  }

  getDistance() {
    return this.distance;
  }

  getShootingRange() {
    return this.currentRange;
  }

  getShootCount() {
    return this.shotCount;
  }

  addPenalty(length) {
    this.penalty += length;
    return this.penalty;
  }

  addPenaltyTime(time) {
    this.penaltyTime += time;
  }

  setMissedNotification() {
    this.missNotification = true;
  }

  dismissMissNotification() {
    this.missNotification = false;
  }

  run(elapsedTime) {
    //move forward on track
    const fps = elapsedTime;
    const distancePassed = (this.currentSpeed / 3600) * fps; // m/ms

    this.distance += distancePassed;
    if (this.shootingTimer > 0) {
      this.shootingTimer -= elapsedTime;
      if (this.shootingTimer < 0) this.shootingTimer = 0;
    }
  }

  runPenaltyLap(elapsedTime) {
    const fps = elapsedTime;
    const distancePassed = ((this.currentSpeed * 0.8) / 3600) * fps; // m/ms

    this.penalty -= distancePassed;
    if (this.shootingTimer > 0) {
      this.shootingTimer -= elapsedTime;
      if (this.shootingTimer < 0) this.shootingTimer = 0;
    }
  }

  enterShootingRange(range) {
    //enter range
    if (!this.shooting) {
      this.rangeNum = range;
      this.currentRange = [0, 0, 0, 0, 0];
      this.nextTarget = 0;
      this.shotCount = 0;

      //load rifle
      this.rifle = {
        aimTime: Utils.rand(50000, 35000), // 35 - 45s
      };
    }
  }

  quitShootingRange(penaltyLaps) {
    this.status = penaltyLaps ? PLAYER_STATUS.PENALTY : PLAYER_STATUS.RUNNING;
    this.rifle = {};
    this.shootingTimer = Constants.SHOOTING_DELAY;
  }

  shoot(elapsedTime) {
    this.rifle.aimTime -= elapsedTime;

    // this.fatigue = this.fatigue + 0.125;
    if (this.rifle.aimTime > 0) {
      return false;
    }

    //uncomment after debugging
    this.rifle.aimTime = this.shotCount < 5 ? Utils.rand(6, 3) * 600 : Utils.rand(12, 7) * 600;

    //uncomment after debugging
    const nextTarget = this.shotCount >= 5 ? this.currentRange.indexOf(0) : this.shotCount;
    if (Utils.rand(100, 0) < this.accuracy) {
      this.currentRange[nextTarget] = 1; // HIT
    } else {
      this.setMissedNotification();
    }

    this.shotCount++;
  }

  //REFACTOR!

  reset() {
    this.runState = Constants.AI_PLAYER_RUN_STATUS.NORMAL;
    this.currentSpeed = this.baseSpeed * this.healthState.modifier * this.runState;
    this.fatigue = 100;
    this.distance = 0;
    this.penalty = 0;
    this.penaltyTime = 0;

    this.rangeNum = 0;
    this.rifle = {};
    // this.state = CONSTANT.RUNSTATE.NORMAL;
    this.status = PLAYER_STATUS.NOT_STARTED;
  }

  // CHECK LATER

  recalculateStatus(gameTick) {
    //FATIGUE MODEL
    const fatigueTicks = Math.round(gameTick / 100);
    const oldHeathState = this.healthState.name;
    switch (this.runState) {
      case Constants.AI_PLAYER_RUN_STATUS.EASE:
        this.fatigue -= (this.fatigueLossPerTick - this.fatigueLossPerTick * 0.4) * fatigueTicks;
        break;
      case Constants.AI_PLAYER_RUN_STATUS.NORMAL:
        this.fatigue -= this.fatigueLossPerTick * fatigueTicks;
        break;
      case Constants.AI_PLAYER_RUN_STATUS.PUSHING:
        this.fatigue -= (this.fatigueLossPerTick + this.fatigueLossPerTick * 0.4) * fatigueTicks;
        break;
    }

    for (let i = 0; i < healthStateMap.length; i++) {
      if (this.fatigue > healthStateMap[i].maxFatigue) {
        this.healthState = healthStateMap[i];
      }
    }

    // if (this.healthState.name !== oldHeathState) {
    this.currentSpeed = this.baseSpeed * this.healthState.modifier * this.runState;
    // }

    // if (this.shooting) {
    //   this.fatigue = this.fatigue * (1 + 0.0004);
    // }

    // if (debugProfiler[this.name]) {
    //   debugProfiler[this.name].push([newSpeed, this.fatigue, this.currentSpeed]);
    // } else {
    //   debugProfiler[this.name] = [newSpeed, this.fatigue];
    // }
  }

  //AI
  makeDecision() {
    var me = this,
      newSpeed = me.baseSpeed,
      dice = Utils.rand(100),
      aggro = me.aiBehaviour[0],
      norm = aggro + me.aiBehaviour[1],
      choice;
    // var choise = Math.floor(Math.random() * Object.keys(CONSTANT.RUNSTATE).length);

    //make ai decide
    if (dice < aggro) {
      choice = CONSTANT.RUNSTATE.PUSHING;
      this.speedMod = 1 + (CONSTANT.BASE_SPEED_MOD + me.strength / 1000);
      // newSpeed = me.baseSpeed * (1 + (CONSTANT.BASE_SPEED_MOD + (me.strength / 1000)));
    } else if (dice > norm) {
      choice = CONSTANT.RUNSTATE.EASE;
      this.speedMod = 1 - (CONSTANT.BASE_SPEED_MOD + (100 - me.strength) / 1000);
      // newSpeed = me.baseSpeed * (1 - (CONSTANT.BASE_SPEED_MOD + ((100 - me.strength) / 1000)));
    } else {
      choice = CONSTANT.RUNSTATE.NORMAL;
    }
    me.state = choice;
  }
}
