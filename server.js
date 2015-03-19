var express = require("express");
var Firebase = require("firebase");
var serveStatic = require('serve-static');
var cors = require("cors");
var bodyParser = require("body/json");

var app = express();
app.use(serveStatic('public'));
app.use(cors());

var fb = new Firebase("https://disruptbrunch.firebaseio.com/swaps");
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

var server = app.listen(function() {
  console.log("server listening on port 3000");
});