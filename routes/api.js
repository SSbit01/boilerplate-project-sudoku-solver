'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');



module.exports = function (app) {
  let solver = new SudokuSolver();


  app.route('/api/check')
    .post((req, res) => {
      const rb = req.body;
      const valid = solver.validate(rb.puzzle);
      if (valid !== true) {
        res.json({error:valid});
      } else if ([rb.puzzle,rb.coordinate,rb.value].includes(undefined)) {
        res.json({error:"Required field(s) missing"});
      } else if (rb.coordinate.length!=2 || !/[1-9]/.test(rb.coordinate[1]) || !/[a-i]/i.test(rb.coordinate[0])) {
        res.json({error:"Invalid coordinate"});
      } else if (!/[1-9]/.test(rb.value) || `${rb.value}`.length!=1) {
        res.json({error:"Invalid value"});
      } else {
        let row = rb.coordinate[0].toUpperCase().charCodeAt(0) - 65;
        let column = parseInt(rb.coordinate[1])-1;
        let value = parseInt(rb.value);
        let check = {
          row: solver.checkRowPlacement(rb.puzzle,row,column,value),
          column: solver.checkColPlacement(rb.puzzle,row,column,value),
          region: solver.checkRegionPlacement(rb.puzzle,row,column,value)
        }
        let conflict = [];
        for (let i in check) {
          if (!check[i]) {
            conflict.push(i);
          }
        }
        res.json((conflict.length==0)?{valid:true}:{valid:false,conflict:conflict});
      }
    });
    

  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      const valid = solver.validate(puzzle);
      if (puzzle === undefined) {
        res.json({error:"Required field missing"});
      } else if (valid !== true) {
        res.json({error:valid});
      } else {
        let result = solver.solve(puzzle);
        res.json(result?{solution:result}:{error:"Puzzle cannot be solved"});
      }
    });
};
