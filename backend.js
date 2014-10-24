var express = require("express");
var Bliss = require("bliss");
var bliss = new Bliss();
var logfmt = require("logfmt");
var app = express();

app.use(logfmt.requestLogger());

app.get("/", function(req, res) {
  var page = bliss.compileFile('views/index');
  var output = bliss.render('views/layout', "Index", page, "home");
  res.send(output);
});

app.get("/projects", function(req, res) {
  var page = bliss.compileFile('views/projects');
  var output = bliss.render('views/layout', "Index", page, "projects");

  res.send(output);
});

app.get("/contact", function(req, res) {
  var page = bliss.compileFile('views/contact');
  var output = bliss.render('views/layout', "Index", page, "contact");

  res.send(output);
});

//serve up project red game
app.use("/projectred/", express.static(__dirname + '/projectred'));

app.use(express.static(__dirname + "/public"));

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});