import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'
import Button from '../components/Button'


// styled components
const Container = styled.div`

`

const Subtitle = styled.div`
  text-align: left;
`

const List = styled.div`
`

const BlockContainer = styled.div`
  position: relative;
  height: 200vh;
  border: 1px solid red;
`

const StickyLayer = styled.div`
  height: 80px;
  border: 1px solid blue;
  top: 0;
  position: sticky;
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

// components
function ContentBlock(props) {
  return (
    <div />
  )
}


// page component
export default class IndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeBlock: 0
    }

    this.topDetectors = [];
    this.bottomDetectors = [];
  }
  

  addSentinels = (container, className) => {
    return Array.from(container.querySelectorAll('.sticky')).map(el => {
      const sentinel = document.createElement('div');
      sentinel.classList.add('sticky_sentinel', className);
      return el.parentElement.appendChild(sentinel);
    });
  }
  
  fireEvent = (stuck, target) => {
    this.setState({ activeBlock: target.dataset.num });
    const e = new CustomEvent('sticky-change', {detail: {stuck, target}});
    document.dispatchEvent(e);
  }

  observeHeaders = (container) => {
    const observer = new IntersectionObserver((records, observer) => {
      for (const record of records) {
        const targetInfo = record.boundingClientRect;
        const stickyTarget = record.target.parentElement.querySelector(".sticky");
        const rootBoundsInfo = record.rootBounds;

        // Started sticking.
        if (targetInfo.bottom < rootBoundsInfo.top) {
          this.fireEvent(true, stickyTarget);
        }

        // Stopped sticking.
        if (targetInfo.bottom >= rootBoundsInfo.top && targetInfo.bottom < rootBoundsInfo.bottom) {
          this.fireEvent(false, stickyTarget);
        }
      }
    }, {threshold: [0], root: null});

    this.topDetectors.forEach(el => observer.observe(el));
  }

  observeFooters = (container) => {
    const observer = new IntersectionObserver((records, observer) => {
      for (const record of records) {
        const targetInfo = record.boundingClientRect;
        const stickyTarget = record.target.parentElement.querySelector('.sticky');
        const rootBoundsInfo = record.rootBounds;
        const ratio = record.intersectionRatio;

        // Started sticking.
        if (targetInfo.bottom > rootBoundsInfo.top && ratio === 1) {
          this.fireEvent(true, stickyTarget);
        }

        // Stopped sticking.
        if (targetInfo.top < rootBoundsInfo.top &&
          targetInfo.bottom < rootBoundsInfo.bottom) {
          this.fireEvent(false, stickyTarget);
        }
      }
    }, {
      threshold: [1],
      root: null
    });

    this.bottomDetectors.forEach(el => observer.observe(el));
  }
  
  observeStickyLayerChanges = (container) => {
    this.observeHeaders(container);
    this.observeFooters(container);
  }

  componentDidMount() {
    this.observeStickyLayerChanges(this.container);
  }

  render() {
    const pages = this.props.data.allMarkdownRemark.edges;
    return (
      <Container innerRef={el => this.container = el}>
        <Subtitle>dynamic pages:</Subtitle>
        
        <List>
          {pages.map( ({ node: page }, i) => (
            <BlockContainer key={page.id}>
              <TopStickyDetector innerRef={el => this.topDetectors[i] = el}/>

              <StickyLayer className="sticky" data-num={i}>
                {this.state.activeBlock}
              </StickyLayer>

              <BottomStickyDetector innerRef={el => this.bottomDetectors[i] = el}/>
            </BlockContainer>
          ))}
        </List>

        <Button text="this is a button component" />

      </Container>
    )
  }
}

// data query
export const query = graphql`
  query IndexQuery {
    allMarkdownRemark {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            path
            date(formatString: "DD MMMM, YYYY")
          }
        }
      }
    }
  }
`;
