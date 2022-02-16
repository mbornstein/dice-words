import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import './index.css';
import {points, die} from './config.js';


const cols = 4;
const grid = 8;
const diceWidth = 48;

function startingPosition(index) {
  return {
    x: (index % cols) * (diceWidth + grid),
    y: parseInt(index / cols) * (diceWidth + grid)
  }
}

function Dice(props) {
  return (
    <div className="dice">
      {props.value}
      <sub>{points[props.value]}</sub>
    </div>
  )
}

function Menu(props) {
  return (
    <div className="menu">
      <div className="button" onClick={props.onStart}>
        <img className='icon' src='random.svg'></img>
      </div>
    </div>
  )
}

function Field(props) {
  return (
    <div className="field">
    </div>
  )
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roll: die.map(() => parseInt(Math.random() * 6)),
      positions: die.map((dice, index) => startingPosition(index)),
    }
  }

  handleRestart() {
    this.setState({
      roll: die.map(() => parseInt(Math.random() * 6)),
      positions: die.map((dice, index) => startingPosition(index)),
    });
  }

  handleStopDragging(diceIndex, event, coreData) {
    let x = coreData.lastX;
    let y = coreData.lastY;
    let positions = this.state.positions.slice();
    positions[diceIndex] = {x, y};
    this.setState({positions});
  }

  render() {
    return (
      <div className="game">
        <Menu onStart={() => this.handleRestart()}/>
        {/* <Field /> */}
        {die.map((d, i) => (
          <Draggable
            onStop={(event, coreData) => this.handleStopDragging(i, event, coreData)}
            key={i}
            grid={[grid, grid]}
            position={this.state.positions[i]}
          >
            <div><Dice value={d[this.state.roll[i]]}/></div>
          </Draggable>
        ))}
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
