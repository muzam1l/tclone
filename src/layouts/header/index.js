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
import { Col } from 'react-bootstrap'

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
        <Col className="p-0 d-flex flex-column">
            <div className="mt-2">
                <Link
                    className='btn text-primary btn-naked-primary rounded-circle p-2'
                    to={logo.href}>
                    <FontAwesomeIcon size="2x" icon={logo.icon} />
                </Link>
            </div>
            <div className="ml-n3 d-flex flex-column mb-2">
                {list.map(itm => {
                    return (
                        <NavLink
                            key={itm.name}
                            to={itm.href}
                            className="py-0 btn btn-naked-primary rounded-pill font-weight-bold btn-lg d-flex align-items-center"
                            activeClassName="active"
                        >
                            <FontAwesomeIcon className="m-3 mx-sm-auto m-xl-3" size="lg" icon={itm.icon} />
                            <span className="d-none d-xl-block">{itm.name}</span>
                        </NavLink>
                    )
                })}
            </div>

            <Link className="d-flex btn btn-primary font-weight-bold p-xl-3 rounded-pill w-100 mx-auto" id="compose" to="/compose/tweet">
                <span className="d-none d-xl-block mx-auto">{compose.name}</span>
                <FontAwesomeIcon className="d-xl-none mx-auto" size="2x" icon={compose.icon} />
            </Link>
        </Col>
    )
}

export default Header