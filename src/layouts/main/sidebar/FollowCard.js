import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import Users from 'features/users/UserSuggests'

function FollowCard(props) {
    let { isAuthenticated } = useSelector(state => state.auth)
    let footer = {
        href: "/explore/users"
    }
    let { className, ...rest } = props;
    return (
        <Card className={className}>
            <Card.Header>{props.title}</Card.Header>
            {isAuthenticated ?
                <Users length={props.length} {...rest} /> :
                <div className="message">Login to see users and their posts</div>
            }
            <Card.Footer>
                <Card.Link
                    as={Link}
                    to={footer.href}
                >Show more</Card.Link>
            </Card.Footer>
        </Card>
    )
}
export default FollowCard;