var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../server");
var db = require("../models");
var expect = chai.expect;
<<<<<<< HEAD
// Setting up the chai http plugin
chai.use(chaiHttp);
var request;
=======

// Setting up the chai http plugin
chai.use(chaiHttp);

var request;

>>>>>>> master
describe("POST /api/examples", function() {
  // Before each test begins, create a new request server for testing
  // & delete all examples from the db
  beforeEach(function() {
    request = chai.request(server);
    return db.sequelize.sync({ force: true });
  });
<<<<<<< HEAD
=======

>>>>>>> master
  it("should save an example", function(done) {
    // Create an object to send to the endpoint
    var reqBody = {
      text: "Example text",
      description: "Example description"
    };
<<<<<<< HEAD
=======

>>>>>>> master
    // POST the request body to the server
    request
      .post("/api/examples")
      .send(reqBody)
      .end(function(err, res) {
        var responseStatus = res.status;
        var responseBody = res.body;
<<<<<<< HEAD
        // Run assertions on the response
        expect(err).to.be.null;
        expect(responseStatus).to.equal(200);
        expect(responseBody)
          .to.be.an("object")
          .that.includes(reqBody);
=======

        // Run assertions on the response

        expect(err).to.be.null;

        expect(responseStatus).to.equal(200);

        expect(responseBody)
          .to.be.an("object")
          .that.includes(reqBody);

>>>>>>> master
        // The `done` function is used to end any asynchronous tests
        done();
      });
  });
<<<<<<< HEAD
});
=======
});
>>>>>>> master
