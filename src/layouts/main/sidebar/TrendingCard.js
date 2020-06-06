import React from 'react'
import { Link } from 'react-router-dom'
import './Sidebar.css'
const Trends = React.lazy(() => import('../../../comps/Trends'))

function TrendingCard(props) {
    let footer = {
        href: "/explore"
    }
    return (
        <div className="card" >
            <div className="header">
                <span className="title">{props.title}</span>
                {/* <a className="btn" href={header.href}> <FontAwesomeIcon icon={header.icon} /></a> */}
            </div>

            <Trends length={4} />

            <div className="footer">
                <Link to={footer.href}>Show more</Link>
            </div>
        </div>
    )
}
export default TrendingCard;