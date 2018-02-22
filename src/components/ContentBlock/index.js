import React from 'react'
import 'intersection-observer'

const containerStyle = {
  position: "relative"
}

const topDetectorStyle = {
  position: "absolute",
  left: 0,
  right: 0,
  // border: "2px solid pink",
  visibility: "hidden",
  height: "0px",
  top: "0px"
}

const bottomDetectorStyle = {
  position: "absolute",
  left: 0,
  right: 0,
  // border: "2px solid pink",
  visibility: "hidden",
  height: "80px",
  bottom: 0
}

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

        // Stopped sticking.
        if (targetInfo.bottom > rootBoundsInfo.top && targetInfo.bottom < rootBoundsInfo.bottom) {
          this.handleActiveChange(false)
        }

        // Started sticking.
        if (targetInfo.bottom <= rootBoundsInfo.top) {
          this.handleActiveChange(true)
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
      <div style={containerStyle} {...this.props}>
        <div style={topDetectorStyle} ref={el => this.topDetector = el} />

        {this.props.children}

        <div style={bottomDetectorStyle} ref={el => this.bottomDetector = el} />
      </div>
    )
  }
}