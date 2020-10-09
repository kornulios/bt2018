import { Vector } from "../view/Vector.js";

export class Track {
  constructor() {
    this.penaltyLapLength = 150;
    this.lapLength = null;

    this.baseLineX = 205;
    this.baseLineY = 210;

    this.coords = [
      new Vector(205, 210),
      new Vector(10, 210),
      new Vector(10, 30),
      new Vector(28, 15),
      new Vector(30, 80),
      new Vector(35, 85),
      new Vector(45, 45),
      new Vector(195, 100),
      new Vector(200, 90),
      new Vector(205, 88),
      new Vector(213, 120),
      new Vector(250, 90),
      new Vector(300, 50),
      new Vector(320, 80),
      new Vector(410, 10),
      new Vector(410, 30),
      new Vector(380, 50),
      new Vector(400, 90),
      new Vector(320, 140),
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
  }

  initTrack() {
    this.coordsMap = this.initCoordsMap(this.coords);
    this.pixelRatio = this.getPixelRatio(this.coordsMap, this.getLapLength()); // track length / pixels

    this.penaltyCoordsMap = this.initCoordsMap(this.penaltyLapCoords);
    this.penaltyPixelRatio = this.getPixelRatio(this.penaltyCoordsMap, this.penaltyLapLength);

    this.finishLineLength = 250; // 2.5% meters

    this.finishCoords = [
      new Vector(this.getFinishEntrance().x, this.baseLineY),
      new Vector(this.getFinishEntrance().x, this.baseLineY + 20),
      new Vector(this.baseLineX + 20, this.baseLineY + 20),
    ];
    this.finishCoordsMap = this.initCoordsMap(
      this.finishCoords,
      (this.lapLength - this.finishLineLength) / this.pixelRatio
    );
  }

  initCoordsMap(coords, fromDistance) {
    let totalLength = fromDistance || 0;

    const res = coords.map((vec, i, arr) => {
      const lastElement = i === arr.length - 1;
      const nextElement = lastElement ? arr[0] : arr[i + 1];

      const l = vec.substract(nextElement).getLength();
      const d = totalLength;
      totalLength += l;
      const direction = nextElement.substract(vec).normalize();

      return { coords: new Vector(vec.x, vec.y), direction, d, next: nextElement };
    });

    return res;
  }

  getPixelRatio(coordsArray, lapLength) {
    const trackLengthPixels = coordsArray[coordsArray.length - 1].d;

    return lapLength / trackLengthPixels;
  }

  getCoordinates(dist) {
    const d = (dist - this.lapLength * (this.getLapNumber(dist) - 1)) / this.pixelRatio; //passed distance in px
    const coords = dist < this.getTrackLength() - this.finishLineLength ? this.coordsMap : this.finishCoordsMap;

    for (let i = 0; i < coords.length; i++) {
      try {
        if (d >= coords[i].d && d <= coords[i + 1].d) {
          const actualDistance = d - coords[i].d;

          return {
            x: (coords[i].coords.x + actualDistance * coords[i].direction.x), //| 0,
            y: (coords[i].coords.y + actualDistance * coords[i].direction.y), //| 0,
          };
        }
      } catch {
        debugger
      }
    }
    console.log("invalid distance", d);
  }

  getPenaltyCoordinates(dist) {
    const d = (150 * Math.ceil(dist / 150) - dist) / this.penaltyPixelRatio;
    const coords = this.penaltyCoordsMap;

    for (let i = 0; i < coords.length; i++) {
      if (d >= coords[i].d && d <= coords[i + 1].d) {
        const actualDistance = d - coords[i].d;

        return {
          x: (coords[i].coords.x + actualDistance * coords[i].direction.x), // | 0,
          y: (coords[i].coords.y + actualDistance * coords[i].direction.y), // | 0,
        };
      }
    }

    console.log("invalid penalty distance", d);
  }

  getFinishEntrance() {
    // return X coord of finish entrance
    // 2.5% of distance
    const actualDistance = this.finishLineLength / this.pixelRatio;

    const finishCoords = this.coordsMap[this.coordsMap.length - 1];
    const preFinishCoords = this.coordsMap[this.coordsMap.length - 2];

    return {
      x: (finishCoords.coords.x + actualDistance * -preFinishCoords.direction.x),
      y: (finishCoords.coords.y + actualDistance * -preFinishCoords.direction.y),
    };
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

  getWaypointName = (waypointId) => {
    const distance = this.waypoints[waypointId];
    const trackLen = this.getTrackLength();

    switch (true) {
      case distance === 0:
        return "Start";
      case distance === trackLen:
        return "Finish";
      case this.shootingRange.indexOf(distance) > 0:
        return `S${this.shootingRange.indexOf(distance)}`;
      default:
        return `${(distance / 1000).toFixed(1)}km`;
    }
  };

  getFinishWaypoint() {
    return this.waypoints.length - 1;
  }

  waypointsNum() {
    return this.waypoints.length;
  }

  isWaypointPassed(newDist, prevDist) {
    for (var i = 0; i < this.waypoints.length; i++) {
      if (newDist >= this.waypoints[i] && prevDist < this.waypoints[i]) {
        return i;
      }
    }

    return false; //no wp passed
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
