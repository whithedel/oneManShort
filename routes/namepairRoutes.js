var db = require("../models");

module.exports = function(app) {
  app.get("/namepair", function(req, res) {
    console.log(req.query);
    var currentNamepair = req.query;
    console.log(req.body.namepair);
    db.Namepair.findOrCreate({
      where: currentNamepair
    }).then(function(data) {
      res.json(data);
    });
  });
};
