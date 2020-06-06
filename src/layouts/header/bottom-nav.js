import React from 'react'
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import { faBell } from '@fortawesome/free-regular-svg-icons/faBell'
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope'

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
    let style = {
        Nav: {
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: 'white',
            zIndex: 30,
            borderTop: '1px solid rgb(230, 236, 240)',
        },
        list: {
            display: 'flex',
            flexDirection: 'row',
        },
        item: {
            padding: '.75em',
            width: '25%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            // borderRadius: '10em',
        },
        svg: {
            color: 'inherit'
        }
    }
    return (
        <div style={style.Nav}>
            <div style={style.list}>
                {list.map(item => {
                    let cls = (props.active === item.name) ? 'btn active' : 'btn';
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={cls}
                            style={style.item}>
                            <FontAwesomeIcon
                                style={style.svg}
                                icon={item.icon}
                                size='lg'
                            />
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
export default Nav