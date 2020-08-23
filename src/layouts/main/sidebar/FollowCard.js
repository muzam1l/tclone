import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from 'utils/context/auth'
import { Card } from 'react-bootstrap'

const Users = React.lazy(() => import('comps/Users'))

function FollowCard(props) {
    let auth = useAuth();
    let footer = {
        href: "/explore/users"
    }
    let { className } = props;
    return (
        <Card className={className}>
            <Card.Header>{props.title}</Card.Header>
            {auth.isAuthenticated ?
                <Users length={props.length} /> :
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