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
      startTime: Date.now(),
    }
  }

  handleRestart() {
    this.setState({
      roll: die.map(() => parseInt(Math.random() * 6)),
      positions: die.map((dice, index) => startingPosition(index)),
      startTime: Date.now(),
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
