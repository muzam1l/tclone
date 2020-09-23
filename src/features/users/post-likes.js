import React from 'react'
import { useCallback } from 'react'
import Heading from 'comps/Heading'
import UsersList from 'comps/UsersList'

import { useDispatch, useSelector } from 'react-redux'
import { selectLikes, getLikes, followUser, unFollowUser } from './usersSlice'

export default props => {
    const dispatch = useDispatch()
    const { match: { params: { postId } = {} } = {} } = props

    const users = useSelector(state => selectLikes(state, postId))
    const { post_likes_status: status } = useSelector(state => state.users)

    const getUsers = useCallback(() => {
        dispatch(getLikes(postId))
    }, [postId, dispatch])
    return (<>
        <Heading
            title="Liked by"
            backButton
            btnProfile
        />
        <UsersList
            followUser={username => { dispatch(followUser(username)) }}
            unFollowUser={username => { dispatch(unFollowUser(username)) }}
            status={status}
            users={users}
            getUsers={getUsers}
            noPop
        />
    </>)
}