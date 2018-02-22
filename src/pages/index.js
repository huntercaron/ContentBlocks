import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'
import ContentBlock from '../components/ContentBlock'

// styled components
const Container = styled.div`

`

const Subtitle = styled.div`
  text-align: left;
`

const List = styled.div`
`

const BlockContainer = styled(ContentBlock)`
  position: relative;
  min-height: 200vh;
  border: 1px solid red;

  p {
    margin: auto;
    max-width: 90%;
    margin-bottom: 2rem;
  }
`

const StickyLayer = styled.div`
  height: 100vh;
  border: 1px solid blue;
  top: 0;
  position: sticky;
  pointer-events: none;

  h4 {
    text-align: center;
    width: 100%;
  }
`;

const Circle = styled.div`
  height: 50px;
  width: 50px;
  background-color: black;
  position: absolute;

  ${props => props.left && "left: 10px;"}
  ${props => props.right && "right: 10px;"}
  ${props => props.top && "top: 10px;"}
  ${props => props.bottom && "bottom: 10px;"}
`;

// page component
export default class IndexPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeBlock: 0
    }
  }

  handleActiveChange = (index) => {
    this.setState({
      activeBlock: index
    })
  }

  render() {
    const pages = this.props.data.allMarkdownRemark.edges;

    return (
      <Container>
        <List>
          {pages.map( ({ node: page }, i) => (
            <BlockContainer key={page.id} index={i} handleActiveChange={this.handleActiveChange}>

              <StickyLayer>
                <h4>THIS: {i}, ACTIVE: {this.state.activeBlock}</h4>
                <Circle top left />
                <Circle top right />
                <Circle bottom left />
                <Circle bottom right/>
                
              </StickyLayer>

              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel mauris varius, euismod sem nec, dapibus enim. Donec feugiat interdum dapibus. Nulla sit amet gravida purus. Fusce efficitur massa enim, nec accumsan quam semper et. Curabitur rutrum orci eu purus mattis, et rhoncus arcu efficitur. Vivamus dapibus, neque id lacinia tincidunt, augue libero varius tellus, ut dignissim nisi magna vel lorem. Duis vulputate sodales velit nec eleifend. Mauris porttitor lectus et orci convallis, at molestie lectus pretium. Praesent nec erat enim. Morbi nec auctor ante.</p>

              <p>Nullam sit amet vestibulum diam, id dapibus velit. Donec faucibus viverra urna id faucibus. Donec id facilisis mauris, in suscipit nibh. Mauris eget interdum diam, ut consequat lectus. Nunc pretium ut leo eget lacinia. Sed laoreet arcu eget bibendum finibus. Etiam auctor interdum dignissim. Ut non nunc vitae velit malesuada tincidunt non ac massa. Duis bibendum pulvinar lectus at lacinia. Vivamus maximus maximus ligula a pellentesque. Nam non viverra neque, vitae euismod dolor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>

              <p>In tempus tortor sit amet nisl sollicitudin, eget dignissim nisi molestie. Sed lectus sapien, volutpat at dictum in, malesuada vitae quam. Nulla vehicula ullamcorper mi, non congue magna consequat sed. Mauris eleifend velit eu elit lobortis tempor. Morbi id tincidunt leo. Etiam quis odio ultrices est suscipit ornare. Duis et interdum felis. Vestibulum eros lorem, accumsan eget lacinia a, tristique eget justo. Fusce iaculis eu nulla a placerat. Nulla consectetur sed nibh et consectetur. Maecenas convallis pulvinar elit, a mollis magna rutrum nec. Proin erat tellus, scelerisque eget efficitur non, efficitur ac diam. Aenean blandit sodales libero ut feugiat.</p>

              <p>Suspendisse vulputate eros ultricies imperdiet pharetra. Nulla eget augue id nisl porta semper non quis lorem. Ut consectetur auctor lectus sit amet viverra. Mauris facilisis auctor ornare. Fusce vel arcu lectus. Mauris risus massa, consectetur in dolor ut, dignissim malesuada velit. Ut ornare, eros id euismod dapibus, lacus libero fringilla eros, ac euismod erat lectus eget elit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi at bibendum sapien. Cras ut nulla bibendum, varius massa sed, pellentesque quam. Integer sollicitudin aliquet purus non blandit. Donec sodales urna quam.</p>

              <p>Praesent et faucibus magna. Fusce venenatis eros eget nisi faucibus vehicula. Duis non lobortis diam, sed euismod libero. Morbi id felis eget mauris tincidunt consequat. Curabitur finibus scelerisque posuere. Curabitur aliquet, tortor vel tempus porta, magna libero ullamcorper lacus, eget euismod magna elit ac metus. Ut tempor sollicitudin efficitur. Morbi vitae dolor ut nulla mollis dictum. Curabitur ac massa in mi finibus hendrerit ac eget orci. Cras non augue id orci bibendum pharetra sed vitae sem. Mauris et cursus odio. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris vitae urna dapibus, dignissim orci at, maximus turpis. Suspendisse egestas velit lacinia pellentesque vestibulum. </p>

            </BlockContainer>
          ))}
        </List>

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
