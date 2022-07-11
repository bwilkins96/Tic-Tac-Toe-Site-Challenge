//from previous practice!

export default class ComputerPlayer {

  static getValidMoves(grid) {
    const validMoves = [];

    grid.forEach( (row, ri) => {
      row.forEach( (col, ci) => {

        if (col === null) {
          let move = { row: ri, col: ci }
          validMoves.push(move);
        }
      });
    });

    return validMoves;
  }

//extra

  static getValidMiddles(grid) {
    const validMoves = [];

    if (grid[0][1] === null) {validMoves.push({ row: 0, col: 1 })}
    if (grid[1][0] === null) {validMoves.push({ row: 1, col: 0 })}
    if (grid[1][2] === null) {validMoves.push({ row: 1, col: 2 })}
    if (grid[2][1] === null) {validMoves.push({ row: 2, col: 1 })}

    return validMoves;
  }

  static getValidCorners(grid) {
    const validMoves = [];
    const oCorner = ComputerPlayer.getOCorner(grid);

    if (oCorner) {
      if (oCorner.row === 0 && oCorner.col === 0) {
        if (grid[0][2] === null ) {validMoves.push({ row: 0, col: 2 })}
        if (grid[2][0] === null) {validMoves.push({ row: 2, col: 0 })}
      } else if (oCorner.row === 0 && oCorner.col === 2) {
        if (grid[0][0] === null ) {validMoves.push({ row: 0, col: 0 })}
        if (grid[2][2] === null) {validMoves.push({ row: 2, col: 2 })}
      } else if (oCorner.row === 2 && oCorner.col === 0) {
        if (grid[0][0] === null ) {validMoves.push({ row: 0, col: 0 })}
        if (grid[2][2] === null) {validMoves.push({ row: 2, col: 2 })}
      } else if (oCorner.row === 2 && oCorner.col === 2) {
        if (grid[2][0] === null ) {validMoves.push({ row: 2, col: 0 })}
        if (grid[0][2] === null) {validMoves.push({ row: 0, col: 2 })}
      }


    } else {

    if (grid[0][0] === null) {validMoves.push({ row: 0, col: 0 })}
    if (grid[0][2] === null) {validMoves.push({ row: 0, col: 2 })}
    if (grid[2][0] === null) {validMoves.push({ row: 2, col: 0 })}
    if (grid[2][2] === null) {validMoves.push({ row: 2, col: 2 })}
    }

    return validMoves;
  }

  static getOCorner(grid) {
    let oCornerCount = ComputerPlayer.oCornerCount(grid);
    if (oCornerCount !== 1) {return false}

    if (grid[0][0] === "O") {return { row: 0, col: 0 }}
    if (grid[0][2] === "O") {return { row: 0, col: 2 }}
    if (grid[2][0] === "O") {return { row: 2, col: 0 }}
    if (grid[2][2] === "O") {return { row: 2, col: 2 }}

    return false;
  }

  static oCornerCount(grid) {
    let oCount = 0;

    if (grid[0][0] === "O") {oCount++}
    if (grid[0][2] === "O") {oCount++}
    if (grid[2][0] === "O") {oCount++}
    if (grid[2][2] === "O") {oCount++}

    return oCount;
  }

  static cornerTrick(grid) {
    if ((grid[0][0] === "X" && grid[2][2] === "X") || (grid[0][2] === "X" && grid[2][0] === "X")) {console.log("caught you! :)"); return true}
    else {return false}
  }

  static middleTrick(grid) {
    if (grid[1][1] === "X" && ComputerPlayer.getValidCorners(grid).length > 0) {console.log("caught you! :)"); return true}
    else {return false}
  }

//

  static randomMove(grid) {
    let validMoves;
    if (ComputerPlayer.cornerTrick(grid)) {validMoves = ComputerPlayer.getValidMiddles(grid)}
    else if(ComputerPlayer.middleTrick(grid)) {validMoves = ComputerPlayer.getValidCorners(grid)}
    else {validMoves = ComputerPlayer.getValidMoves(grid)}

    if (grid[1][1] === null) {return {row: 1, col:1}}

    let randomIdx = Math.floor(Math.random() * validMoves.length)

    let randomMove = validMoves[randomIdx];

    return randomMove;
  }

