import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter'
import { faBell } from '@fortawesome/free-regular-svg-icons/faBell'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope'
import { faBookmark } from '@fortawesome/free-regular-svg-icons/faBookmark'
import { faListAlt } from '@fortawesome/free-regular-svg-icons/faListAlt'
import { faUser } from '@fortawesome/free-regular-svg-icons/faUser'
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons/faEllipsisH'
import { faHashtag } from '@fortawesome/free-solid-svg-icons/faHashtag'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle'

import { NavLink, Link } from 'react-router-dom'

import './Header.css'
function Header(props) {
    let logo = {
        href: "/home",
        icon: faTwitter
    }
    let compose = {
        name: "Tweet",
        icon: faPlusCircle
    }
    let list = [
        {
            name: "Home",
            href: "/home",
            icon: faHome
        },
        {
            name: "Explore",
            href: "/explore",
            icon: faHashtag
        },
        {
            name: "Notifications",
            href: "/notifications",
            icon: faBell
        },
        {
            name: "Messages",
            href: "/messages",
            icon: faEnvelope
        },
        {
            name: "Bookmarks",
            href: "/bookmarks",
            icon: faBookmark
        },
        {
            name: "Lists",
            href: "/lists",
            icon: faListAlt
        },
        {
            name: "Profile",
            href: "/profile",
            icon: faUser
        },
        {
            name: "More",
            href: "/more",
            icon: faEllipsisH
        }

    ]
    return (
        <div className="Header">
            <div className="column">
                <div className="logo">
                    <Link className='btn' to={logo.href}>
                        <FontAwesomeIcon icon={logo.icon} />
                    </Link>
                </div>
                <div className="list">
                    {list.map(itm => {
                        return (
                            <div key={itm.name} className="item">
                                <NavLink
                                    to={itm.href}
                                    className="btn"
                                    activeClassName="active">

                                    <FontAwesomeIcon icon={itm.icon} />
                                    <span className="name">{itm.name}</span>
                                </NavLink>
                            </div>
                        )
                    })}
                </div>

                <Link className="btn" id="compose" to="/compose/tweet">
                    <div className="fill">
                        <span>{compose.name}</span>
                    </div>
                    <FontAwesomeIcon icon={compose.icon} />
                </Link>
            </div>
        </div>
    )
}

export default Header