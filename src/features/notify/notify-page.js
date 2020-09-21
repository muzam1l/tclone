import React from 'react'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { notifySelectors, readNotif } from './notifySlice'
import { useAlerts } from 'features/alerts/alertsContext'

import { Link } from 'react-router-dom'
import { ListGroup, Figure } from 'react-bootstrap'
import QuotePost from 'comps/quoted-post'
import Heading from 'comps/Heading'
import UserLink from 'comps/user-link'
import { fetchNotifs } from './notifySlice'

export default props => {
    const dispatch = useDispatch()
    const notifications = useSelector(notifySelectors.selectAll)
    const { ensureNotifPermission } = useAlerts()

    useEffect(() => {
        dispatch(fetchNotifs())
        ensureNotifPermission()
        // eslint-disable-next-line
    }, [])

    const handleClick = n => {
        if (!n.read)
            dispatch(readNotif(n))
    }
    return (<>
        <Heading title='Notifications' btnProfile backButton />
        <ListGroup variant="flush" className="min-vh-100">
            {notifications.length ? notifications.map(n => {
                let active = n.read ? '' : 'bg-bg-color'
                let post = n.body.post
                let body, heading, anchor = '#'
                if (post) {
                    body = <QuotePost post={post} />
                    anchor = `/post/${post.id_str}`
                }
                else if (n.type.endsWith('followed') && n.body.user) { //(un)followed
                    let user = n.body.user
                    anchor = `/user/${user.screen_name}`
                    body = (<>
                        <UserLink
                            className='font-weight-bold text-dark'
                            user={user}
                        >{user.screen_name} </UserLink>
                        {n.type} You
                    </>)
                }
                if (n.body.user) {
                    let user = n.body.user
                    heading = (<div className='d-flex'>
                        <UserLink user={user}>
                            <Figure
                                className="bg-border-color rounded-circle overflow-hidden mr-1 mb-2"
                                style={{ height: "45px", width: "45px" }}
                            >
                                <Figure.Image
                                    src={(user.default_profile_image) ? '/img/default-profile-vector.svg' : user.profile_image_url_https}
                                    className="w-100 h-100"
                                />
                            </Figure>
                        </UserLink>
                    </div>)
                }
                return <ListGroup.Item
                    className={`${active} px-lg-5 px-xs-2 px-sm-4`}
                    action
                    as={"div"}
                    key={n._id}
                    onClick={() => handleClick(n)}
                >
                    <Link className="stretched-link" to={anchor}></Link>
                    <div className='mt-n2 mb-2'><small>{n.title}</small></div>
                    {heading}
                    {body}
                </ListGroup.Item>
            }) : <div className="message font-weight-bold">No notifications yet</div>}
        </ListGroup>
    </>)
}