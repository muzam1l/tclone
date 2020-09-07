import React from 'react'
import { useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    usersSelectors,
    followUser,
    unFollowUser,
    selectUserPosts,
    getUserTimeline
} from './usersSlice'

// import Spinner from 'comps/Spinner'
import PostsList from 'comps/PostsList'
import Heading from 'comps/Heading'
import FollowButton from 'comps/FollowButton'
import { Row, Figure } from 'react-bootstrap'
import ScrollToTop from 'comps/ScrollToTop'
import { numFormatter } from 'utils/helpers'
import Spinner from 'comps/Spinner'

export default props => {
    let dispatch = useDispatch()
    let { match: { params: { username } = {} } = {} } = props
    let user = useSelector(state => usersSelectors.selectById(state, username))
    let posts = useSelector(state => selectUserPosts(state, user && user.screen_name))
    let { user_timeline_status: status } = useSelector(state => state.users)
    useEffect(() => {
        if ((!user || !posts.length) && status !== 'loading')
            dispatch(getUserTimeline(username))
        // eslint-disable-next-line
    }, [username])
    let getPosts = useCallback(() => {
        dispatch(getUserTimeline(username))
        // eslint-disable-next-line
    }, [username])
    if (status === 'loading' && !user)
        return <Spinner />
    if (!user)
        return <div className="message">Not found</div>
    let append = (<>
        <PostsList
            status={status}
            getPosts={getPosts}
            posts={posts}
        />
    </>)
    return (<>
        <ScrollToTop />
        <Heading title={user.name} backButton />
        <Figure
            className="bg-border-color"
            style={{ height: "200px", width: "100%" }}
        >
            <Figure.Image
                src={user.profile_banner_url}
                className="w-100 h-100"
            />
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
                <FollowButton
                    user={user}
                    followUser={() => { dispatch(followUser(user.screen_name)) }}
                    unFollowUser={() => { dispatch(unFollowUser(user.screen_name)) }}
                />
            </Row>
            <div className="flex flex-column">
                <b>{user.name}</b>
                <div className="text-muted">{user.screen_name}</div>
            </div>
            <blockquote className="mb-1">{user.description}</blockquote>
            <Row className="d-flex flex-column">
                <span className="text-muted">{user.location}</span>
                <span className="text-muted">Joined {new Date(user.created_at).toDateString()}</span>
            </Row>
            <Row className="d-flex my-2">
                <em className="mr-2">{numFormatter(user.followers_count)} <span className="text-muted">Followers</span></em>
                <div className="mr-2">{numFormatter(user.friends_count)} <span className="text-muted">Following</span></div>
            </Row>
        </div>
        <h5 className="m-2 pb-2 border-bottom">{user.statuses_count} <span className="text-muted">Posts</span></h5>
        {append}
    </>)
}