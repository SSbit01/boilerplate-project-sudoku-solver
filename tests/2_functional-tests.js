const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

//
const requester = chai.request(server).keepOpen();
//


suite('Functional Tests', () => {
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", done => {
    requester
    .post("/api/solve")
    .send({puzzle:"..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1"})
    .end((err, res) => {
      assert.equal(res.body.solution, "218396745753284196496157832531672984649831257827549613962415378185763429374928561");
      done();
    });
  });

  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", done => {
    requester
    .post("/api/solve")
    .end((err, res) => {
      assert.equal(res.body.error, "Required field missing");
      done();
    });
  });

  test("Solve a puzzle with invalid characters: POST request to /api/solve", done => {
    requester
    .post("/api/solve")
    .send({puzzle:"..839.7.575.....964..1.a.....16.29846.9.312.7..754.....62..5.78.8...3.2...492...1"})
    .end((err, res) => {
      assert.equal(res.body.error, "Invalid characters in puzzle");
      done();
    });
  });

  test("Solve a puzzle with incorrect length: POST request to /api/solve", done => {
    requester
    .post("/api/solve")
    .send({puzzle:"..839.7.575.....964..1......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1"})
    .end((err, res) => {
      assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
      done();
    });
  });

  test("Solve a puzzle that cannot be solved: POST request to /api/solve", done => {
    requester
    .post("/api/solve")
    .send({puzzle:"..9..5.1.85.4....2432..99..1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."})
    .end((err, res) => {
      assert.equal(res.body.error, "Puzzle cannot be solved");
      done();
    });
  });

  test("Check a puzzle placement with all fields: POST request to /api/check", done => {
    requester
    .post("/api/check")
    .send({
      puzzle:"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      coordinate: "B5",
      value: 7
    })
    .end((err, res) => {
      assert.isTrue(res.body.valid);
      done();
    });
  });

  test("Check a puzzle placement with single placement conflict: POST request to /api/check", done => {
    requester
    .post("/api/check")
    .send({
      puzzle:"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      coordinate: "B6",
      value: 2
    })
    .end((err, res) => {
      assert.isFalse(res.body.valid);
      assert.equal(res.body.conflict.length, 1);
      assert.equal(res.body.conflict[0], "row");
      done();
    });
  });

  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", done => {
    requester
    .post("/api/check")
    .send({
      puzzle:"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      coordinate: "A1",
      value: 8
    })
    .end((err, res) => {
      assert.isFalse(res.body.valid);
      assert.equal(res.body.conflict.length, 2);
      assert.equal(res.body.conflict[0], "column");
      assert.equal(res.body.conflict[1], "region");
      done();
    });
  });

  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", done => {
    requester
    .post("/api/check")
    .send({
      puzzle:"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      coordinate: "B6",
      value: 5
    })
    .end((err, res) => {
      assert.isFalse(res.body.valid);
      assert.equal(res.body.conflict.length, 3);
      assert.equal(res.body.conflict[0], "row");
      assert.equal(res.body.conflict[1], "column");
      assert.equal(res.body.conflict[2], "region");
      done();
    });
  });

  test("Check a puzzle placement with missing required fields: POST request to /api/check", done => {
    requester
    .post("/api/check")
    .send({
      puzzle:"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      coordinate: "B6"
    })
    .end((err, res) => {
      assert.equal(res.body.error, "Required field(s) missing");
      done();
    });
  });

  test("Check a puzzle placement with invalid characters: POST request to /api/check", done => {
    requester
    .post("/api/check")
    .send({
      puzzle:"..9..5.1.85.4....2432......1...69.83.9..z..6.62.71...9......1945....4.37.4.3..6..",
      coordinate: "Z10",
      value: 10
    })
    .end((err, res) => {
      assert.equal(res.body.error, "Invalid characters in puzzle");
      done();
    });
  });

  test("Check a puzzle placement with incorrect length: POST request to /api/check", done => {
    requester
    .post("/api/check")
    .send({
      puzzle:"..9..5.1.85.4....24321...69.83.9....6.62.71...9......1945....4.37.4.3..6..",
      coordinate: "B6",
      value: 5
    })
    .end((err, res) => {
      assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
      done();
    });
  });

  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", done => {
    requester
    .post("/api/check")
    .send({
      puzzle:"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      coordinate: "B10",
      value: 5
    })
    .end((err, res) => {
      assert.equal(res.body.error, "Invalid coordinate");
      done();
    });
  });

  test("Check a puzzle placement with invalid placement value: POST request to /api/check", done => {
    requester
    .post("/api/check")
    .send({
      puzzle:"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
      coordinate: "B6",
      value: 11
    })
    .end((err, res) => {
      console.log(res.body);
      assert.equal(res.body.error, "Invalid value");
      done();
    });
  });
});