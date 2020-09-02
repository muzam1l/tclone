import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    createSelector
} from '@reduxjs/toolkit'
import { request } from 'api'
import { usersAdded } from 'features/users/usersSlice'
import { postsAdded } from 'features/posts/postsSlice'

// const searchAdapter = createEntityAdapter({
//     selectId: postOrUser => postOrUser.id_str,
//     // sortComparer: (a, b) => (b.created_at.localeCompare(a.created_at))
// })
// const initialState = searchAdapter.getInitialState({
//     status: 'idle', // || 'loading', 'error', 'done'
//     page: 0, //page currently on, page to fetch is next one
//     query: '',
// })

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
        let { posts = [], users = [] } = await request(url, { dispatch });
        posts = posts.map(post => ({ ...post, searched: true, query: q }))
        users = users.map(user => ({ ...user, searched: true, query: q }))
        // dispatch(usersAdded(posts.map(post => post.user)))
        dispatch(usersAdded(users))
        dispatch(postsAdded(posts))
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

// export const searchSelectors = searchAdapter.getSelectors(state => state.search)

// export const selectSearchPosts = createSelector(
//     [searchSelectors.selectAll],
//     search => search.filter(obj => !obj.screen_name)
// )
// export const selectSearchUsers = createSelector(
//     [searchSelectors.selectAll],
//     search => search.filter(obj => obj.screen_name)
// )

export { selectSearchUsers } from 'features/users/usersSlice'
export { selectSearchPosts } from 'features/posts/postsSlice'