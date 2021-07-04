import {
    createSlice,
    createAsyncThunk
} from '@reduxjs/toolkit'
import { request } from 'api'
import { usersAdded } from 'features/users/usersSlice'
import { parsePosts } from 'features/posts/utils'

export const trySearch = () => async (dispatch, getState) => {
    let { search: { status } } = getState()
    if (status === 'loading')
        return
    dispatch(getSearch())
}
export const getSearch = createAsyncThunk(
    'search/getSearch',
    async (_, { getState, dispatch }) => {
        let { search: { page: p, query: q } } = getState()
        if (!q || !q.trim())
            throw Error('No Query')
        let query = encodeURIComponent(q)
        let url = `/api/search?q=${query}&p=${p + 1}`
        let { posts = [], users = [] } = await request(url, { dispatch })
        posts = posts || []
        users = users || []
        posts = posts.map(post => ({ ...post, searched: true, query: q }))
        users = users.map(user => ({ ...user, searched: true, query: q })).filter(Boolean)
        dispatch(usersAdded(users))

        dispatch(parsePosts(posts))
        return posts.length
    }
)
export const changeQuery = createAsyncThunk(
    'search/changeQuery',
    async (query, { dispatch }) => {
        dispatch(queryChanged(query))
        return dispatch(getSearch())
    }
)

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        status: 'idle', // || 'loading', 'error', 'done'
        page: 0, //page currently on, page to fetch is next one
        query: '',
    },
    reducers: {
        queryChanged: (state, action) => {
            state.query = action.payload
            state.page = 0
        }
    },
    extraReducers: {
        [getSearch.rejected]: state => { state.status = 'error' },
        [getSearch.pending]: state => { state.status = 'loading' },
        [getSearch.fulfilled]: (state, action) => {
            let length = action.payload
            // if (state.page === 0)
            //     searchAdapter.setAll(state, users.concat(posts))
            // else
            //     searchAdapter.addMany(state, users.concat(posts))
            if (length) {
                state.status = 'idle'
                state.page += 1
            }
            else
                state.status = 'done'
        }
    }
})
const { actions, reducer } = searchSlice
export default reducer
export const { queryChanged } = actions

export { selectSearchUsers } from 'features/users/usersSlice'
export { selectSearchPosts } from 'features/posts/postsSlice'