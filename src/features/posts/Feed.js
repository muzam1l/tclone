import React from 'react'
import { useCallback } from 'react'

// import ScrollManager from 'comps/ScrollManager'
import { useDispatch, useSelector } from 'react-redux'
import { getFeed, selectFeedPosts } from './postsSlice'

import FollowCard from 'layouts/main/sidebar/FollowCard'
import PostsList from 'comps/PostsList'

export default (props) => {
    let { feed_status: status } = useSelector(state => state.posts)
    let posts = useSelector(selectFeedPosts)
    let dispatch = useDispatch()
    const getPosts = useCallback(() => {
        dispatch(getFeed())
        // eslint-disable-next-line
    }, [])
    // if (status === 'error')
    //     append = <TryAgain fn={getPosts} />
    let append;
    if (status === 'done')
        append = (<>
            <div className="message text-info">You have reached the end!</div>
            <FollowCard noPop length={7} title='Follow (more) users to see their posts' />
        </>)
    return (<>
        {/* <ScrollManager scrollKey="feed-screen" /> */}
        <PostsList
            posts={posts}
            status={status}
            getPosts={getPosts}
        />
        {append}
    </>)
}
