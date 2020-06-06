import React from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../utils/context/auth'
const Users = React.lazy(() => import('../../../comps/Users'))

function FollowCard(props) {
    let auth = useAuth();
    let footer = {
        href: "/explore/users"
    }
    return (
        <div className="card">
            <div className="header">
                <span className="title">{props.title}</span>
            </div>
            {auth.isAuthenticated ?
                <Users length={props.length} /> :
                <div className="content">Login to see users and their posts</div>
            }

            <div className="footer">
                <Link to={footer.href}>Show more</Link>
            </div>
        </div>
    )
}
export default FollowCard;