import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    createSelector
} from '@reduxjs/toolkit'
import { request } from 'api'
import { usersAdded } from 'features/users/usersSlice'

const postsAdapter = createEntityAdapter({
    selectId: post => post.id_str,
    sortComparer: (a, b) => (b.created_at.localeCompare(a.created_at))
})
const initialState = postsAdapter.getInitialState({
    feed_status: 'idle', // || 'loading', 'error', 'done'
    feed_page: 0, //page currently on, page to fetch is next one
    compose_status: 'idle', // || 'pending', 'error'
})

export const getPost = createAsyncThunk(
    'posts/getPost',
    async (postId, { dispatch }) => {
        let { post } = await request(`/api/post/${postId}`, { dispatch })
        if (!post)
            throw Error("Post not available")
        dispatch(postAdded(post))
    }
)

export const getFeed = createAsyncThunk(
    'posts/getFeed',
    async (_, { dispatch, getState }) => {
        let { posts: { feed_page: p } } = getState()
        let url = `/api/home_timeline?p=${p + 1}`
        let data = await request(url, { dispatch })
        let posts = data.posts
        let users = posts.map(post => post.user)
        dispatch(usersAdded(users))
        return posts;
    }
)
export const likePost = createAsyncThunk(
    'posts/likePost',
    async (post, { dispatch }) => {
        dispatch(postLiked(post))
        await request(`/api/like/${post.id_str}`, { dispatch })
    }
)
export const unlikePost = createAsyncThunk(
    'posts/unlikePost',
    async (post, { dispatch }) => {
        dispatch(postUnliked(post))
        await request(`/api/unlike/${post.id_str}`, { dispatch })
    }
)

export const composePost = createAsyncThunk(
    'posts/composePost',
    async (body, { dispatch }) => {
        let { post } = await request('/api/post', { body, dispatch })
        if (post)
            post.user.following = true //work around till server shows this correctly on all posts/users
        return post
    }
)

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postsAdded: postsAdapter.upsertMany,
        postAdded: postsAdapter.upsertOne,
        postLiked: (state, action) => {
            let post = action.payload;
            postsAdapter.updateOne(state, {
                id: post.id_str,
                changes: {
                    favorited: true,
                    favorite_count: post.favorite_count + 1
                }
            })
        },
        postUnliked: (state, action) => {
            let post = action.payload;
            postsAdapter.updateOne(state, {
                id: post.id_str,
                changes: {
                    favorited: false,
                    favorite_count: post.favorite_count - 1
                }
            })
        }
    },
    extraReducers: {
        [getFeed.rejected]: state => { state.feed_status = 'error' },
        [getFeed.pending]: state => { state.feed_status = 'loading' },
        [getFeed.fulfilled]: (state, action) => {
            postsAdapter.addMany(state, action.payload)
            if (action.payload.length > 0) {
                state.feed_status = 'idle'
                state.feed_page += 1
            }
            else
                state.feed_status = 'done'
        },
        [composePost.pending]: state => { state.compose_status = 'pending' },
        [composePost.rejected]: state => { state.compose_status = 'error' },
        [composePost.fulfilled]: (state, action) => {
            state.compose_status = 'idle'
            postsAdapter.addOne(state, action.payload)
        }
    }
})
const { reducer, actions } = postsSlice
export const { postsAdded, postAdded, postLiked, postUnliked } = actions
export default reducer
let feedFilter = post => {
    return post.user.following === true //may be more conditions in future
}

export const postsSelectors = postsAdapter.getSelectors(state => state.posts)

export const selectPostById = createSelector(
    [postsSelectors.selectAll, (state, postId) => postId],
    (posts, postId) => posts.find(post => (post.id_str === postId))
)
export const selectFeedPosts = createSelector(
    [postsSelectors.selectAll],
    posts => posts.filter(feedFilter)
)
export const selectUserPosts = createSelector(
    [postsSelectors.selectAll, (state, username) => username],
    (posts, username) => posts.filter(post => post.user.screen_name === username)
)

export const selectSearchPosts = createSelector(
    [postsSelectors.selectAll, (state, query) => query],
    (posts, query) => posts.filter(post => (post.searched === true && post.query === query))
)