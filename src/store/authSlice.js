import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { unsubscribeUser } from '../subscription'

export const login = createAsyncThunk(
    'auth/login',
    async (_, { dispatch }) => {
        let res = await fetch('/auth/login');
        if (res.ok) {
            let data = await res.json();
            if (data.user) {
                dispatch(loggedIn(data.user))
            }
        }
        else if (res.status >= 500) {
            throw Error("Request Error")
        }
        else if (res.status >= 400) {
            dispatch(loggedOut())
        }
        return null;
    }
)
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { dispatch }) => {
        unsubscribeUser()
        dispatch(loggedOut())
        await fetch('/auth/logout');
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        // isAuthenticated: false,
        isAuthenticated: !!localStorage.getItem('loggedIn'),
        status: "idle", //or "loading", "error"
        user: JSON.parse(localStorage.getItem('user')) || null
    },
    reducers: {
        loggedIn(state, action) {
            let user = action.payload
            state.isAuthenticated = true
            state.user = user
            localStorage.setItem('loggedIn', '1');
            localStorage.setItem('user', JSON.stringify(user))
        },
        loggedOut(state) {
            state.isAuthenticated = false
            state.user = null
            localStorage.setItem('loggedIn', '');
            localStorage.removeItem('user')
        },
        userUpdated(state, action) {
            let user = action.payload
            state.user = user
        }
    },
    extraReducers: {
        [login.rejected]: state => {
            state.status = "error"
        },
        [login.pending]: state => {
            state.status = "loading"
        },
        [login.fulfilled]: state => {
            state.status = "idle"
        }
    }
})

let { actions, reducer } = authSlice;
export const { loggedIn, loggedOut, userUpdated } = actions;
export default reducer;