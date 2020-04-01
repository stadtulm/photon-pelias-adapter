var http = require("http");
var url = require("url");
var fetch = require("node-fetch");

var PHOTON_URL = process.env.PHOTON_URL || "https://photon.komoot.de";
var PORT = process.env.PORT || 8080;

const { translateResults } = require("./translate.js");

http
  .createServer(function(req, res) {
    let parsedUrl = url.parse(req.url, true);
    let path = parsedUrl.pathname;

    switch (path) {
      case "/v1/search":
        search(parsedUrl.query, res);
        break;
      case "/v1/reverse":
        reverse(parsedUrl.query, res);
        break;
      default:
        writeError(res, 404, "path not found");
        break;
    }
  })
  .listen(PORT);

function search(params, res) {
  let bboxParam = null;

  //ignore GTFS stop requests. Used by digitransit
  if (params["sources"] && params["sources"].includes("gtfs")) {
    res.writeHead(404, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    });
    res.write(JSON.stringify({ error: "no gtfs", features: [] }));
    res.end();
    return;
  }

  if (
    params["boundary.rect.min_lat"] &&
    params["boundary.rect.max_lat"] &&
    params["boundary.rect.min_lon"] &&
    params["boundary.rect.max_lon"]
  ) {
    bboxParam = `&bbox=${params["boundary.rect.min_lon"]},${params["boundary.rect.min_lat"]},${
      params["boundary.rect.max_lon"]
    },${params["boundary.rect.max_lat"]}`;
  }

  let url = `${PHOTON_URL}/api/?q=${encodeURIComponent(params.text)}&lang=${params.lang || "en"}`;
  if (bboxParam) {
    url += bboxParam;
  }
  fetch(url)
    .then(res => res.json())
    .then(json => {
      if (!json.features) {
        writeError(res, 500, "no result from service");
        return;
      }
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      });
      res.write(JSON.stringify(translateResults(json)));
      res.end();
    })
    .catch(err => {
      writeError(res, 500, err);
    });
}

function reverse(params, res) {
  if (params["point.lat"] && params["point.lon"]) {
    let url = `${PHOTON_URL}/reverse?lon=${params["point.lon"]}&lat=${params["point.lat"]}&lang=${params.lang || "en"}`;
    fetch(url)
      .then(res => res.json())
      .then(json => {
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        });
        res.write(JSON.stringify(translateResults(json)));
        res.end();
      })
      .catch(err => {
        writeError(res, 500, err);
      });
  } else {
    writeError(res, 400, "point.lat and point.lon are required");
  }
}

function writeError(res, statusCode, errorMessage) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  });
  res.write(JSON.stringify({ error: errorMessage }));
  res.end();
}
