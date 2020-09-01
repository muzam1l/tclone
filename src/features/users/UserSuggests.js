import React from 'react'
import { useEffect } from 'react'
import TryAgain from 'comps/TryAgain'
import Spinner from 'comps/Spinner'
import UsersList from 'comps/UsersList'

import { useSelector, useDispatch } from 'react-redux'
import {
    getUserSuggests,
    selectSuggests,
    followUser,
    unFollowUser
} from './usersSlice'

export default props => {
    let dispatch = useDispatch()
    let { user_suggests_status: status } = useSelector(state => state.users)
    let users = useSelector(selectSuggests)
    useEffect(() => {
        if (status === 'idle')
            dispatch(getUserSuggests())
        // eslint-disable-next-line
    }, [])
    let { message } = props;

    if (status === 'error' && !users.length)
        return <TryAgain fn={() => { dispatch(getUserSuggests()) }} />

    else if (status === 'loading' && !users.length)
        return <Spinner />

    if (!users.length)
        return (
            <div className="message">
                {message || 'No user suggestions for you RN'}
            </div>
        )

    return (<>
        <UsersList
            {...props}
            users={users}
            followUser={username => { dispatch(followUser(username)) }}
            unFollowUser={username => { dispatch(unFollowUser(username)) }}
        />
    </>)
}