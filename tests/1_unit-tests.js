const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {
  test("Logic handles a valid puzzle string of 81 characters", done => {
    assert.isTrue(solver.validate("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."));
    done();
  });

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", done => {
    var err1 = "Invalid characters in puzzle";
    assert.equal(solver.validate("1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37z"), err1);
    assert.equal(solver.validate("1.5..2.84..63.12.7.2..5.....9..1.a..8.2.3674.3.7.2..9.47...8..1..16....926914.37."), err1);
    done();
  });

  test("Logic handles a puzzle string that is not 81 characters in length", done => {
    assert.equal(solver.validate("1.5..2.84..63.12.7.2..5.....9..1.8.2.3674.3.7.2..9.47...8..1..16....926914.37"), "Expected puzzle to be 81 characters long");
    done();
  });

  test("Logic handles a valid row placement", done => {
    assert.isTrue(solver.checkRowPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",1,4,7));
    done();
  });

  test("Logic handles an invalid row placement", done => {
    assert.isFalse(solver.checkRowPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",1,2,5));
    done();
  });

  test("Logic handles a valid column placement", done => {
    assert.isTrue(solver.checkColPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",1,4,7));
    done();
  });

  test("Logic handles an invalid column placement", done => {
    assert.isFalse(solver.checkColPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",0,0,8));
    done();
  });

  test("Logic handles a valid region (3x3 grid) placement", done => {
    assert.isTrue(solver.checkRegionPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",1,4,7));
    done();
  });

  test("Logic handles an invalid region (3x3 grid) placement", done => {
    assert.isFalse(solver.checkRegionPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",0,1,8));
    done();
  });

  test("Valid puzzle strings pass the solver", done => {
    assert.isNotFalse(solver.solve("82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51"));
    done();
  });

  test("Invalid puzzle strings fail the solver", done => {
    assert.isFalse(solver.solve("..9..5.1.85.4....2432..99..1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."));
    done();
  });

  test("Solver returns the the expected solution for an incomplete puzzzle", done => {
    assert.equal(solver.solve(".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6"), "473891265851726394926345817568913472342687951197254638734162589685479123219538746");
    done();
  });
});
