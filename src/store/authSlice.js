import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { unsubscribeUser } from '../subscription'

export const login = createAsyncThunk('auth/login', async (_, { dispatch }) => {
    let res = await fetch('/auth/login')
    if (res.ok) {
        let data = await res.json()
        if (data.user) {
            dispatch(loggedIn(data.user))
        }
    } else if (res.status >= 500) {
        throw Error('Request Error')
    } else if (res.status >= 400) {
        dispatch(loggedOut())
    }
    return null
})
export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
    unsubscribeUser()
    dispatch(loggedOut())
    await fetch('/auth/logout', {
        method: 'POST',
    })
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        // isAuthenticated: false,
        isAuthenticated: !!sessionStorage.getItem('LOGGED_IN'),
        status: 'loading', //or "idle", "error"
        user: JSON.parse(sessionStorage.getItem('user')) || null,
    },
    reducers: {
        loggedIn(state, action) {
            let user = action.payload
            state.isAuthenticated = true
            state.user = user
            sessionStorage.setItem('LOGGED_IN', '1')
            sessionStorage.setItem('user', JSON.stringify(user))
        },
        loggedOut(state) {
            state.isAuthenticated = false
            state.user = null
            sessionStorage.setItem('LOGGED_IN', '')
            sessionStorage.removeItem('user')
        },
        userUpdated(state, action) {
            let user = action.payload
            state.user = user
            sessionStorage.setItem('user', JSON.stringify(user))
        },
    },
    extraReducers: {
        [login.rejected]: state => {
            state.status = 'error'
        },
        [login.pending]: state => {
            state.status = 'loading'
        },
        [login.fulfilled]: state => {
            state.status = 'idle'
        },
    },
})

let { actions, reducer } = authSlice
export const { loggedIn, loggedOut, userUpdated } = actions
export default reducer