  static getWinningMoves(grid, symbol) {

    const winningMoves = [];

    let rows = ComputerPlayer.winningRows(grid);
    winningMoves.push(...rows)

    let cols = ComputerPlayer.winningCols(grid);
    winningMoves.push(...cols);

    let horizontals = ComputerPlayer.winningHorizontals(grid);
    winningMoves.push(...horizontals);

    return winningMoves;
  }


  static winningRows(grid) {
    let xCount = 0; let oCount = 0; let emptyCount = 0;
    const wins = [];

    for (let i1 = 0; i1 < 3; i1++) {
      let row = grid[i1];
      let move;

      for (let i2 = 0; i2 < 3; i2++) {
        if (row[i2] === 'X') {xCount++}
        else if (row[i2] === null) {emptyCount++; move = { row: i1, col: i2 }}
        else if(row[i2] === 'O') {oCount++}
      }

      if (xCount === 2 && emptyCount === 1) {
        move.symbol = "X";
        wins.push(move);
      }
      else if (oCount === 2 && emptyCount === 1) {
        move.symbol = "O";
        wins.push(move);
      }

      xCount = 0; oCount = 0; emptyCount = 0;
    }

    return wins;
  }


  static winningCols(grid) {
    let xCount = 0; let oCount = 0; let emptyCount = 0;
    const wins = [];

    for (let i1 = 0; i1 < 3; i1++) {
      let move;

      for (let i2 = 0; i2 < 3; i2++) {
        if (grid[i2][i1] === 'X') {xCount++}
        else if(grid[i2][i1] === null) {emptyCount++; move = { row: i2, col: i1 }}
        else if(grid[i2][i1] === 'O') {oCount++}
      }

      if (xCount === 2 && emptyCount === 1) {
        move.symbol = "X";
        wins.push(move);
      }
      else if (oCount === 2 && emptyCount === 1) {
        move.symbol = "O";
        wins.push(move);
      }

      xCount = 0; oCount = 0; emptyCount = 0;
    }

    return wins;
  }


  static winningHorizontals(grid) {
    let xCount = 0; let oCount = 0; let emptyCount = 0;
    const wins = [];
    let move;

    for (let i = 0; i < 3; i++) {
      if (grid[i][i] === "X") {xCount++}
      else if (grid[i][i] === "O") {oCount++}
      else if (grid[i][i] === null) {emptyCount++, move = {row: i, col: i}}
    }

    if (xCount === 2 && emptyCount === 1) {
      move.symbol = "X";
      wins.push(move);
    }
    else if (oCount === 2 && emptyCount === 1) {
      move.symbol = "O";
      wins.push(move);
    }

    xCount = 0; oCount = 0; emptyCount = 0;

    if (grid[2][0] === 'X') {xCount++}
    else if (grid[2][0] === 'O' ) {oCount++}
    else if (grid[2][0] === null) {emptyCount++, move = {row: 2, col: 0}}

    if (grid[1][1] === 'X') {xCount++}
    else if (grid[1][1] === 'O' ) {oCount++}
    else if (grid[1][1] === null) {emptyCount++, move = {row: 1, col: 1}}

    if (grid[0][2] === 'X') {xCount++}
    else if (grid[0][2] === 'O' ) {oCount++}
    else if (grid[0][2] === null) {emptyCount++, move = {row: 0, col: 2}}

    if (xCount === 2 && emptyCount === 1) {
      move.symbol = "X";
      wins.push(move);
    }
    else if (oCount === 2 && emptyCount === 1) {
      move.symbol = "O";
      wins.push(move);
    }

    return wins;
  }


  static getSmartMove(grid, symbol) {
    const smartMoves = ComputerPlayer.getWinningMoves(grid);
    if (smartMoves.length === 0) {return ComputerPlayer.randomMove(grid)}

    const winningXMoves = []; const winningOMoves = [];
    smartMoves.forEach( move => {
      if (move.symbol === "X") {winningXMoves.push(move)}
      else if (move.symbol === "O") {winningOMoves.push(move)}
    })

    let randomIdx; let smartMove;
    if ((symbol === 'X' && winningXMoves.length >= 1) || winningOMoves.length === 0) {
      randomIdx = Math.floor(Math.random() * winningXMoves.length);
      smartMove = winningXMoves[randomIdx];
    } else if ((symbol === "O" && winningOMoves.length >= 1) || winningXMoves.length === 0) {
      randomIdx = Math.floor(Math.random() * winningOMoves.length);
      smartMove = winningOMoves[randomIdx];
    }

    return smartMove;
  }


}

//module.exports = ComputerPlayer;
