import React from "react";
import { render } from "react-dom";
import styled, { injectGlobal } from "styled-components";
import { TimelineMax, TweenLite } from 'gsap';

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


  animateSquare = () => {
    TweenMax.to(this.square, 0.4, {
      rotation: this.state.progress*2,
      //ease: Elastic.easeOut.config(1, 0.3)
      ease: Power4.easeOut
    });
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
      { threshold: buildThresholdList(100), rootMargin: 0 + "px", root: null }
    );

    observer.observe(this.scrollSentinel);
  };

  componentDidMount() {
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