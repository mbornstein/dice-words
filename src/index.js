import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import './index.css';
import { points, die } from './config.js';
import { withinRange, argmax, connectedComponents } from './utils.js';


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
  const point = points[props.value];
  return (
    <div className="dice">
      {props.value}
      <sub>{point > 0 ? point : ''}</sub>
    </div>
  )
}

class Timer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      time: '00:00',
    }
  }
    
  componentDidMount() {
    this.intervalID = setInterval(() =>
      this.updateClock(),
      1000
    );
  }
    
  componentWillUnmount(){
    clearInterval(this.intervalID);
  }
    
    //This function set the state of the time to a new time
  updateClock(){
    this.setState({
      time: this.displayTime(Date.now() - this.props.startTime)
    });
  }

  displayTime(ms) {
    let s = parseInt(ms / 1000);
    const pad = (t) => t < 10 ? `0${t}` : `${t}`;
    let mins = parseInt(s / 60);
    let secs = s % 60;
    return `${pad(mins)}:${pad(secs)}`;
  }
  
  render() {
    return (
      <div className="time">{this.state.time}</div>
    );
  }
}

function Menu(props) {
  return (
    <div className="menu">
      <div className="button" onClick={props.onStart}>
        <img className='icon' src={`${process.env.PUBLIC_URL}/random.svg`}></img>
      </div>
      <Timer startTime={props.startTime}/>
      <div className="score">{props.score}</div>
    </div>
  )
}

function touchVertical(dicePosition1, dicePosition2) {
  return withinRange(dicePosition1.y, dicePosition2.y) && withinRange(dicePosition1.x, dicePosition2.x, diceWidth);
}
function touchHorizontal(dicePosition1, dicePosition2) {
  return withinRange(dicePosition1.x, dicePosition2.x) && withinRange(dicePosition1.y, dicePosition2.y, diceWidth);
}
function areNeighbors(dicePosition1, dicePosition2) {
  return touchHorizontal(dicePosition1, dicePosition2) || touchVertical(dicePosition1, dicePosition2);
}

function connectedDices(positions) {
  let components = [];
  components = connectedComponents(
    positions.map((e, index) => index),
    (index1, index2) => areNeighbors(positions[index1], positions[index2])
  );
  return components.filter(comp => comp.length > 1);
}

function wordsInComponent(component, positions) {
  let horizontalWords = connectedComponents(component, (diceIndex1, diceIndex2) =>
    touchHorizontal(positions[diceIndex1], positions[diceIndex2])
  );
  let verticalWords = connectedComponents(component, (diceIndex1, diceIndex2) =>
    touchVertical(positions[diceIndex1], positions[diceIndex2])
  );
  return horizontalWords.concat(verticalWords).filter(word => word.length > 1);
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roll: die.map(() => parseInt(Math.random() * 6)),
      positions: die.map((dice, index) => startingPosition(index)),
      startTime: Date.now(),
      score: 0,
    }
  }

  handleRestart() {
    this.setState({
      roll: die.map(() => parseInt(Math.random() * 6)),
      positions: die.map((dice, index) => startingPosition(index)),
      startTime: Date.now(),
      score: 0,
    });
  }

  calculateScore(positions, roll) {
    let components = connectedDices(positions);
    if (components.length >= 1) {
      let biggestComponent = components[argmax(components.map(e => e.length))];
      let words = wordsInComponent(biggestComponent, positions);
      return words.flat().map(diceIndex => points[die[diceIndex][roll[diceIndex]]]).reduce((a, b) => a + b, 0)
    }
    return 0;
  }

  handleStopDragging(diceIndex, event, coreData) {
    let x = coreData.lastX;
    let y = coreData.lastY;
    let positions = this.state.positions.slice();
    positions[diceIndex] = {x, y};
    let score = this.calculateScore(positions, this.state.roll);
    this.setState({positions, score});
  }

  render() {
    return (
      <div className="game">
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
        <Menu
          onStart={() => this.handleRestart()}
          startTime={this.state.startTime}
          score={this.state.score}
        />
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
