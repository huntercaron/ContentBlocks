import React from "react";
import { render } from "react-dom";
import styled, { injectGlobal, ThemeProvider } from "styled-components";
import { TimelineMax, TweenLite } from 'gsap';
import 'intersection-observer'

import ContentBlock from '../components/ContentBlock'

const Container = styled.div`
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
  padding: 0 2rem;
`;

const SquareElement = styled.div`
  background-color: black;
  height: 30vmin;
  width: 30vmin;
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

class Square extends React.PureComponent {
  state = {
    progress: 0
  }

  lastProgress = 0;

  setupAnimation = () => {
    TweenLite.set(this.square, { rotation: 0, scale: 1, x: -window.innerWidth/2});

    this.tl = new TimelineMax({ paused: true });
    this.tl.to(this.square, 0.5, { x: 0, rotation: 180, scale: 2, ease: Power1.easeOut });


    this.animDuration = this.tl.totalDuration();
  }

  componentDidMount() {
    this.setupAnimation();
  }

  animateSquare = () => {
    let percent = this.animDuration / 100 * this.props.progress;
    let progressDiff = Math.abs(this.props.progress - this.lastProgress) * 0.01;

    this.tl.tweenTo(percent).duration(0.15 + 0.25 * progressDiff);
    this.lastProgress = this.props.progress;
  }

  componentDidUpdate() {
    requestAnimationFrame(this.animateSquare);
  }

  render() {
    return(
      <SquareElement innerRef={el => this.square = el}>
        {this.props.progress}
      </SquareElement>
    );
  }
}


class Block extends React.PureComponent {
  state = {
    progress: 0
  }

  handleActiveChange = (activeBlockState) => {
    this.setState({
      activeBlock: activeBlockState.index
    })
  }

  handleProgressChange = (progress, index) => {
    this.setState({
      progress
    })
  }

  render() {
    return(
      <BlockContainer progress index={0} handleActiveChange={this.handleActiveChange} handleProgressChange={this.handleProgressChange}>

        <StickyWrapper>
          <StickyLayer>
            <Square progress={this.state.progress} />
          </StickyLayer>
        </StickyWrapper>

      </BlockContainer>
    )
  }
}

export default class App extends React.Component {
  render() {
    return (
      <Container>
        <Header>
          <h3>Making some stuff with css sticky &amp; intersection observer</h3>
        </Header>        

        <Block />
        <Block />
        <Block />
        <Block />
        <Block />

        <h1>Hey</h1>
      </Container>
    );
  }
}