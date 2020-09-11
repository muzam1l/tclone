import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import { faBell } from '@fortawesome/free-regular-svg-icons/faBell'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle'
import { faUser } from '@fortawesome/free-regular-svg-icons/faUser'

import { NavLink, Link } from 'react-router-dom'
import { } from 'react-bootstrap'

function Nav() {
    let list = [
        {
            name: "Home",
            href: "/home",
            icon: faHome
        },
        {
            name: "Explore",
            href: "/explore",
            icon: faSearch
        },
        {
            name: "Notifications",
            href: "/notifications",
            icon: faBell
        },
        {
            name: "Profile",
            href: "/user/0",
            icon: faUser,
        }
    ]
    let compose = {
        name: "Tweet",
        icon: faPlusCircle,
        href: '/compose/post',
        style: {
            right: '.5em',
            bottom: '4em',
            fontSize: '1.1em'
        }
    }
    return (
        <div className="fixed-bottom bg-white d-flex justify-content-around border">
            <Link style={compose.style} to={compose.href} className="btn btn-primary rounded-circle position-absolute">
                <FontAwesomeIcon className="" size="2x" icon={compose.icon} />
            </Link>
            {list.map(item => {
                let vis = item.disabled ? 'disabled' : ''
                return (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        activeClassName="active"
                        className={`${vis} btn btn-naked-primary rounded-pill p-3`}
                    >
                        <FontAwesomeIcon
                            icon={item.icon}
                            size='lg'
                        />
                    </NavLink>
                )
            })}
        </div>
    )
}
export default Nav