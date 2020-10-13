var express = require("express");
var app = express();
var router = express.Router();
var path = require("path");
var fs = require("fs");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", function (req, res) {
  res.sendFile("public/index.html", { root: __dirname });
});

app.get("/data", function (req, res) {
  res.sendFile("public/data.json", { root: __dirname });
});

app.post("/newmap", (request, response) => {
  var body = "";
  var filePath = __dirname + "/maps/map1.json";
  // console.log(request.body);
  request.on("data", (data) => {
    body += data;
  });
  request.on("end", () => {
    console.log(body);
    fs.writeFile(filePath, body, () => {
      response.sendStatus(200);
    });
  });
});

app.get("/map-coords", (request, response) => {
  response.sendFile("maps/map1.json", { root: __dirname });
})

app.use(express.static(path.join(__dirname, "static")));

app.set("port", 3000);

var server = app.listen(app.get("port"), function () {
  var port = server.address().port;
  console.log("app running on port ", port);
});
