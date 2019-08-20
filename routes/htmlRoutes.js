var db = require("../models");
module.exports = function(app) {
  // Load index page
  app.get("/examples", function(req, res) {
    console.log("i got called all");
    db.Example.findAll({}).then(function(dbExamples) {
      console.log(dbExamples);
      res.render("index", {
        msg: "Welcome!",
        examples: dbExamples
      });
    });
  });
  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    console.log("i got called idddssss");
    db.Example.findOne({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.render("example", {
        example: dbExample
      });
    });
  });
  // Render registration from.
  app.get("/register", function(req, res) {
    console.log("i got called");

    res.render("register", {
      title: "Registration"
    });
  });
  // Render home page.
  app.get("/", function(req, res) {
    console.log(req.user);
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      res.render("home", {
        user: true
      });
    } else {
      res.render("home");
    }
  });
  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    console.log("i got called 404");
    res.render("404");
  });
};
