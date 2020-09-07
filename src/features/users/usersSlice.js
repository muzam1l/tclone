import {
    createSlice, createAsyncThunk, createEntityAdapter, createSelector
} from '@reduxjs/toolkit'
import { request } from 'api'
import { getFeed, postsAdded, selectUserPosts } from 'features/posts/postsSlice'


let usersComparer = (a, b) => (b.followers_count - a.followers_count)
const usersAdapter = createEntityAdapter({
    selectId: user => user.screen_name,
    sortComparer: usersComparer
})
const initialState = usersAdapter.getInitialState({
    user_suggests_status: 'idle',
    user_timeline_status: 'idle',
    user_timeline_page: 0,
})

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
        dispatch(postsAdded(posts))
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
        userAdded: usersAdapter.upsertOne,
        usersAdded: usersAdapter.upsertMany
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
    }
})
const { actions, reducer } = usersSlice
export default reducer
export const { followingChanged, userAdded, usersAdded, resetTimelinePage } = actions

export const usersSelectors = usersAdapter.getSelectors(state => state.users)

export const selectSuggests = createSelector(
    usersSelectors.selectAll,
    users => users.filter(user => (user.following === false || user.new === true)).sort(usersComparer)
)

export const selectSearchUsers = createSelector(
    [usersSelectors.selectAll, (state, query) => query],
    (users, query) => users.filter(user => (user.searched === true && user.query === query))
)

export { selectUserPosts } from 'features/posts/postsSlice'
