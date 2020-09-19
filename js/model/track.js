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
      new Vector(this.baseLineX, this.baseLineY + 20),
    ];
    this.finishCoordsMap = this.initCoordsMap(this.finishCoords);
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
      return (acc += item.l);
    }, 0);

    return lapLength / trackLengthPixels;
  }

  getCoordinates(dist) {
    const d = (dist - this.lapLength * (this.getLapNumber(dist) - 1)) / this.pixelRatio;
    const coords = dist < this.getTrackLength() - this.finishLineLength ? this.coordsMap : this.finishCoordsMap;

    let totalLength = 0;

    for (let i = 0; i < coords.length; i++) {
      totalLength += coords[i].l;

      if (d <= totalLength) {
        const actualDistance = d - (totalLength - coords[i].l);

        return new Vector(
          coords[i].coords.x + actualDistance * coords[i].direction.x,
          coords[i].coords.y + actualDistance * coords[i].direction.y
        );
      }
    }
    debugger;
    console.log("invalid distance", d);
  }

  getPenaltyCoordinates(dist) {
    const d = (150 * Math.ceil(dist / 150) - dist) / this.penaltyPixelRatio;
    let totalLength = 0;

    for (let i = 0; i < this.penaltyCoordsMap.length; i++) {
      totalLength += this.penaltyCoordsMap[i].l;
      if (d <= totalLength) {
        const actualDistance = d - (totalLength - this.penaltyCoordsMap[i].l);

        return new Vector(
          this.penaltyCoordsMap[i].coords.x + actualDistance * this.penaltyCoordsMap[i].direction.x,
          this.penaltyCoordsMap[i].coords.y + actualDistance * this.penaltyCoordsMap[i].direction.y
        );
      }
    }
    console.log("invalid penalty distance", d);
  }

  // getFinishCoordinates(dist) {
  //   const d = (this.finishLineLength - (this.getTrackLength() - dist)) / this.pixelRatio;
  //   let totalLength = 0;

  //   for (let i = 0; i < this.finishCoordsMap.length; i++) {
  //     totalLength += this.finishCoordsMap[i].l;
  //     if (d <= totalLength) {
  //       const actualDistance = d - (totalLength - this.finishCoordsMap[i].l);

  //       return new Vector(
  //         this.finishCoordsMap[i].coords.x + actualDistance * this.finishCoordsMap[i].direction.x,
  //         this.finishCoordsMap[i].coords.y + actualDistance * this.finishCoordsMap[i].direction.y
  //       );
  //     }
  //   }
  //   console.log("invalid finish distance", d);
  // }

  getFinishEntrance() {
    // return X coord of finish entrance
    // 2.5% of distance
    // return this.getCoordinates(this.getTrackLength() - this.finishLineLength).x;
    const dist = this.getTrackLength() - this.finishLineLength;

    const actualDistance = this.finishLineLength / this.pixelRatio;

    // const d = (dist - this.lapLength * (this.getLapNumber(dist) - 1)) / this.pixelRatio;
    const { coords, direction } = this.coordsMap[this.coordsMap.length - 2];

    // let totalLength = 0;

    return new Vector(coords.x + actualDistance * direction.x, coords.y + actualDistance * direction.y);

    // for (let i = 0; i < coords.length; i++) {
    //   totalLength += coords[i].l;

    //   if (d <= totalLength) {
    //     const actualDistance = d - (totalLength - coords[i].l);

    //     return new Vector(
    //       coords[i].coords.x + actualDistance * coords[i].direction.x,
    //       coords[i].coords.y + actualDistance * coords[i].direction.y
    //     );
    //   }
    // }
    // console.log("invalid distance", d);
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
    if (distance === this.getTrackLength()) {
      return "Finish";
    } else if (this.shootingRange.indexOf(distance) >= 0) {
      return `S${this.shootingRange.indexOf(distance) + 1}`;
    } else {
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
