import React from 'react'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFriends, selectFriends, followUser, unFollowUser } from './usersSlice'
import UserList from 'comps/UsersList'
import Heading from 'comps/Heading'

export default props => {
    const dispatch = useDispatch()
    const { match: { params: { username } = {} } = {} } = props

    const users = useSelector(state => selectFriends(state, username))
    const { user_friendlist_status: status } = useSelector(state => state.users)

    const getUsers = useCallback(() => {
        dispatch(getFriends(username))
    }, [username, dispatch])
    return (<>
        <Heading
            title="Following"
            backButton
            btnProfile
        />
        <UserList
            followUser={username => { dispatch(followUser(username)) }}
            unFollowUser={username => { dispatch(unFollowUser(username)) }}
            status={status}
            users={users}
            getUsers={getUsers}
            noPop
        />
    </>)
}