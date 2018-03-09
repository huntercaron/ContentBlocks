import React from "react";
import { render } from "react-dom";
import styled, { injectGlobal, ThemeProvider } from "styled-components";
import { TimelineMax, TweenLite } from 'gsap';
import 'intersection-observer'

import ContentBlock from '../components/ContentBlock'

const Container = styled.div`
	height: 500vh;
	width: 100%;
	background-color: pink;

  h1 {
    position: fixed;
  }
`;

const Header = styled.div`
  height: 80vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// transition-size (vh)

// start-offset (+ margin-top) if it starts on page

const ScrollSentinel = styled.div`
	height: 50vh;
  margin-top: 50vh;
  position: sticky;
  top: 0;
	width: 10px;
  margin-left: 50%;
	border: 1px solid blue;
`;

const Square = styled.div`
  background-color: black;
  height: 200px;
  width: 200px;
  top: calc(50% - 100px);
  left: calc(50% - 100px);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`


const BlockContainer = styled(ContentBlock) `
  position: relative;
  height: 200vh;
  border: 1px solid black;

  p {
    transition: all 100ms ease-in-out;
    opacity: ${props => props.theme.active ? "1" : "0"};
    margin: auto;
    max-width: 90%;
    margin-bottom: 2rem;
  }
`

const BlockContent = styled.div`
  margin-top: 200px;
`;

const StickyWrapper = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
`

const StickyLayer = styled.div`
  height: 100vh;
  top: 0;
  position: sticky;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;

  h4 {
    text-align: center;
    width: 100%;
    padding: 10px;
  }
`;


function buildThresholdList(numSteps) {
  var thresholds = [0.0];

  for (var i = 1.0; i <= numSteps; i++) {
    var ratio = i / numSteps;
    thresholds.push(ratio);
  }
  thresholds.push(1.0);

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
          let progress = Math.floor(entry.intersectionRatio * 100);

          if (progress !== this.state.progress) {
            this.setState({
              progress
            });

            requestAnimationFrame(this.animateSquare);
          }
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

  handleActiveChange = (activeBlockState) => {
    this.setState({
      activeBlock: activeBlockState.index
    })
  }

  render() {
    return (
      <Container>
        <Header>
          <h3>Making some stuff with css sticky &amp; intersection observer</h3>
        </Header>        

        <BlockContainer index={0} handleActiveChange={this.handleActiveChange}>
          <StickyWrapper>
            <StickyLayer>
              <Square innerRef={el => this.square = el}>
                {this.state.progress}
              </Square>
            </StickyLayer>
          </StickyWrapper>

          <ScrollSentinel innerRef={el => this.scrollSentinel = el} />
        </BlockContainer>

        

        <h1>Hey</h1>
      </Container>
    );
  }
}