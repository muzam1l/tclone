import React from 'react'
import PostsList from 'comps/PostsList'
import UsersList from 'comps/UsersList'
import { Redirect, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
    changeQuery,
    trySearch,
    selectSearchPosts,
    selectSearchUsers,
} from './searchSlice'
import { followUser, unFollowUser } from 'features/users/usersSlice'
import { useEffect } from 'react'
import Spinner from 'comps/Spinner'
import TryAgain from 'comps/TryAgain'
import Heading from 'comps/Heading'

export default () => {
    let location = useLocation()
    let dispatch = useDispatch()
    let { search } = location
    let { status, query } = useSelector(state => state.search)
    let posts = useSelector(state => selectSearchPosts(state, query))
    let users = useSelector(state => selectSearchUsers(state, query))
    let urlq = new URLSearchParams(search).get('q')
    if (!urlq || !urlq.trim()) {
        return <Redirect to="/explore" />
    }
    useEffect(() => {
        if (query !== urlq)
            dispatch(changeQuery(urlq))
    })
    if (status === 'loading' && !(posts.length || users.length))
        return <Spinner />
    return (<>
        <Heading title={query || 'Search'} backButton btnProfile />
        <UsersList
            users={users}
            followUser={username => { dispatch(followUser(username)) }}
            unFollowUser={username => { dispatch(unFollowUser(username)) }}
        />
        {posts.length ? <PostsList
            posts={posts}
            status={status}
            getPosts={() => { dispatch(trySearch()) }}
        /> : <div className="message">No posts to show</div>}
        {status === 'error' && <TryAgain fn={() => { dispatch(changeQuery(urlq)) }} />}
    </>)
}