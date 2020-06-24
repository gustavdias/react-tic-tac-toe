import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

//Square
//passing some data from our Board component to our Square component
//the Square components are now controlled components. The Board has full control over them.

//class Square extends React.Component {
// constructor(props) {
//   super(props);
//   this.state = {
//     value: null,
//   };
// }
//render() {

function Square(props) {
  return (
    <button
      className="square"
      // onClick={() => {
      //   this.props.onClick();
      //   // By calling this.setState from an onClick handler in the Square’s render method, we tell React to re-render that Square whenever its <button> is clicked.
      // }}
      onClick={props.onClick}
    >
      {/* Forgetting () => and writing onClick={alert('click')} is a common mistake, and would fire the alert every time the component re-renders. */}
      {/* {this.props.value} */}
      {props.value}
    </button>
  );
}
//} closing render()

//Board__________________________________________________________________________
//passing some data from our Board component to our Square component

//Placing the history state into the Game component lets us remove the squares state from its child Board component. Just like we “lifted state up” from the Square component into the Board component, we are now lifting it up from the Board into the top-level Game component. This gives the Game component full control over the Board’s data, and lets it instruct the Board to render previous turns from the history.
class Board extends React.Component {
  //   constructor(props) {
  //     super(props);
  //     this.state = {
  //       squares: Array(9).fill(null),
  //       // We’ll set the first move to be “X” by default. We can set this default by modifying the initial state in our Board constructor:
  //       xIsNext: true,
  //     };
  //   }
  //the state is stored in the Board component instead of the individual Square components.
  // handleClick(i) {
  //!!! move the handleClick method from the Board component to the Game component.
  //   const squares = this.state.squares.slice();
  //   //.slice() to create a copy of the squares array to modify instead of modifying the existing array.

  //   //return early by ignoring a click if someone has won the game or if a Square is already filled
  //   if (calculateWinner(squares) || squares[i]) {
  //     return;
  //   }
  //   //each time a player moves, xIsNext (a boolean) will be flipped to determine which player goes next and the game’s state will be saved. We’ll update the Board’s handleClick function to flip the value of xIsNext:
  //   squares[i] = this.state.xIsNext ? "X" : "O";
  //   this.setState({ squares: squares, xIsNext: !this.state.xIsNext });
  // }

  renderSquare(i) {
    return (
      <Square
        // value={this.state.squares[i]}
        // onClick={() => this.handleClick(i)}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    //Since the Game component is now rendering the game’s status, we can remove the corresponding code from the Board’s render method. After refactoring, the Board’s render function looks like this:
    // //We will call calculateWinner(squares) in the Board’s render function to check if a player has won.
    // const winner = calculateWinner(this.state.squares);
    // let status;
    // if (winner) {
    //   status = "Winner: " + winner;
    // } else {
    //   //Let’s also change the “status” text in Board’s render so that it displays which player has the next turn:
    //   status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    // }

    return (
      <div>
        {/* <div className="status">{status}</div> */}
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

//Game________________________________________________________________________________-
class Game extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null),
  //   };
  // }
  // renderSquare(i) {
  //   return <Square value={this.state.squares[i]} />;
  // }
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  //-----------
  //define the jumpTo method in Game to update that stepNumber. We also set xIsNext to true if the number that we’re changing stepNumber to is even:
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }


  //-------

  render() {
    //update the Game component’s render function to use the most recent history entry to determine and display the game’s status:
    const history = this.state.history;
    // const current = history[history.length - 1];
    //modify the Game component’s render method from always rendering the last move to rendering the currently selected move according to stepNumber:
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    //map over the history in the Game’s render method:
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    //--------------------------
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
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />{" "}
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

// /Declaring a Winner
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
