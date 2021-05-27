import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            moveHistory: [
                {
                    squares: Array(9).fill(null),
                },
            ],
            xIsNext: true,
        };
    }

    handleClick(i) {
        // i is the index of the square clicked (ranges from 0 - 8)
        const moveHistory = this.state.moveHistory.slice();
        const currentMove = moveHistory[moveHistory.length - 1];
        if (calculateWinner(currentMove.squares) || currentMove.squares[i]) {
            return; // gameover or this square is filled, so skip handling
        }
        const newSquares = currentMove.squares.slice();
        newSquares[i] = this.state.xIsNext ? "X" : "O";
        const newMove = {
            squares: newSquares,
        };
        const newMoveHistory = moveHistory.concat(newMove);
        this.setState((prevState) => ({
            moveHistory: newMoveHistory,
            xIsNext: !prevState.xIsNext,
        }));
    }

    jumpTo(moveNumber) {
        this.setState((prevState) => ({
            moveHistory: prevState.moveHistory.slice(0, moveNumber + 1), // delete the portion of moveHistory after step
            xIsNext: moveNumber % 2 === 0,
        }));
    }

    moveNumber() {
        return this.state.moveHistory.length - 1;
    }

    render() {
        const moveHistory = this.state.moveHistory;
        const moveHistoryButtonList = moveHistory.map((move, moveNumber) => {
            const moveDescription = moveNumber
                ? "Go to move #" + moveNumber
                : "Go to game start";
            return (
                <li key={moveNumber}>
                    <button
                        className="past-move"
                        onClick={() => this.jumpTo(moveNumber)}
                    >
                        {moveDescription}
                    </button>
                </li>
            );
        });

        const currentMove = moveHistory[moveHistory.length - 1];
        const winner = calculateWinner(currentMove.squares);
        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={currentMove.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div className="status">{status}</div>
                    <div className="status">
                        Current move #: {this.moveNumber()}
                    </div>
                    <ol>{moveHistoryButtonList}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return squares[a];
        }
    }
    if (boardFull(squares)) {
        return "Draw";
    }
    return null;
}

function boardFull(squares) {
    for (let i = 0; i < squares.length; ++i) {
        if (!squares[i]) {
            return false;
        }
    }
    return true;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

// Things I can add to the game:

// Display the location for each move in the format (col, row) in the move moveHistory list.
// Bold the currently selected item in the move list.
// Rewrite Board to use two loops to make the squares instead of hardcoding them.
// Add a toggle button that lets you sort the moves in either ascending or descending order.
// When someone wins, highlight the three squares that caused the win.
// When no one wins, display a message about the result being a draw.
