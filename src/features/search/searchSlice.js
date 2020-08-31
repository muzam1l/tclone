import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
    createSelector
} from '@reduxjs/toolkit'
import { request } from 'api'
import { usersAdded } from 'features/users/usersSlice'

const searchAdapter = createEntityAdapter({
    selectId: postOrUser => postOrUser.id_str,
    // sortComparer: (a, b) => (b.created_at.localeCompare(a.created_at))
})
const initialState = searchAdapter.getInitialState({
    status: 'idle', // || 'loading', 'error', 'done'
    page: 0, //page currently on, page to fetch is next one
    query: '',
})

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
        q = encodeURIComponent(q)
        let url = `/api/search?q=${q}&p=${p + 1}`
        let { posts, users } = await request(url, { dispatch });
        dispatch(usersAdded(posts.map(post => post.user))) //TEMP
        return { posts, users }
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
    initialState,
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
            let { users = [], posts = [] } = action.payload
            if (state.page === 0)
                searchAdapter.setAll(state, users.concat(posts))
            else
                searchAdapter.addMany(state, users.concat(posts))
            if (posts.length) {
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

export const searchSelectors = searchAdapter.getSelectors(state => state.search)

export const selectSearchPosts = createSelector(
    [searchSelectors.selectAll],
    search => search.filter(obj => !obj.screen_name)
)
export const selectSearchUsers = createSelector(
    [searchSelectors.selectAll],
    search => search.filter(obj => obj.screen_name)
)