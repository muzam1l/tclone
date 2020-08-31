import React from 'react'
import TryAgain from 'comps/TryAgain'

// import ScrollManager from 'comps/ScrollManager'

import { useDispatch, useSelector } from 'react-redux'
import { getFeed, selectFeedPosts } from './postsSlice'

import FollowCard from 'layouts/main/sidebar/FollowCard'
import PostsList from 'comps/PostsList'

export default (props) => {
    let { feed_status: status } = useSelector(state => state.posts)
    let posts = useSelector(selectFeedPosts)
    let dispatch = useDispatch()
    let append;
    if (status === 'error')
        append = <TryAgain fn={() => { dispatch(getFeed()) }} />
    else if (status === 'done')
        append = (<>
            <div className="message text-info">You have reached the end!</div>
            <FollowCard length={7} title='Follow (more) users to see their posts' />
        </>)
    return (<>
        {/* <ScrollManager scrollKey="feed-screen" /> */}
        <PostsList
            posts={posts}
            status={status}
            getPosts={() => { dispatch(getFeed()) }}
        />
        {append}
    </>)
}
