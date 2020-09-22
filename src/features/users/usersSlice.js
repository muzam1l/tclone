import {
    createSlice, createAsyncThunk, createEntityAdapter, createSelector
} from '@reduxjs/toolkit'
import { request } from 'api'
import {
    getFeed, parsePosts, selectUserPosts
} from 'features/posts/postsSlice'
import { userUpdated as authUserUpdated } from 'store/authSlice'


let usersComparer = (a, b) => (b.followers_count - a.followers_count)
const usersAdapter = createEntityAdapter({
    selectId: user => user.screen_name,
    // sortComparer: usersComparer
})
const initialState = usersAdapter.getInitialState({
    user_suggests_status: 'idle',
    user_timeline_status: 'idle',
    user_update_status: 'idle',
    user_friendlist_status: 'idle',
    user_friendlist_page: 0,
    user_followerlist_status: 'idle',
    user_followerlist_page: 0,
    user_timeline_page: 0,
})

export const updateUserDetails = createAsyncThunk(
    'users/updateUserDetails',
    async (body, { dispatch }) => {
        let { user } = await request('/api/updateuser', { body, dispatch })
        if (!user)
            throw Error("User feild nill in responce")
        dispatch(authUserUpdated(user))
        return dispatch(userAdded(user))
    }
)

export const getUserSuggests = createAsyncThunk(
    'users/getUserSuggests',
    async (_, { dispatch }) => {
        let data = await request('/api/users', { dispatch });
        // console.log(data.users)
        return data.users
    }
)
export const getUserTimeline = createAsyncThunk(
    'users/getUserTimeline',
    async (username, { dispatch, getState }) => {
        let { user_timeline_page: p } = getState().users
        let l = selectUserPosts(getState(), username).length
        if (!l || l === 0) {
            dispatch(resetTimelinePage())
            p = 0
        }
        let url = `/api/user_timeline/${username}?p=${p + 1}`
        let { posts, user } = await request(url, { dispatch })
        if (user) {
            dispatch(userAdded(user))
        }
        dispatch(parsePosts(posts))
        return posts.length;
    }
)

