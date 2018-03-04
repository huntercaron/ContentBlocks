import React from "react";
import { render } from "react-dom";
import styled, { injectGlobal } from "styled-components";

const Container = styled.div`
	height: 300vh;
	width: 100%;
	background-color: pink;
`;

const ScrollSentinel = styled.div`
	height: 50vh;
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
  animateSquare = () => {

  }

  addObservers = () => {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          let progress = Math.floor(entry.intersectionRatio * 100);
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