// import { createSlice } from '@reduxjs/toolkit'

// const postsSlice = createSlice({
//     name: 'posts',
//     initialState: {
//         status: 'idle',
//         posts: []
//     },
//     reducers: {
//         postsLoading(state, action) {
//             if (state.status === 'idle') {
//                 state.status = 'loading'
//             }
//         },
//         postsReceived(state, action) {
//             if (state.status === 'loading') {
//                 state.status = 'idle'
//                 state.posts = action.payload
//             }
//         }
//     }
// })
// const { actions, reducer } = postsSlice
// export const { postsLoading, postsReceived } = actions
// export default reducer
