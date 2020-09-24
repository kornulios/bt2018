import { Utils } from "../utils/Utils.js";
import * as Constants from "../constants/constants.js";
import { PLAYER_STATUS } from "../constants/constants.js";

export class Player {
  constructor(args) {
    //base stats
    this.id = args.id; //unique player ID
    this.baseSpeed = this.currentSpeed =
      args.gender === "men" ? Utils.rand(2600, 2200) / 100 : Utils.rand(2300, 1900) / 100; // km/h
    this.name = args.name || "Player " + args.id;
    this.team = args.team || "Team 1";
    this.colors = args.colors || [];
    this.gender = args.gender || "men";
    this.index = args.index;
    this.accuracy = args.accuracy || Utils.rand(95, 65);
    this.strength = args.strength || Utils.rand(95, 75);
    this.stamina = args.stamina || Utils.rand(99, 30);
    this.fatigue = 100;
    this.technique = args.technique || Utils.rand(99, 50);
    this.points = 0;

    //distance related
    this.distance = 0;
    this.penalty = 0;
    this.penaltyTime = 0;

    //race related
    this.status = PLAYER_STATUS.NOT_STARTED;
    this.startTimer = args.startTimer;
    this.shootingTimer = 0; // to delay shooting results

    //shooting related
    this.rangeNum = 0;
    this.currentRange = [];
    this.rifle = {};
    this.shotCount = 0;
    this.missNotification = false;

    //AI related
    this.speedMod = 1;
    this.aiBehaviour = args.aiBehaviour || Constants.AI_BEHAVIOUR.NORMAL;
    this.state = Constants.AI_PLAYER_RUN_STATUS.NORMAL;
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
      stamina: this.fatigue.toFixed(2),
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

  // setDistance(newDistance) {
  //   //required for relay placement
  //   this.distance = newDistance;
  // }

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
    if (this.shootingTimer > 0) this.shootingTimer -= elapsedTime;
  }

  runPenaltyLap(elapsedTime) {
    const fps = elapsedTime;
    const distancePassed = ((this.currentSpeed * 0.9) / 3600) * fps; // m/ms

    this.penalty -= distancePassed;
    if (this.shootingTimer > 0) this.shootingTimer -= elapsedTime;
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
        aimTime: 35000, // 35 - 45s
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

    if (this.rifle.aimTime > 0) {
      return false;
    }

    //uncomment after debugging
    this.rifle.aimTime = this.shotCount < 5 ? Utils.rand(6, 3) * 600 : Utils.rand(12, 7) * 600;
    // this.rifle.aimTime = 3000;		// 3 - 5s

    //uncomment after debugging
    const nextTarget = this.shotCount >= 5 ? this.currentRange.indexOf(0) : this.shotCount;
    if (Utils.rand(100, 0) < this.accuracy) {
      this.currentRange[nextTarget] = 1; // HIT
    } else {
      this.setMissedNotification();
    }
    // this.currentRange = [1, 0, 0, 1, 1];

    this.shotCount++;
  }

  //REFACTOR!

  reset() {
    this.currentSpeed = this.baseSpeed;
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

  recalculateStatus() {
    //FATIGUE
    if (this.running) {
      var newSpeed = this.baseSpeed * this.speedMod * Math.pow(this.fatigue / 100, 0.33);
      switch (this.state) {
        case CONSTANT.RUNSTATE.EASE:
          this.fatigue = this.fatigue * (1 - 0.0001);
          break;
        case CONSTANT.RUNSTATE.NORMAL:
          this.fatigue = this.fatigue * (1 - 0.0002);
          break;
        case CONSTANT.RUNSTATE.PUSHING:
          this.fatigue = this.fatigue * (1 - 0.0004);
          break;
      }

      this.setSpeed(newSpeed);
    }

    if (this.shooting) {
      this.fatigue = this.fatigue * (1 + 0.0004);
    }

    if (debugProfiler[this.name]) {
      debugProfiler[this.name].push([newSpeed, this.fatigue, this.currentSpeed]);
    } else {
      debugProfiler[this.name] = [newSpeed, this.fatigue];
    }
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
