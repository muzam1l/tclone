import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import { request } from 'api'

const trendsAdapter = createEntityAdapter({
    selectId: trend => trend.locations[0].woeid,
    sortComparer: (a, b) => (b.trends.length - a.trends.length)
})
const initialState = trendsAdapter.getInitialState({
    status: 'idle'
})

export const getTrends = createAsyncThunk(
    'trends/getTrends',
    async (woeid = 1, { dispatch }) => {
        let { locations, trends } = await request(`/api/trends?woeid=${woeid}`, { dispatch });
        return { locations, trends }
    }
)

const trendsSlice = createSlice({
    name: 'trends',
    initialState,
    reducers: {},
    extraReducers: {
        [getTrends.rejected]: state => { state.status = 'error' },
        [getTrends.pending]: state => { state.status = 'loading' },
        [getTrends.fulfilled]: (state, action) => {
            state.status = 'idle'
            trendsAdapter.upsertOne(state, action.payload)
        }
    }
})
const { actions, reducer } = trendsSlice
export default reducer
export const { queryChanged } = actions

export const trendsSelectors = trendsAdapter.getSelectors(state => state.trends)
