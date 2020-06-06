import React from 'react'
import Search from '../../../comps/Search'
import FollowCard from './FollowCard'
import TrendingCard from './TrendingCard'
import './Sidebar.css'

import { useLocation } from 'react-router-dom'

function Sidebar() {
    const location = useLocation();
    return (
        <div className="Sidebar">
            <div className="column">
                <Search />
                <div className="content">
                    {!(location.pathname === '/explore') ?
                        <TrendingCard title='Trends for you' /> : undefined}
                    {!(location.pathname === '/explore/users') ?
                        <FollowCard title='Who to follow' /> : undefined}
                    <Footer />
                </div>
            </div>
        </div>
    )
}

function Footer() {
    return (
        <div className="bottomer">
            <div className="links">
                <a href='https://www.freepik.com/free-photos-vectors/people'>People vector created by studiogstock - www.freepik.com</a>
            </div>
            <div className="about">@tclone, the twitter clone</div>
        </div>
    )
}


export default Sidebar;