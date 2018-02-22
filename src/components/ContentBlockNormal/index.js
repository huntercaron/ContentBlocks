import React from 'react'
import styled from 'styled-components'
import 'intersection-observer'

const Container = styled.div`
  position: relative;
`;

const StickyDetector = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  /* visibility: hidden; */
  border: 1px solid pink;
`

const TopStickyDetector = StickyDetector.extend`
  height: 40px;
  top: -40px;
`;

const BottomStickyDetector = StickyDetector.extend`
  height: 80px;
  bottom: 0;
`;

export default class ContentBlock extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      index: 0 || props.index
    };
  }

  handleActiveChange = (active) => {
    this.setState({
      active
    })

    if (active) { 
      this.props.handleActiveChange(this.state.index) 
    }   
  }

  observeHeader = () => {
    const observer = new IntersectionObserver((records, observer) => {
      for (const record of records) {
        const targetInfo = record.boundingClientRect;
        const rootBoundsInfo = record.rootBounds;

        // Started sticking.
        if (targetInfo.bottom < rootBoundsInfo.top) {
          this.handleActiveChange(true)
        }

        // Stopped sticking.
        if (targetInfo.bottom >= rootBoundsInfo.top && targetInfo.bottom < rootBoundsInfo.bottom) {
          this.handleActiveChange(false)
        }
      }
    }, { threshold: [1], root: null });

    observer.observe(this.topDetector);
  };

  observeFooter = () => {
    const observer = new IntersectionObserver((records, observer) => {
      for (const record of records) {
        const targetInfo = record.boundingClientRect;
        const rootBoundsInfo = record.rootBounds;
        const ratio = record.intersectionRatio;

        // Started sticking.
        if (targetInfo.bottom > rootBoundsInfo.top && ratio === 1) {
          this.handleActiveChange(true)
        }

        // Stopped sticking.
        if (targetInfo.top < rootBoundsInfo.top && targetInfo.bottom < rootBoundsInfo.bottom) {
          this.handleActiveChange(false)
        }
      }
    }, { threshold: [1], root: null });

    observer.observe(this.bottomDetector);
  };

  componentDidMount() {
    this.observeHeader()
    this.observeFooter()
  }

  render() {
    return (
      <Container {...this.props}>
        <TopStickyDetector innerRef={el => this.topDetector = el} />

        {this.props.children}
        
        <BottomStickyDetector innerRef={el => this.bottomDetector = el} />
      </Container>
    )
  }
}