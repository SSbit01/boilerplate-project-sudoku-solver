class SudokuSolver {
  validate(puzzleString) {
    if (/[^.1-9]/.test(puzzleString)) {
      return "Invalid characters in puzzle";
    } else if (puzzleString.length!=81) {
      return "Expected puzzle to be 81 characters long";
    } 
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let r = row*9;
    return puzzleString.slice(r,r+9).includes(value)?false:true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i=0; i<9; i++) {
      if (puzzleString[i*9+column].includes(value)) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    for (let i=0; i<9; i++) {
      let r = 3*parseInt(row/3)+parseInt(i/3);
      let c = 3*parseInt(column/3) + i%3;
      if (puzzleString[r*9+c].includes(value)) {
        return false;
      }
    }
    return true;
  }

  solve(puzzleString) {
    for (let i in puzzleString) {
      if (puzzleString[i] == ".") {
        let column = i % 9;
        let row = (i-column) / 9;
        let arr = [...puzzleString];
        for (let j=1; j<=9; j++) {
          if (this.checkRowPlacement(puzzleString,row,column,j) && this.checkColPlacement(puzzleString,row,column,j) && this.checkRegionPlacement(puzzleString,row,column,j)) {
            arr[i] = j.toString();
            let result = this.solve(arr.join(""));
            if (result) {
              return result;
            } 
          }
        }
        return false;
      }
    }
    return puzzleString;
  }
}

module.exports = SudokuSolver;