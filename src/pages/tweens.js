import React from "react";
import { render } from "react-dom";
import styled, { injectGlobal } from "styled-components";
import { TimelineMax, TweenLite } from 'gsap';
import 'intersection-observer'

const Container = styled.div`
	height: 300vh;
	width: 100%;
	background-color: pink;
`;

const ScrollSentinel = styled.div`
	height: 80vh;
	position: absolute;
	width: 10px;
  margin-left: 50%;
	border: 1px solid blue;
`;

const Square = styled.div`
  background-color: black;
  height: 200px;
  width: 200px;
  position: sticky;
  top: calc(50% - 100px);
  left: calc(50% - 100px);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`

function buildThresholdList(numSteps) {
  var thresholds = [];

  for (var i = 1.0; i <= numSteps; i++) {
    var ratio = i / numSteps;
    thresholds.push(ratio);
  }

  return thresholds;
}

export default class App extends React.Component {
  state = {
    progress: 0
  }

  lastProgress = 0;


  setupAnimation = () => {
    this.tl = new TimelineMax();
    this.tl.to(this.square, 0.5, { rotation: 180, scale: 2, ease: Power1.easeOut });

    this.animDuration = this.tl.totalDuration();
  }


  animateSquare = () => {
    let percent = this.animDuration / 100 * this.state.progress;
    let progressDiff = Math.abs(this.state.progress - this.lastProgress)*0.01;

    this.tl.tweenTo(percent).duration(0.15+0.25*progressDiff);
    this.lastProgress = this.state.progress;    
  }

  addObservers = () => {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          let progress = 100-Math.floor(entry.intersectionRatio * 100);
          this.setState({
            progress
          });

          requestAnimationFrame(this.animateSquare);
        });
      },
      { threshold: buildThresholdList(20), rootMargin: 0 + "px", root: null }
    );

    observer.observe(this.scrollSentinel);
  };

  componentDidMount() {
    this.setupAnimation();
    this.addObservers();
  }

  render() {
    return (
      <Container>
        <ScrollSentinel innerRef={el => this.scrollSentinel = el} />
        <Square innerRef={el => this.square = el}>
          {this.state.progress}
        </Square>
        <h1>Hey</h1>
      </Container>
    );
  }
}