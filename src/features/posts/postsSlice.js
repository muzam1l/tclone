import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    createSelector,
} from '@reduxjs/toolkit'
import { request } from 'api'

import { parsePosts, populatePost } from './utils'

const postsAdapter = createEntityAdapter({
    selectId: post => post.id_str,
    sortComparer: (a, b) => b.created_at.localeCompare(a.created_at),
})
const initialState = postsAdapter.getInitialState({
    feed_status: 'idle', // || 'loading', 'error', 'done'
    feed_page: 0, //page currently on, page to fetch is next one
    compose_status: 'idle', // || 'pending', 'error',
    post_detail_status: 'idle',

    post_replies_status: 'idle',
    post_replies_page: 0,
})

export const getPost = createAsyncThunk('posts/getPost', async (postId, { dispatch }) => {
    let { post } = await request(`/api/post/${postId}`, { dispatch })
    if (!post) throw Error('Post not available')
    return dispatch(parsePosts([post]))
})

export const getFeed = createAsyncThunk('posts/getFeed', async (_, { dispatch, getState }) => {
    try {
        let {
            posts: { feed_page: p },
        } = getState()
        let url = `/api/home_timeline?p=${p + 1}`
        let data = await request(url, { dispatch })
        let posts = data.posts || []
        posts = posts.filter(Boolean).map(post => ({ ...post, is_feed_post: true }))
        dispatch(parsePosts(posts))
        return posts.length
    } catch (err) {
        console.log(err)
        throw err
    }
})
export const getReplies = createAsyncThunk(
    'posts/getReplies',
    async (postId, { dispatch, getState }) => {
        let {
            posts: { post_replies_page: p },
        } = getState()
        p = parseInt(p)
        let l = selectReplies(getState(), postId).length
        if (!l) {
            dispatch(resetRepliesPage())
            p = 0
        }
        let { posts } = await request(`/api/post/${postId}/replies?p=${p + 1}`, { dispatch })
        posts = posts || [] //fix, only undefined gets default value in destructing
        if (!posts.length) return
        // posts = posts.map(post => ({ ...post, reply_to: postId }))
        dispatch(parsePosts(posts))
        return posts.length
    }
)

export const likePost = createAsyncThunk('posts/likePost', async (post, { dispatch }) => {
    dispatch(postLiked(post))
    await request(`/api/like/${post.id_str}`, { dispatch, body: {} })
})
export const unlikePost = createAsyncThunk('posts/unlikePost', async (post, { dispatch }) => {
    dispatch(postUnliked(post))
    return request(`/api/unlike/${post.id_str}`, { dispatch, body: {} })
})
export const repostPost = createAsyncThunk('posts/repostPost', async (post, { dispatch }) => {
    dispatch(postReposted(post))
    return request(`/api/repost`, { body: post, dispatch })
})
export const unRepostPost = createAsyncThunk('posts/unRepostPost', async (post, { dispatch }) => {
    dispatch(postUnReposted(post))
    return request(`/api/unrepost`, { body: post, dispatch })
})

export const composePost = createAsyncThunk(
    'posts/composePost',
    async ({ body, url = '/api/post' }, { dispatch }) => {
        try {
            let { post } = await request(url, { body, dispatch })
            if (post) post.user.following = true //work around till server shows this correctly on all posts/users
            return dispatch(parsePosts([post]))
        } catch (err) {
            console.log(err)
            throw err
        }
    }
)

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postsAdded: postsAdapter.upsertMany,
        postAdded: postsAdapter.upsertOne,
        postLiked: (state, action) => {
            let post = action.payload
            postsAdapter.updateOne(state, {
                id: post.id_str,
                changes: {
                    favorited: true,
                    favorite_count: post.favorite_count + 1,
                },
            })
        },
        postUnliked: (state, action) => {
            let post = action.payload
            postsAdapter.updateOne(state, {
                id: post.id_str,
                changes: {
                    favorited: false,
                    favorite_count: post.favorite_count - 1,
                },
            })
        },
        postReposted: (state, action) => {
            let post = action.payload
            postsAdapter.updateOne(state, {
                id: post.id_str,
                changes: {
                    retweet_count: post.retweet_count + 1,
                    retweeted: true,
                },
            })
        },
        postUnReposted: (state, action) => {
            let post = action.payload
            postsAdapter.updateOne(state, {
                id: post.id_str,
                changes: {
                    retweet_count: post.retweet_count - 1,
                    retweeted: false,
                },
            })
        },
        resetRepliesPage: state => {
            state.post_replies_page = 0
        },
    },
    extraReducers: {
        [getFeed.rejected]: state => {
            state.feed_status = 'error'
        },
        [getFeed.pending]: state => {
            state.feed_status = 'loading'
        },
        [getFeed.fulfilled]: (state, action) => {
            let length = action.payload
            if (length > 0) {
                state.feed_status = 'idle'
                state.feed_page += 1
            } else state.feed_status = 'done'
        },
        [composePost.pending]: state => {
            state.compose_status = 'pending'
        },
        [composePost.rejected]: state => {
            state.compose_status = 'error'
        },
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
        [getReplies.rejected]: state => {
            state.post_replies_status = 'error'
        },
        [getReplies.pending]: state => {
            state.post_replies_status = 'loading'
        },
        [getReplies.fulfilled]: (state, action) => {
            let length = action.payload
            if (length > 0) {
                state.post_replies_status = 'idle'
                state.post_replies_page += 1
            } else state.post_replies_status = 'done'
        },
    },
})
const { reducer, actions } = postsSlice
export const {
    postsAdded,
    postAdded,
    postLiked,
    postUnliked,
    postReposted,
    postUnReposted,
    resetRepliesPage,
} = actions
export default reducer

let feedFilter = post => {
    return (
        post.user.following === true ||
        // || (post.user.new) // Can be customizable in settings someday
        (post.retweeted_by && post.retweeted_by.following === true) ||
        post.is_feed_post
    )
}

export const postsSelectors = postsAdapter.getSelectors(state => state.posts)

export const selectAllPosts = state => {
    return postsSelectors
        .selectAll(state)
        .map(post => populatePost(post, state))
        .filter(Boolean)
}

export const selectPostById = createSelector(
    [selectAllPosts, (state, postId) => postId],
    (posts, postId) => posts.find(post => post.id_str === postId)
)
export const selectFeedPosts = createSelector([selectAllPosts], posts => posts.filter(feedFilter))
export const selectUserPosts = createSelector(
    [selectAllPosts, (state, username) => username],
    (posts, username) =>
        posts.filter(
            post =>
                post.user.screen_name === username ||
                (post.retweeted_by && post.retweeted_by.screen_name === username)
        )
)
export const selectReplies = createSelector(
    [selectAllPosts, (state, postId) => postId],
    (posts, postId) => posts.filter(post => post.in_reply_to_status_id_str === postId)
)

export const selectSearchPosts = createSelector(
    [selectAllPosts, (state, query) => query],
    (posts, query) => posts.filter(post => post.searched === true && post.query === query)
)
