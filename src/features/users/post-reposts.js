import React from 'react'
import { useCallback } from 'react'
import Heading from 'comps/Heading'
import UsersList from 'comps/UsersList'

import { useDispatch, useSelector } from 'react-redux'
import { selectReposts, getReposts, followUser, unFollowUser } from './usersSlice'

export default props => {
    const dispatch = useDispatch()
    const { match: { params: { postId } = {} } = {} } = props

    const users = useSelector(state => selectReposts(state, postId))
    const { post_reposts_status: status } = useSelector(state => state.users)

    const getUsers = useCallback(() => {
        dispatch(getReposts(postId))
    }, [postId, dispatch])
    return (<>
        <Heading
            title="Reposted by"
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