export const followUser = createAsyncThunk(
    'users/folllowUser',
    async (username, { dispatch, getState }) => {
        dispatch(followingChanged({ username, following: true }))
        username = encodeURIComponent(username)
        await request(`/api/follow/${username}`, { dispatch });
        let feedStatus = getState().posts.feed_status
        if (feedStatus === 'done')
            dispatch(getFeed())
    }
)
export const unFollowUser = createAsyncThunk(
    'users/unFolllowUser',
    async (username, { dispatch }) => {
        dispatch(followingChanged({ username, following: false }))
        username = encodeURIComponent(username)
        return request(`/api/unfollow/${username}`, { dispatch });
    }
)
export const getFollowers = createAsyncThunk(
    'users/getFollowers',
    async (username, { dispatch, getState }) => {
        let { users: { user_followerlist_page: p } } = getState()
        let l = selectFollowers(getState(), username).length
        if (!l) {
            dispatch(resetFollowerlistPage())
            p = 0
        }
        p = parseInt(p)
        username = encodeURIComponent(username)
        let { users = [] } = await request(`/api/followers/${username}?p=${p + 1}`, { dispatch })
        console.log(users)
        if (!users.length)
            return
        users = users.map(user => ({ ...user, follower_of: decodeURIComponent(username) }))
        dispatch(usersAdded(users))
        return users.length
    }
)
export const getFriends = createAsyncThunk(
    'users/getFriends',
    async (username, { dispatch, getState }) => {
        let { users: { user_friendlist_page: p } } = getState()
        let l = selectFriends(getState(), username).length
        if (!l) {
            dispatch(resetFriendlistPage())
            p = 0
        }
        p = parseInt(p)
        username = encodeURIComponent(username)
        let { users = [] } = await request(`/api/friends/${username}?p=${p + 1}`, { dispatch })
        if (!users.length)
            return
        users = users.map(user => ({ ...user, friend_of: decodeURIComponent(username) }))
        dispatch(usersAdded(users))
        return users.length
    }
)

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        followingChanged: (state, action) => {
            let { username, following } = action.payload
            usersAdapter.updateOne(state, {
                id: username,
                changes: {
                    following,
                    new: true
                }
            })
        },
        resetTimelinePage: state => {
            state.user_timeline_page = 0
        },
        resetFollowerlistPage: state => {
            state.user_followerlist_page = 0
        },
        resetFriendlistPage: state => {
            state.user_friendlist_page = 0
        },
        userAdded: usersAdapter.upsertOne,
        usersAdded: usersAdapter.upsertMany,
        usersAddedDontUpdate: usersAdapter.addMany
    },
    extraReducers: {
        [getUserSuggests.rejected]: state => { state.user_suggests_status = 'error' },
        [getUserSuggests.pending]: state => { state.user_suggests_status = 'loading' },
        [getUserSuggests.fulfilled]: (state, action) => {
            state.user_suggests_status = 'idle'
            // console.log(action.payload)
            usersAdapter.addMany(state, action.payload)
        },
        [getUserTimeline.rejected]: state => { state.user_timeline_status = 'error' },
        [getUserTimeline.pending]: state => { state.user_timeline_status = 'loading' },
        [getUserTimeline.fulfilled]: (state, action) => {
            let length = action.payload
            if (length > 0) {
                state.user_timeline_status = 'idle'
                state.user_timeline_page += 1
            }
            else
                state.user_timeline_status = 'done'
        },
        [updateUserDetails.rejected]: state => { state.user_update_status = 'error' },
        [updateUserDetails.pending]: state => { state.user_update_status = 'pending' },
        [updateUserDetails.fulfilled]: state => { state.user_update_status = 'idle' },

        [getFollowers.rejected]: state => { state.user_followerlist_status = 'error' },
        [getFollowers.pending]: state => { state.user_followerlist_status = 'loading' },
        [getFollowers.fulfilled]: (state, action) => {
            const length = action.payload
            if (length > 0) {
                state.user_followerlist_status = 'idle'
                state.user_followerlist_page += 1
            }
            else
                state.user_followerlist_status = 'done'
        },

        [getFriends.rejected]: state => { state.user_friendlist_status = 'error' },
        [getFriends.pending]: state => { state.user_friendlist_status = 'loading' },
        [getFriends.fulfilled]: (state, action) => {
            const length = action.payload
            if (length > 0) {
                state.user_friendlist_status = 'idle'
                state.user_friendlist_page += 1
            }
            else
                state.user_friendlist_status = 'done'
        },
    }
})
const { actions, reducer } = usersSlice
export default reducer
export const { followingChanged,
    userAdded,
    usersAdded,
    resetTimelinePage,
    resetFollowerlistPage,
    resetFriendlistPage,
    usersAddedDontUpdate
} = actions

export const usersSelectors = usersAdapter.getSelectors(state => state.users)

export const selectSuggests = createSelector(
    usersSelectors.selectAll,
    users => users.filter(user => (user.following === false || user.new === true)).sort(usersComparer)
)

export const selectSearchUsers = createSelector(
    [usersSelectors.selectAll, (state, query) => query],
    (users, query) => users.filter(user => (user.searched === true && user.query === query))
)

export const selectFriends = createSelector(
    [usersSelectors.selectAll, (_, username) => username],
    (users, username) => users
        .filter(user => user.friend_of === username)
        .filter(user => user.friend_of !== user.screen_name)
)
export const selectFollowers = createSelector(
    [usersSelectors.selectAll, (_, username) => username],
    (users, username) => users
        .filter(user => user.follower_of === username)
        .filter(user => user.follower_of !== user.screen_name)
)

export { selectUserPosts } from 'features/posts/postsSlice'
