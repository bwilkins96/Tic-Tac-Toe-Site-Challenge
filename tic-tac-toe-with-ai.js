// Your code here
import ComputerPlayer from "./computer-player-advanced.js";

class Board {
    constructor(board, turns) {
        this.board = board ||
                     [ [null, null, null],
                       [null, null, null],
                       [null, null, null] ];
        this.turns = turns || 0;
    }

    takeTurn(row, col) {
        if (row < 0 || col > 2) {return}
        if (this.board[row][col]) {return}

        let current;
        if (this.turns % 2 === 0) {current = "X"}
        else {current = "O"}
        this.turns++;

        this.board[row][col] = current;
        return current;
    }

    checkWin() {
        for (let i = 0; i < this.board.length; i++) {
            let row = this.board[i];
            if (row[0] === row[1] && row[1] === row[2] && row[0]) {return row[0]}
        }

        for (let i = 0; i < this.board.length; i++) {
            let row1 = this.board[0]; let row2 = this.board[1]; let row3 = this.board[2];
            if (row1[i] === row2[i] && row2[i] === row3[i] && row1[i]) {return row1[i]}
        }

        let brd = this.board;
        if (brd[0][0] === brd[1][1] && brd[1][1] === brd[2][2] && brd[0][0]) {return brd[0][0]}
        if (brd[0][2] === brd[1][1] && brd[1][1] === brd[2][0] && brd[2][0]) {return brd[0][2]}

        if (this.turns >= 9) {return "tie"}
    }
}

const getXImg = () => {
    let xImg = document.createElement("img");
    xImg.setAttribute("class", "x");
    xImg.setAttribute("src", "./xImg.png");
    return xImg;
}

const getOImg = () => {
    let oImg = document.createElement("img");
    oImg.setAttribute("class", "o");
    oImg.setAttribute("src", "./oImg.png")
    return oImg;
}

window.addEventListener("DOMContentLoaded", event => {
    const newGame = document.getElementById("new");
    const giveUp = document.getElementById("giveUp");
    const htmlBoard = document.getElementById("board");
    let visited = new Set();

    let game; let savedBoard = localStorage.getItem("board");
    if (savedBoard) {
        let savedTurns = localStorage.getItem("turns");
        game = new Board(JSON.parse(savedBoard), JSON.parse(savedTurns));
        restoreBoard();
    }
    else {game = new Board()}

    function saveGame() {
        localStorage.setItem("board", JSON.stringify(game.board));
        localStorage.setItem("turns", JSON.stringify(game.turns));
    }

    function restoreBoard() {
        game.board.forEach((row, ri) => {
            row.forEach((ele, ci) => {
                if (ele === "X" || ele === "O") {
                    let current = document.getElementById(`${ri},${ci}`);
                    visited.add(`${ri},${ci}`);
                    if (ele === "X") {current.appendChild(getXImg())}
                    else {current.appendChild(getOImg())}
                }
            })
        })

        let winner = game.checkWin();
        if (winner) {handleWin(winner)}
    }

    function handleClick(event) {
        let current = event.target.id
        if (current === "board" || !current || visited.has(current)) {return};
        let row = Number(current[0]);
        let col = Number(current[2]);

        let target = event.target;
        let win = handleMove(row, col, target);

        if (!win) {
            htmlBoard.removeEventListener("click", handleClick);
            setTimeout(getComputerMove, 250);
        }
    }

    function handleMove(row, col, target) {
        let move = game.takeTurn(row, col);
        if (!move) {return}
        if (move === "X") { target.appendChild(getXImg()) }
        else { target.appendChild(getOImg()) }

        visited.add(`${row},${col}`);

        let winner = game.checkWin();
        if (winner) {handleWin(winner); return true}
        saveGame();

        return winner;
    }

    function handleWin(winner) {
        let message = document.querySelector("h1");

        if (winner === "tie") {
            message.innerText = "Tie Game!";
        } else {
            message.innerText = `Winner: ${winner}`;
        }

        message.classList.remove("hide");
        giveUp.removeEventListener("click", handleSurrender);
        giveUp.classList.add("disabled");
        htmlBoard.removeEventListener("click", handleClick);
        newGame.addEventListener("click", handleNewGame);
        newGame.classList.remove("disabled");
        saveGame();
    }

    function handleNewGame(event) {
        game = new Board();
        visited = new Set();

        let xsAndOs = document.querySelectorAll("img");
        xsAndOs.forEach(img => {
            img.remove();
        });

        document.querySelector("h1").classList.add("hide");
        newGame.removeEventListener("click", handleNewGame);
        newGame.classList.add("disabled");
        giveUp.addEventListener("click", handleSurrender);
        giveUp.classList.remove("disabled");
        htmlBoard.addEventListener("click", handleClick);
        saveGame();
    }

    function handleSurrender(event) {
        let winner;
        if (game.turns % 2 === 0) {winner = "O"}
        else {winner = "X"}

        handleWin(winner);
    }

    htmlBoard.addEventListener("click", handleClick);
    giveUp.addEventListener("click", handleSurrender);

    function getComputerMove() {
        let symbol;
        if (game.turns % 2 === 0) {symbol = "X"}
        else {symbol = "O"}

        let smartMove = ComputerPlayer.getSmartMove(game.board, symbol);
        let row = smartMove.row; let col = smartMove.col;
        let target = document.getElementById(`${row},${col}`);

        let move = handleMove(row, col, target);
        if (!move) {htmlBoard.addEventListener("click", handleClick)};
    }
})
