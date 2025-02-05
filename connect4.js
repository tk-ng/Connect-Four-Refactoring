/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
	constructor(p1, p2, height, width) {
		if (p1.color === "" || p2.color === "") {
			alert("Empty color field(s)!");
			return;
		} else if (p1.color === p2.color) {
			alert("Players should have different colors!");
			return;
		}

		this.height = height;
		this.width = width;
		this.players = [p1, p2];
		this.currPlayer = p1;
		this.board = [];
		this.makeBoard();
		this.makeHtmlBoard();
		this.gameOver = false;
	}
	/** makeBoard: create in-JS board structure:
	 *   board = array of rows, each row is array of cells  (board[y][x])
	 */
	makeBoard() {
		for (let y = 0; y < this.height; y++) {
			this.board.push(Array.from({ length: this.width }));
		}
	}

	/** makeHtmlBoard: make HTML table and row of column tops. */

	makeHtmlBoard() {
		const board = document.getElementById("board");
		board.innerHTML = "";

		// make column tops (clickable area for adding a piece to that column)
		const top = document.createElement("tr");
		top.setAttribute("id", "column-top");
		top.addEventListener("click", this.handleClick.bind(this));

		for (let x = 0; x < this.width; x++) {
			const headCell = document.createElement("td");
			headCell.setAttribute("id", x);
			top.append(headCell);
		}

		board.append(top);

		// make main part of board
		for (let y = 0; y < this.height; y++) {
			const row = document.createElement("tr");

			for (let x = 0; x < this.width; x++) {
				const cell = document.createElement("td");
				cell.setAttribute("id", `${y}-${x}`);
				row.append(cell);
			}

			board.append(row);
		}
	}

	/** findSpotForCol: given column x, return top empty y (null if filled) */

	findSpotForCol(x) {
		for (let y = this.height - 1; y >= 0; y--) {
			if (!this.board[y][x]) {
				return y;
			}
		}
		return null;
	}

	/** placeInTable: update DOM to place piece into HTML table of board */
	placeInTable(y, x) {
		const piece = document.createElement("div");
		piece.classList.add("piece");
		// piece.classList.add(`p${this.currPlayer}`);
		piece.style.backgroundColor = this.currPlayer.color;
		piece.style.top = -50 * (y + 2); /**What is this for? */

		const spot = document.getElementById(`${y}-${x}`);
		spot.append(piece);
	}

	/** endGame: announce game end */
	endGame(msg) {
		this.gameOver = true;
		alert(msg);
	}

	/** handleClick: handle click of column top to play piece */
	handleClick(evt) {
		if (this.gameOver === true) return;
		// get x from ID of clicked cell
		const x = +evt.target.id;

		// get next spot in column (if none, ignore click)
		const y = this.findSpotForCol(x);
		if (y === null) {
			return;
		}

		// place piece in board and add to HTML table
		this.board[y][x] = this.currPlayer;
		this.placeInTable(y, x);

		// check for win
		if (this.checkForWin()) {
			console.log(this.currPlayer);
			return this.endGame(`The ${this.currPlayer.color} player won!`);
		}

		// check for tie
		if (this.board.every((row) => row.every((cell) => cell))) {
			return this.endGame("Tie!");
		}

		// switch players
		this.currPlayer =
			this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
	}

	/** checkForWin: check board cell-by-cell for "does a win start here?" */
	checkForWin() {
		const _win = (cells) => {
			// Check four cells to see if they're all color of current player
			//  - cells: list of four (y, x) cells
			//  - returns true if all are legal coordinates & all match currPlayer

			return cells.every(
				([y, x]) =>
					y >= 0 &&
					y < this.height &&
					x >= 0 &&
					x < this.width &&
					this.board[y][x] === this.currPlayer
			);
		};

		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				// get "check list" of 4 cells (starting here) for each of the different
				// ways to win
				const horiz = [
					[y, x],
					[y, x + 1],
					[y, x + 2],
					[y, x + 3],
				];
				const vert = [
					[y, x],
					[y + 1, x],
					[y + 2, x],
					[y + 3, x],
				];
				const diagDR = [
					[y, x],
					[y + 1, x + 1],
					[y + 2, x + 2],
					[y + 3, x + 3],
				];
				const diagDL = [
					[y, x],
					[y + 1, x - 1],
					[y + 2, x - 2],
					[y + 3, x - 3],
				];

				// find winner (only checking each win-possibility as needed)
				if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
					return true;
				}
			}
		}
	}
}

class Player {
	constructor(color) {
		this.color = color;
	}
}

document.querySelector("button").addEventListener("click", function () {
	p1Input = document.getElementById("player-1");
	p2Input = document.getElementById("player-2");
	const p1 = new Player(p1Input.value);
	const p2 = new Player(p2Input.value);
	new Game(p1, p2, 6, 7);
});
