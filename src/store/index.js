import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import postsReducer from 'features/posts/postsSlice'
import searchReducer from 'features/search/searchSlice'
import trendsReducer from 'features/trends/trendsSlice'
import usersReducer from 'features/users/usersSlice'
import authReducer from './authSlice'

const store = configureStore({
    reducer: {
        posts: postsReducer,
        search: searchReducer,
        trends: trendsReducer,
        users: usersReducer,
        auth: authReducer
    },
    middleware: [...getDefaultMiddleware({ immutableCheck: false })]
})

export default store