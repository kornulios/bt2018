export class Track {
  constructor() {
    this.length = 7500;
    this.laps = 3;
    this.penaltyLapLength = 150;
    this.waypointsPerLap = 3;
    this.shootingEntry = this.length / this.laps;

    this.lapLength = 2500;
    this.trackLength = 7500; //Math.ceil(data.lapLength[gen] * data.laps);    //overall track distance
    // this.type = data.type;
    // this.laps = data.laps;

    // this.waypoints = this.setupWaypoints();   // TODO waypoints model should be refactored
    // this.shootingRange = this.setupShootinRanges();
    this.waypoints = [0, 800, 1600, 2450, 2500, 3300, 4100, 4950, 5000, 5800, 6600, 7500]
    this.shootingRange = [0, 2450, 4950];

  }

  getTrackLength() {
    return this.trackLength;
  }

  getLapLength() {
    return this.lapLength;
  }

  getTrackLengthKm() {
    return (this.trackLength / 1000).toFixed(1);
  }

  getWaypointName = (waypointId) => {
    const distance = this.waypoints[waypointId];
    if (distance === this.trackLength) {
      return 'Finish';
    } else if (this.shootingRange.indexOf(distance) >= 0) {
      return `S${this.shootingRange.indexOf(distance) + 1}`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }

  }

  // setupShootinRanges() {
  //   var resWp = [];
  //   for (let i = 1; i < this.laps; i++) {
  //     if (this.type !== 'Relay') {
  //       resWp.push(i * this.lapLength);
  //     } else {
  //       if ((this.lapLength * i) % (this.lapLength * this.waypointsPerLap) !== 0) {
  //         resWp.push(i * this.lapLength);
  //       }
  //     }
  //   }
  //   return resWp;
  // }

  // setupWaypoints() {
  //   var resWp = [];
  //   var step = this.lapLength / this.waypointsPerLap;
  //   for (var i = 0; i < this.laps * this.waypointsPerLap; i++) {
  //     resWp.push(Math.ceil(step * (i + 1)));
  //   }
  //   return resWp;
  // }

  waypointsNum() {
    return this.waypoints.length;
  }

  getLapNumber(distance) {
    return Math.ceil(distance / this.trackLength);
  }

  isWaypointPassed(newDist, prevDist) {
    for (var i = 0; i < this.waypoints.length; i++) {
      if ((newDist >= this.waypoints[i]) && (prevDist < this.waypoints[i])) {
        return i;
      }
    }
    if (newDist >= this.trackLength) {
      return this.waypoints.length - 1;
    }
    return false;  //no wp passed
  }

  isShootingEntrancePassed(newDist, prevDist) {
    for (let i = 0; i < this.shootingRange.length; i++) {
      if (newDist >= this.shootingRange[i] && prevDist < this.shootingRange[i]) {

        return i;
      }
    }

    return false;
  }

  // passShootingRange(newDistance, passedDistance) {
  //   for (let i = 0; i < this.shootingRange.length; i++) {
  //     if (newDistance > this.shootingRange[i] && (newDistance - passedDistance) <= this.shootingRange[i]) {
  //       return i + 1;
  //     }
  //   }
  //   return false;
  // }
}