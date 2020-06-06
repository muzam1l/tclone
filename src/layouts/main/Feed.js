import React from 'react'
import Compose from '../../comps/Compose'
import Posts from '../../comps/Posts'
// import Users from '../../comps/Users'

import './Feed.css'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faStar } from '@fortawesome/free-regular-svg-icons/faStar'
import { useAuth } from '../../utils/context/auth'

class Feed extends React.Component {
    render() {
        return (
            <div className="Feed">
                <Header />
                <Compose />
                <div className="divider"></div>
                <Posts url='/api/home_timeline' />
            </div>
        )
    }
}

function Header() {
    let auth = useAuth();
    return (
        <div className="header">
            <div className="title">Home</div>
            <button onClick={auth.logout} className="btn">Log out</button>
            {/* <span className="btn"><FontAwesomeIcon icon={faStar} /></span> */}
        </div>
    )
}

export default Feed