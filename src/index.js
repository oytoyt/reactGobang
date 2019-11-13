import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 自定义长度方便到时候修改
const len = 3;

function Square(props) {
  // 判断是否高亮
  return props.mark ? (
    <button className="square" onClick={props.onClick}>
      <mark>{props.value}</mark>
    </button>
  ) : (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    const winner = calculateWinner(this.props.squares, true);
    let flag;
    // 判断是否分出胜负。
    // 判断是否为符合胜利数组
    if(winner) flag = winner.indexOf(i) == -1 ? false : true;
    // 将值传给`Square`
    return flag ? (
      // 添加key值
      <Square
        key={i}
        mark={true}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    ) : (
      // 添加key值
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  // 封装函数，接受第二个循环的参数
  row(i) {
    // 第一个循环
    return Array(len).fill(null).map((item, index) => {
      return this.renderSquare((i * len) + index);
    });
  }

  render() {
    // 这里先提升到代码头部， 因为row函数也要用到
    // const len = 3;
    // 第二个循环。并且加上key。
    const boardRow = Array(len).fill(null).map((item, index) => {
      return (
        <div key={index} className="board-row">
          {this.row(index)}
        </div>
      );
    });

    return (
      <div>{boardRow}</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      // 是否降序
      isReverse: false
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
          // 方法一
          // activeIndex: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  reverse() {
    this.setState({isReverse: !this.state.isReverse});
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let desc = move ?
        'Go to move #' + move :
        'Go to game start';

      // 方法一
      // if(move) desc += getPos(step.activeIndex);

      // 方法二
      if(move) {
        const index = getDiff(history[move].squares, history[move - 1].squares);
        desc += getPos(index);
      }

      // 判断步骤
      return this.state.stepNumber == move ? (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
        </li>
      ) : (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    // 判断状态是否降序
    if(this.state.isReverse) moves.reverse();

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
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.reverse()}>升序/倒序</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

// flag为true时，返回符合的数组
function calculateWinner(squares, flag) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // 判断需要返回什么
      return flag ? lines[i] : squares[a];
    }
  }
  return null;
}

// 通过下标获取x，y
function getPos(index) {
  const row = 3;
  const x = index % row + 1;
  const y = Math.floor(index / row) + 1;
  return `(${y}, ${x})`;
}

// 获取不同的下标
function getDiff(arr, arr2) {
  let _index;
  arr.map((item, index) => {
    const a = JSON.stringify(item),
      b = JSON.stringify(arr2[index]);
    if(a != b) _index = index;
  });
  return _index;
}
