import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import Trends from 'features/trends/Trends'

function TrendingCard(props) {
    let footer = {
        href: "/explore"
    }
    let { className } = props;
    return (
        <Card className={className}>
            <Card.Header>{props.title}</Card.Header>
            {/* ListGroup */}
            <Trends length={4} />
            <Card.Footer>
                <Card.Link as={Link} to={footer.href}>Show more</Card.Link>
            </Card.Footer>
        </Card>
    )
}
export default TrendingCard;