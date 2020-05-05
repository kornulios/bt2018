import { Vector } from '../view/Vector.js';

export class Track {
  constructor() {
    this.penaltyLapLength = 150;
    this.lapLength = 3000;

    //sprint
    // this.waypoints = [0, 800, 1600, 2450, 2500, 3300, 4100, 4950, 5000, 5800, 6600, 7500]
    // this.shootingRange = [0, 2450, 4950];

    this.baseLineX = 205;
    this.baseLineY = 210;
    this.finishLineLength = 200; // meters

    //individual / pursuit / mass start
    this.waypoints =
      [0,
        1500, 2300, 2950, 3000,
        4500, 5300, 5950, 6000,
        7500, 8300, 8950, 9000,
        10500, 11300, 11950, 12000,
        13500, 14300, 15000
      ]

    this.shootingRange = [0, 2950, 5950, 8950, 11950];

    //relay / sprint 
    // this.waypoints = [0, 800, 1600, 2450, 2500, 3300, 4100, 4950, 5000, 5800, 6600, 7500];
    // this.shootingRange = [0, 2450, 4950];

    this.coords = [
      new Vector(205, 210),
      new Vector(10, 210),
      // new Vector(10, 10),
      new Vector(10, 30),
      // new Vector(16, 25),
      // new Vector(23, 20),
      new Vector(28, 15),
      new Vector(195, 100),
      new Vector(410, 10),
      new Vector(410, 210),
      new Vector(205, 210),
    ];

    this.penaltyLapCoords = [
      new Vector(215, 200),
      new Vector(215, 185),
      new Vector(245, 185),
      new Vector(245, 200),
      new Vector(215, 200),
    ];



    this.coordsMap = this.initCoordsMap(this.coords);
    this.pixelRatio = this.getPixelRatio(this.coordsMap, this.getLapLength());

    this.penaltyCoordsMap = this.initCoordsMap(this.penaltyLapCoords);
    this.penaltyPixelRatio = this.getPixelRatio(this.penaltyCoordsMap, this.penaltyLapLength);

    this.finishCoords = [
      new Vector(this.getFinishEntrance(), this.baseLineY),
      new Vector(this.getFinishEntrance(), this.baseLineY + 20),
      new Vector(this.baseLineX + 20, this.baseLineY + 20),
    ];
    this.finishCoordsMap = this.initCoordsMap(this.finishCoords);

    // this.finishPixelRation = this.getPixelRatio(this.finishCoordsMap, 150);

  }

  initCoordsMap(coords) {
    const res = coords.map((vec, i, arr) => {
      const lastElement = i === arr.length - 1;

      const l = lastElement ? 0 : vec.substract(arr[i + 1]).getLength();
      const direction = lastElement ? new Vector(0, 0) : arr[i + 1].substract(vec).normalize();

      return { coords: new Vector(vec.x, vec.y), l, direction };
    });

    return res;
  }

  getPixelRatio(coordsArray, lapLength) {
    const trackLengthPixels = coordsArray.reduce((acc, item) => {

      return acc += item.l;
    }, 0);

    return lapLength / trackLengthPixels;
  }

  getCoordinates(dist) {
    const d = (dist - (this.lapLength * (this.getLapNumber(dist) - 1))) / this.pixelRatio;
    let totalLength = 0;

    for (let i = 0; i < this.coordsMap.length; i++) {
      totalLength += this.coordsMap[i].l;
      if (d <= totalLength) {
        const actualDistance = d - (totalLength - this.coordsMap[i].l);

        return new Vector(this.coordsMap[i].coords.x + actualDistance * this.coordsMap[i].direction.x,
          this.coordsMap[i].coords.y + actualDistance * this.coordsMap[i].direction.y);
      }
    }
    console.log('invalid distance', d);
  }

  getPenaltyCoordinates(dist) {
    // const d = (dist - (this.lapLength * (this.getLapNumber(dist) - 1))) / this.pixelRatio;
    const d = (150 * Math.ceil(dist / 150) - dist) / this.penaltyPixelRatio;
    let totalLength = 0;

    for (let i = 0; i < this.penaltyCoordsMap.length; i++) {
      totalLength += this.penaltyCoordsMap[i].l;
      if (d <= totalLength) {
        const actualDistance = d - (totalLength - this.penaltyCoordsMap[i].l);

        return new Vector(this.penaltyCoordsMap[i].coords.x + actualDistance * this.penaltyCoordsMap[i].direction.x,
          this.penaltyCoordsMap[i].coords.y + actualDistance * this.penaltyCoordsMap[i].direction.y);
      }
    }
    console.log('invalid distance', d);
  }

  getFinishCoordinates(dist) {
    const d = (this.finishLineLength - (this.getTrackLength() - dist)) / this.pixelRatio;
    let totalLength = 0;

    for (let i = 0; i < this.finishCoordsMap.length; i++) {
      totalLength += this.finishCoordsMap[i].l;
      if (d <= totalLength) {
        const actualDistance = d - (totalLength - this.finishCoordsMap[i].l);

        return new Vector(this.finishCoordsMap[i].coords.x + actualDistance * this.finishCoordsMap[i].direction.x,
          this.finishCoordsMap[i].coords.y + actualDistance * this.finishCoordsMap[i].direction.y);
      }
    }
    console.log('invalid distance', d);
  }

  getFinishEntrance() {
    //200m of distance
    return this.getCoordinates(this.getTrackLength() - this.finishLineLength).x;
  }


  getLapNumber(distance) {
    return Math.floor(distance / this.lapLength) + 1;
  }


  getTrackLength() {
    return this.waypoints[this.waypoints.length - 1];
  }

  getLapLength() {
    return this.lapLength;
  }

  // getTrackLengthKm() {
  //   return (this.trackLength / 1000).toFixed(1);
  // }

  getWaypointName = (waypointId) => {
    const distance = this.waypoints[waypointId];
    if (distance === this.getTrackLength()) {
      return 'Finish';
    } else if (this.shootingRange.indexOf(distance) >= 0) {
      return `S${this.shootingRange.indexOf(distance) + 1}`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }

  }

  getFinishWaypoint() {
    return this.waypoints.length - 1;
  }

  waypointsNum() {
    return this.waypoints.length;
  }

  isWaypointPassed(newDist, prevDist) {
    for (var i = 0; i < this.waypoints.length; i++) {
      if ((newDist >= this.waypoints[i]) && (prevDist < this.waypoints[i])) {

        return i;
      }
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

}