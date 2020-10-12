let mapCoords = [];

const addCoord = (event) => {
  let canvas = document.querySelector("#map-canvas");
  let rect = canvas.getBoundingClientRect();

  // console.log(event.clientX - rect.left, event.clientY - rect.top);
  mapCoords.push([event.clientX - rect.left, event.clientY - Math.floor(rect.top)]);

  drawMap();
};

const removeCoord = () => {
  mapCoords.pop();
  drawMap();
};

const closeCoordsPath = () => {
  mapCoords.push(mapCoords[0]);
  drawMap();
}

const drawMap = () => {
  let canvas = document.querySelector("#map-canvas");
  let ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(mapCoords[0][0], mapCoords[0][1]);
  for (let i = 0; i < mapCoords.length; i++) {
    ctx.lineTo(mapCoords[i][0], mapCoords[i][1]);
  }

  ctx.stroke();
};

const initEvents = () => {
  document.querySelector("canvas").addEventListener("click", (event) => addCoord(event));
};

document.addEventListener("DOMContentLoaded", initEvents);
