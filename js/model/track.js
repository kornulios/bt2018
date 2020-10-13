import { Vector } from "../view/Vector.js";

const httpClient = axios.create({ baseURL: "http://localhost:3000", timeout: 2000 });

export class Track {
  constructor() {
    this.penaltyLapLength = 150;
    this.lapLength = null;

    this.baseLineX = 376;
    this.baseLineY = 575;

    
    this.coords = [];
    this.flagsCoords = [];
    this.waypoints = [];

    this.penaltyLapCoords = [
      new Vector(376, 555),
      new Vector(356, 555),
      new Vector(346, 550),
      new Vector(348, 540),
      new Vector(346, 535),
      new Vector(356, 528),
      new Vector(376, 528),
      new Vector(386, 545),
      new Vector(376, 555),
    ];
  }

  async loadMapData() {
    const response = await httpClient.get("/map-coords");
    this.coords = response.data.map((coord) => new Vector(coord[0], coord[1]));
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

    this.flagsCoords[0] = this.getCoordinates(this.waypoints[1]);
    this.flagsCoords[1] = this.getCoordinates(this.waypoints[2]);
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
            x: coords[i].coords.x + actualDistance * coords[i].direction.x, //| 0,
            y: coords[i].coords.y + actualDistance * coords[i].direction.y, //| 0,
          };
        }
      } catch {
        debugger;
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
          x: coords[i].coords.x + actualDistance * coords[i].direction.x, // | 0,
          y: coords[i].coords.y + actualDistance * coords[i].direction.y, // | 0,
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
      x: finishCoords.coords.x + actualDistance * -preFinishCoords.direction.x,
      y: finishCoords.coords.y + actualDistance * -preFinishCoords.direction.y,
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
