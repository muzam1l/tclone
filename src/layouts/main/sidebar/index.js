import React from 'react'
import Search from 'comps/SearchBar'
import FollowCard from './FollowCard'
import TrendingCard from './TrendingCard'
import { Col } from 'react-bootstrap'

import { useLocation } from 'react-router-dom'

function Sidebar() {
    const location = useLocation()
    return (
        <Col>
            <Search className="sticky-top my-2" />

            {!(location.pathname === '/explore/users') ? (
                <FollowCard compact className="my-3" length={5} title="Who to follow" />
            ) : undefined}
            {/* <br /> */}
            {!(location.pathname === '/explore') ? (
                <TrendingCard className="my-3" title="Trends for you" />
            ) : undefined}
            <footer className="m-2 mt-3 overflow-hidden">
                <small>
                    <a
                        className="text-muted text-dark text-truncate d-block"
                        href="https://www.freepik.com/free-photos-vectors/people"
                    >
                        People vector created by studiogstock - www.freepik.com
                    </a>
                </small>
                <p className="text-black font-weight-bold mb-0 mt-1">
                    <a className="text-monospace" href="https://github.com/muzam1l/tclone">
                        Tclone, the twitter clone
                    </a>
                </p>
                <div className="text-muted mb-1 mt-n1">
                    <small>v{process.env.REACT_APP_VERSION}</small>
                </div>
            </footer>
        </Col>
    )
}

export default Sidebar
