import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import { faBell } from '@fortawesome/free-regular-svg-icons/faBell'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope'

import { NavLink, Link } from 'react-router-dom'
import { } from 'react-bootstrap'

function Nav() {
    let props = { active: 'Home' } //for now
    let list = [
        {
            name: "Home",
            href: "/home",
            icon: faHome
        },
        {
            name: "Search",
            href: "/explore",
            icon: faSearch
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
        }
    ]
    return (
        <div className="fixed-bottom bg-white d-flex justify-content-around border">
            {list.map(item => {
                {/* let active = (props.active === item.name) ? ' active' : ''; */ }
                return (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        activeClassName="active"
                        className='btn btn-naked-primary rounded-pill p-3 px-5'
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