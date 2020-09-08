import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    createSelector
} from '@reduxjs/toolkit'
import { request } from 'api'
import { usersAdded, usersSelectors, userAdded } from 'features/users/usersSlice'

const postsAdapter = createEntityAdapter({
    selectId: post => post.id_str,
    sortComparer: (a, b) => (b.created_at.localeCompare(a.created_at))
})
const initialState = postsAdapter.getInitialState({
    feed_status: 'idle', // || 'loading', 'error', 'done'
    feed_page: 0, //page currently on, page to fetch is next one
    compose_status: 'idle', // || 'pending', 'error',
    post_detail_status: 'idle'
})

export const getPost = createAsyncThunk(
    'posts/getPost',
    async (postId, { dispatch }) => {
        let { post } = await request(`/api/post/${postId}`, { dispatch })
        if (!post)
            throw Error("Post not available")
        dispatch(userAdded(post.user))
        dispatch(postAdded(post))
    }
)

export const getFeed = createAsyncThunk(
    'posts/getFeed',
    async (_, { dispatch, getState }) => {
        try {
            let { posts: { feed_page: p } } = getState()
            let url = `/api/home_timeline?p=${p + 1}`
            let data = await request(url, { dispatch })
            let posts = data.posts
            posts = posts.filter(post => post)
            dispatch(usersAdded(posts.map(post => post.user)))
            dispatch(postsAdded(posts))
            return posts.length;
        } catch (err) {
            console.log(err)
            throw err
        }
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
        return request(`/api/unlike/${post.id_str}`, { dispatch })
    }
)
export const repostPost = createAsyncThunk(
    'posts/repostPost',
    async (post, { dispatch }) => {
        dispatch(postReposted(post))
        return request(`/api/repost`, { body: post, dispatch })
    }
)
export const unRepostPost = createAsyncThunk(
    'posts/unRepostPost',
    async (post, { dispatch }) => {
        dispatch(postUnReposted(post))
        return request(`/api/unrepost`, { body: post, dispatch })
    }
)

export const composePost = createAsyncThunk(
    'posts/composePost',
    async (body, { dispatch }) => {
        let { post } = await request('/api/post', { body, dispatch })
        if (post)
            post.user.following = true //work around till server shows this correctly on all posts/users
        dispatch(userAdded(post.user))
        return dispatch(postAdded(post))
    }
)

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postsAdded: (state, action) => {
            let posts = action.payload;
            posts = posts.map(post => {
                if (!post)
                    return null
                let { retweeted_status } = post
                if (retweeted_status)
                    return ({
                        ...retweeted_status,
                        is_retweeted_status: true,
                        retweeted_by: post.user
                    })
                return post
            }).filter(Boolean)
                .map(post => ({
                    ...post,
                    user: post.user.screen_name,
                    retweeted_by: post.retweeted_by && post.retweeted_by.screen_name
                }))
            postsAdapter.upsertMany(state, posts)
        },
        postAdded: (state, action) => {
            let post = action.payload;
            if (!post)
                return
            let { retweeted_status } = post
            if (retweeted_status)
                post = ({
                    ...retweeted_status,
                    is_retweeted_status: true,
                    retweeted_by: post.user
                })
            post.user = post.user.screen_name
            post.retweeted_by = post.retweeted_by && post.retweeted_by.screen_name
            postsAdapter.upsertOne(state, post)
        },
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
        },
        postReposted: (state, action) => {
            let post = action.payload;
            postsAdapter.updateOne(state, {
                id: post.id_str,
                changes: {
                    retweet_count: post.retweet_count + 1,
                    retweeted: true
                }
            })
        },
        postUnReposted: (state, action) => {
            let post = action.payload;
            postsAdapter.updateOne(state, {
                id: post.id_str,
                changes: {
                    retweet_count: post.retweet_count - 1,
                    retweeted: false,
                }
            })
        }
    },
    extraReducers: {
        [getFeed.rejected]: state => { state.feed_status = 'error' },
        [getFeed.pending]: state => { state.feed_status = 'loading' },
        [getFeed.fulfilled]: (state, action) => {
            let length = action.payload
            if (length > 0) {
                state.feed_status = 'idle'
                state.feed_page += 1
            }
            else
                state.feed_status = 'done'
        },
        [composePost.pending]: state => { state.compose_status = 'pending' },
        [composePost.rejected]: state => { state.compose_status = 'error' },
        [composePost.fulfilled]: state => {
            state.compose_status = 'idle'
        },
        [getPost.pending]: state => {
            state.post_detail_status = 'loading'
        },
        [getPost.fulfilled]: state => {
            state.post_detail_status = 'idle'
        },
        [getPost.rejected]: state => {
            state.post_detail_status = 'error'
        },
    }
})
const { reducer, actions } = postsSlice
export const {
    postsAdded,
    postAdded,
    postLiked,
    postUnliked,
    postReposted,
    postUnReposted
} = actions
export default reducer
let feedFilter = post => {
    return (post.user.following === true)
        // || (post.user.new)
        || (post.is_retweeted_status && post.retweeted_by.following === true)
}

export const postsSelectors = postsAdapter.getSelectors(state => state.posts)

export const selectAllPosts = state => {
    return postsSelectors.selectAll(state).map(post => ({
        ...post,
        user: usersSelectors.selectById(state, post.user),
        retweeted_by: post.retweeted_by && usersSelectors.selectById(state, post.retweeted_by)
    })).filter(Boolean)
}

export const selectPostById = createSelector(
    [selectAllPosts, (state, postId) => postId],
    (posts, postId) => posts.find(post => (post.id_str === postId))
)
export const selectFeedPosts = createSelector(
    [selectAllPosts],
    posts => posts.filter(feedFilter)
)
export const selectUserPosts = createSelector(
    [selectAllPosts, (state, username) => username],
    (posts, username) => posts.filter(post => post.user.screen_name === username)
)

export const selectSearchPosts = createSelector(
    [selectAllPosts, (state, query) => query],
    (posts, query) => posts.filter(post => (post.searched === true && post.query === query))
)