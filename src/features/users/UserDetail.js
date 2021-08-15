import React from 'react'
import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
    usersSelectors,
    followUser,
    unFollowUser,
    // selectUserPosts,
    getUserTimeline
} from './usersSlice'
import { selectUserPosts } from 'features/posts/postsSlice'

// import Spinner from 'comps/Spinner'
import PostsList from 'comps/PostsList'
import Heading from 'comps/Heading'
import FollowButton from 'comps/FollowButton'
import { Row, Figure, Col } from 'react-bootstrap'
import ScrollToTop from 'comps/ScrollToTop'
import { numFormatter } from 'utils/helpers'
import Spinner from 'comps/Spinner'
import WithUrls from 'comps/with-urls'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow as faLocation } from '@fortawesome/free-solid-svg-icons/faLocationArrow'
import { faCalendarAlt as faDate } from '@fortawesome/free-solid-svg-icons/faCalendarAlt'
import { faLink } from '@fortawesome/free-solid-svg-icons/faLink'

export default props => {
    let dispatch = useDispatch()
    let { match: { params: { username } = {} } = {} } = props
    let user = useSelector(state => usersSelectors.selectById(state, username))
    let { user: authUser } = useSelector(state => state.auth)
    let posts = useSelector(state => selectUserPosts(state, user && user.screen_name))
    let { user_timeline_status: status } = useSelector(state => state.users)
    let getPosts = useCallback(() => {
        dispatch(getUserTimeline(username))
        // eslint-disable-next-line
    }, [username])
    if (status === 'loading' && !user)
        return <Spinner />
    let userPosts = (<>
        <PostsList
            status={status}
            getPosts={getPosts}
            posts={posts}
        />
    </>)
    let userDetail
    if (!user)
        userDetail = <div className="message font-weight-bold">User not found</div>
    else if (user) {
        let { url: { urls: [{ url, expanded_url } = {}] = [] } = {} } = user.entities
        let banner_color = user.profile_banner_color || '#f5f8fa'
        const isNotifEnabled = user.notifications_enabled_device_count > 0
        userDetail = (<>
            <ScrollToTop />
            <Heading title={user.name} backButton />
            <Figure
                style={{ height: "200px", width: "100%", backgroundColor: banner_color }}
            >
                {!user.profile_banner_color && <Figure.Image
                    src={user.profile_banner_url}
                    className="w-100 h-100"
                />}
            </Figure>
            <div className="p-3 border-bottom">
                <Row className="d-flex justify-content-between mt-n2 px-2 align-items-center w-100">
                    <Figure
                        style={{ height: "100px", width: "100px" }}
                        className="mt-n5 rounded-circle overflow-hidden bg-primary"
                    >
                        <Figure.Image
                            className="w-100 h-100"
                            src={user.profile_image_url_https}
                        />
                    </Figure>
                    {authUser && authUser.screen_name === user.screen_name ? (
                        <Link
                            className="btn btn-outline-primary px-3 rounded-pill font-weight-bold"
                            to='/settings/profile'
                        >Edit profile</Link>
                    ) : (
                        <FollowButton
                            user={user}
                            followUser={() => { dispatch(followUser(user.screen_name)) }}
                            unFollowUser={() => { dispatch(unFollowUser(user.screen_name)) }}
                        />
                    )}
                </Row>
                <div className="flex flex-column">
                    <h5 className="mb-0"><b>{user.name}</b></h5>
                    <div className="text-muted">@{user.screen_name}</div>
                </div>
                <blockquote style={{ maxHeight: '300px' }} className="my-1 overflow-y-auto"><WithUrls>{user.description}</WithUrls></blockquote>
                <Row className="d-flex justify-content-between mt-2">
                    <Col sm="6" lg="4" className="px-2 mb-1">
                        <div className="d-flex text-muted align-items-top">
                            <FontAwesomeIcon className="mt-1" icon={faLocation} style={{ fontSize: '1em' }} />
                            <span className="ml-1">{user.location || 'Location unknown'}</span>
                        </div>
                    </Col>
                    <Col sm="6" lg="4" className="px-2 mb-1">
                        <div className="d-flex text-muted align-items-top">
                            <FontAwesomeIcon className="mt-1" icon={faDate} style={{ fontSize: '1em' }} />
                            <span className="ml-1">Joined {new Date(user.created_at).toDateString()}</span>
                        </div>
                    </Col>
                    <Col sm="6" lg="4" className="px-2 mb-1">
                        <div className="d-flex text-muted align-items-top">
                            <FontAwesomeIcon className="mt-1 mr-1" icon={faLink} style={{ fontSize: '1em' }} />
                            <WithUrls>{expanded_url || url}</WithUrls>
                            {/* <a className="d-block text-truncate ml-1" target="_blank" rel="noopener noreferrer" href={expanded_url || url}>{display_url || url || expanded_url || 'Just here'}</a> */}
                        </div>
                    </Col>
                </Row>
                <Row className="d-flex my-2 justify-content-between w-100">
                    <Link
                        to={`/user/${user.screen_name}/followers`}
                        className="text-muted mr-2"
                    >{numFormatter(user.followers_count)} <span>Followers</span></Link>

                    <Link
                        to={`/user/${user.screen_name}/friends`}
                        className="text-muted mr-2"
                    >{numFormatter(user.friends_count)} <span>Following</span></Link>

                    <span className={isNotifEnabled ? "text-success" : "text-danger"}>{isNotifEnabled ? "Notifications enabled" : "Notifications disabled"}</span>
                </Row>
            </div>
            <h5 className="m-2 pb-2 border-bottom">{user.statuses_count} <span className="text-muted">Posts</span></h5>
        </>)
    }
    return (<>
        {userDetail}
        {userPosts}
    </>)
}