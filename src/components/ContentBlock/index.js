import React from 'react'
import 'intersection-observer'
import styles from "./index.module.css";


function buildThresholdList(numSteps) {
  var thresholds = [0.0];

  for (var i = 1.0; i <= numSteps; i++) {
    var ratio = i / numSteps;
    thresholds.push(ratio);
  }
  thresholds.push(1.0);

  return thresholds;
}

export default class ContentBlock extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      index: 0 || props.index,
      direction: "FORWARD",
      progress: 0
    };
  }

  handleActiveChange = (active, location) => {
    if (active && active != this.state.active) {
      const direction = (location === "HEADER") ? "FORWARDS" : "BACKWARDS";

      this.setState({
        direction
      })
    }

    this.setState({
      active
    })

    if (active) { 
      this.props.handleActiveChange(this.state) 
    }
  }

  handleProgressChange = (progress, index) => {
    this.setState({
      progress
    });

    this.props.handleProgressChange(progress);
  }

  observeHeader = () => {
    const observer = new IntersectionObserver((records, observer) => {
      for (const record of records) {
        const targetInfo = record.boundingClientRect;
        const rootBoundsInfo = record.rootBounds;

        // Stopped sticking.
        if (targetInfo.bottom > rootBoundsInfo.top && targetInfo.bottom < rootBoundsInfo.bottom) {
          this.handleActiveChange(false, "HEADER")
        }

        // Started sticking.
        if (targetInfo.bottom <= rootBoundsInfo.top) {
          this.handleActiveChange(true, "HEADER")
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
          this.handleActiveChange(true, "FOOTER")
        }

        // Stopped sticking.
        if (targetInfo.top < rootBoundsInfo.top && targetInfo.bottom < rootBoundsInfo.bottom) {
          this.handleActiveChange(false, "FOOTER")
        }
      }
    }, { threshold: [1], root: null });

    observer.observe(this.bottomDetector);
  };

  observeProgress = () => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        let progress = Math.floor(entry.intersectionRatio * 100);

        if (progress !== this.state.progress) {
          this.handleProgressChange(progress);
        }
      });
    }, { threshold: buildThresholdList(20), rootMargin: 0 + "px", root: null });

    observer.observe(this.scrollSentinel);
  }

  componentDidMount() {
    this.observeHeader()
    this.observeFooter()

    if (this.props.progress) {
      this.observeProgress();
    }
  }

  render() {
    return (
      <div className={styles.container} {...this.props}>
        <div className={styles.topDetector} ref={el => this.topDetector = el} />

        {this.props.progress && (
          <div className={styles.scrollSentinel} ref={el => this.scrollSentinel = el} />
        )}

        {this.props.children}

        <div className={styles.bottomDetector} ref={el => this.bottomDetector = el} />
      </div>
    )
  }
}