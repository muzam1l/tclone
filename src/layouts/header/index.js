import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter'
import { faBell } from '@fortawesome/free-regular-svg-icons/faBell'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope'
// import { faComments } from '@fortawesome/free-regular-svg-icons/faComments'
// import { faListAlt } from '@fortawesome/free-regular-svg-icons/faListAlt'
import { faUser } from '@fortawesome/free-regular-svg-icons/faUser'
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons/faEllipsisH'
import { faHashtag } from '@fortawesome/free-solid-svg-icons/faHashtag'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle'

import { NavLink, Link } from 'react-router-dom'
import { Col, Badge } from 'react-bootstrap'

import { useSelector } from 'react-redux'
import { selectUnread } from 'features/notify/notifySlice'

function Header(props) {
    let notifsCount = useSelector(selectUnread).length
    let { user: { screen_name } } = useSelector(state => state.auth)
    let logo = {
        href: "/home",
    }
    let compose = {
        name: "Post",
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
            name: "Profile",
            href: `/user/${screen_name}`,
            icon: faUser,
        },
        {
            name: "Notifications",
            href: "/notifications",
            icon: faBell,
            count: notifsCount
        },
        // {
        //     name: "Chat Room",
        //     href: "/chats",
        //     icon: faComments
        // },
        {
            name: "Settings",
            href: "/settings",
            icon: faEllipsisH
        },
        {
            name: "Messages",
            href: "/messages",
            icon: faEnvelope,
            disabled: true
        },

    ]
    return (
        <Col className="d-flex flex-column align-items-end vh-100 overflow-y-auto mr-sm-n3 mr-md-0 mr-xl-3 hide-scroll">
            <div className="my-2 mr-xl-auto ml-xl-4">
                <Link
                    className='btn text-primary btn-naked-primary rounded-circle p-2'
                    to={logo.href}>
                    {/* <FontAwesomeIcon size="2x" icon={logo.icon} /> */}
                    <img className="rounded-circle" height="45" width="45" src="/android-chrome-192x192.png" alt="logo" />
                </Link>
            </div>
            <div className="ml-0 d-flex flex-column mb-2 align-items-start">
                {list.map(itm => {
                    let vis = itm.disabled ? "disabled" : ""
                    let badge = itm.count ? <><Badge className="position-absolute" variant="primary" style={{ top: 5, right: 5, left: 'unset' }}>{itm.count}</Badge><span className="sr-only">new items</span></> : null
                    return (<div key={itm.name} className="d-flex align-items-top position-relative">
                        <NavLink
                            to={itm.href}
                            className={`${vis} px-xl-2 py-xl-1 p-1 mb-2 mx-lg-0 mx-auto btn btn-naked-primary rounded-pill font-weight-bold btn-lg d-flex align-items-center`}
                            activeClassName="active"
                        >
                            <FontAwesomeIcon className="m-2" size="lg" icon={itm.icon} />
                            <span className="d-none d-xl-block mr-2">{itm.name}</span>
                        </NavLink>
                        {badge}
                    </div>)
                })}
            </div>

            <Link className="d-flex btn btn-primary font-weight-bold p-xl-3 rounded-pill" id="compose" to="/compose/post">
                <span className="d-none d-xl-block mx-auto px-5">{compose.name}</span>
                <FontAwesomeIcon className="d-xl-none mx-auto" size="2x" icon={compose.icon} />
            </Link>
        </Col >
    )
}

export default Header