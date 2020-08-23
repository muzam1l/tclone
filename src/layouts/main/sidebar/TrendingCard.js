import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'

const Trends = React.lazy(() => import('../../../comps/Trends'))

function TrendingCard(props) {
    let footer = {
        href: "/explore"
    }
    return (
        <Card>
            <Card.Header>{props.title}</Card.Header>
            {/* ListGroup */}
            <Trends length={4} />
            <Card.Footer>
                <Card.Link as={Link} to={footer.href}>Show more</Card.Link>
            </Card.Footer>
            {/* <Link to={footer.href}>Show more</Link> */}
        </Card>
    )
}
export default TrendingCard;