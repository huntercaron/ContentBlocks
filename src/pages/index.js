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
  height: 200vh;
  border: 1px solid red;
`

const StickyLayer = styled.div`
  height: 100px;
  border: 1px solid blue;
  top: 0;
  position: sticky;
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
        <Subtitle>dynamic pages:</Subtitle>
        
        <List>
          {pages.map( ({ node: page }, i) => (
            <BlockContainer key={page.id} index={i} handleActiveChange={this.handleActiveChange}>

              <StickyLayer>
                THIS: {i}, ACTIVE: {this.state.activeBlock}
              </StickyLayer>

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
