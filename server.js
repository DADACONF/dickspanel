var express    = require("express");
var cors       = require("cors");
var bodyParser = require("body/json");
var fs = require("fs");

var Firebase   = require("firebase");
var fb         = new Firebase("https://disruptbrunch.firebaseio.com/swaps");

var port = process.env.PORT || 3000;

var host = process.env.NODE_ENV === "production" ?
  "http://dickspanel.herokuapp.com" :
  "http://localhost:" + port;
var script = fs.readFileSync(__dirname + "/public/script.js")
  .toString()
  .replace("__HOST__", host);

var app = express();
app.use(cors());

app.get("/script.js", function(req, res) {
  res.set('Content-Type', 'text/javascript');
  res.send(script);
});

app.post("/swap", function(req, res) {
  bodyParser(req, res, function(err, body) {
    if (body && body.old && body.new) {
      fb.push(body);
      res.send();
    } else {
      res.status(400).send("Body must contain `old` and `new` fields");
    }
  });
});

app.use("/", express.static("public"));

var server = app.listen(port, function() {
  console.log("server listening on port 3000");
});