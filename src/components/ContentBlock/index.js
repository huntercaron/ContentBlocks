import React from 'react'
import styled from 'styled-components'
import 'intersection-observer'

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

function withContentBlockEvents(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        active: false,
        index: 0 || props.index
      };
    }

    observeHeader = () => {
      const observer = new IntersectionObserver((records, observer) => {
        for (const record of records) {
          const targetInfo = record.boundingClientRect;
          const rootBoundsInfo = record.rootBounds;

          // Started sticking.
          if (targetInfo.bottom < rootBoundsInfo.top) {
            this.setState({ active: true });
          }

          // Stopped sticking.
          if (targetInfo.bottom >= rootBoundsInfo.top && targetInfo.bottom < rootBoundsInfo.bottom) {
            this.setState({ active: false });
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
            this.setState({ active: true })
          }

          // Stopped sticking.
          if (targetInfo.top < rootBoundsInfo.top && targetInfo.bottom < rootBoundsInfo.bottom) {
            this.setState({ active: false })
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
        <WrappedComponent {...this.state} {...this.props} innerRef={el => this.container = el}>
          <TopStickyDetector innerRef={el => this.topDetector = el} />
          <h1>{this.state.active}</h1>
          {this.props.children}
          <BottomStickyDetector innerRef={el => this.bottomDetector = el} />
        </WrappedComponent>
      )
    }
  };
}

export default { withContentBlockEvents };