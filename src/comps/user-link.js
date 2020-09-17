import React from 'react'
import { Link } from 'react-router-dom'
import { OverlayTrigger, Popover, Card, Figure, Row, } from 'react-bootstrap'
import { numFormatter } from 'utils/helpers'
import FollowButton from 'comps/FollowButton'
import { useDispatch } from 'react-redux'
import { followUser, unFollowUser } from '../features/users/usersSlice'

import { truncateText } from 'utils/helpers'
export default ({ user, ...props }) => {
    // A dirty hack to force showing of popover when popover itself is hovered
    let [show, setShow] = React.useState(undefined)
    if (!props.hasOwnProperty('to'))
        props.to = `/user/${user.screen_name}`
    return (
        <OverlayTrigger show={show} placement="auto" delay="300"
            overlay={<UserPopover show={show} setShow={setShow} user={user} />}
        >
            <Link {...props} />
        </OverlayTrigger>
    )
}
export const UserPopover = React.forwardRef(
    ({ popper, user, show, setShow, ...props }, ref) => {
        let dispatch = useDispatch()
        return (<Popover
            className="border-0"
            ref={ref}
            id="user-popover"
            {...props}>
            <Card
                onMouseEnter={() => { setShow(true) }}
                onMouseLeave={() => { setShow(undefined) }}
                className="border p-3 bg-transparent m-0">
                <Row className="d-flex justify-content-between align-items-center">
                    <Figure
                        style={{ height: "65px", width: "65px" }}
                        className="rounded-circle overflow-hidden bg-primary mr-3"
                    >
                        <Figure.Image
                            className="w-100 h-100"
                            src={user.profile_image_url_https}
                        />
                    </Figure>
                    <FollowButton
                        user={user}
                        followUser={() => { dispatch(followUser(user.screen_name)) }}
                        unFollowUser={() => { dispatch(unFollowUser(user.screen_name)) }}
                    />
                </Row>
                <div className="flex flex-column">
                    <b>{user.name}</b>
                    <div className="text-muted mb-2 mt-0">{user.screen_name}</div>
                </div>
                <blockquote>{truncateText(user.description, 7)}</blockquote>
                <Row className="d-flex flex-column">
                    <span className="text-muted">{user.location}</span>
                    <span className="text-muted">Joined {new Date(user.created_at).toDateString()}</span>
                </Row>
                <Row className="d-flex mt-1 mb-2">
                    <em className="mr-2">{numFormatter(user.followers_count)} <span className="text-muted">Followers</span></em>
                    <div className="mr-2">{numFormatter(user.friends_count)} <span className="text-muted">Following</span></div>
                </Row>
            </Card>
        </Popover>)
    }
)