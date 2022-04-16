import {
    createAsyncThunk,
    createSlice,
    createEntityAdapter,
    createSelector,
} from '@reduxjs/toolkit'
// import io from 'socket.io-client'
import { request } from 'api'

const notifyAdapter = createEntityAdapter({
    selectId: notification => notification._id.toString(),
    sortComparer: (a, b) => b.created_at.localeCompare(a.created_at),
})

// /* TODO move to its own file for general purpose */
// const socket = io('/auth', {
//     autoConnect: false,
//     /*
//     * As netlify doesn't support socket proxying
//     * resorting to just polling, instead of using JWT now
//     */
//     transports: ['polling']
// });

// export const initSocket = createAsyncThunk(
//     'notify/initSocket',
//     async (_, { dispatch }) => {
//         socket.on('connect', () => {
//             // console.log("Socket connected? ", socket.connected, ' id: ', socket.id); // true
//         });

//         socket.on('disconnect', () => {
//             // console.log("Socket connected? ", socket.connected, ' id: ', socket.id); // false
//         });
//         socket.on('error', err => {
//             // console.log('Socket error: ', err)
//         })

//         socket.on('notification', notification => dispatch(notificationAdded(notification)))
//         socket.on('notifications', notifications => dispatch(notificationsAdded(notifications)))
//         socket.on('message', message => console.log('got message: ', message))
//         // socket.open()
//     }
// )
const interval = 15 * 1000
var notifsInterval
export const fetchNotifs = () => async (dispatch, getState) => {
    const {
        auth: { isAuthenticated },
    } = getState()
    if (isAuthenticated && !notifsInterval) {
        notifsInterval = setInterval(() => {
            dispatch(fetchNotifs())
        }, interval)
    } else if (!isAuthenticated && notifsInterval) clearInterval(notifsInterval)
    const {
        notify: { status },
    } = getState()
    if (status === 'loading') return
    dispatch(_fetchNotifs())
}

export const _fetchNotifs = createAsyncThunk('notifs/fetchAll', async (_, { dispatch }) => {
    let { notifications } = await request('/api/notifications', { dispatch })
    if (!notifications) throw Error('No notifications')
    return dispatch(notificationsAdded(notifications))
})
export const readNotif = createAsyncThunk(
    'notifs/readNotif',
    async (notification, { dispatch }) => {
        dispatch(notifRead(notification))
        return request(`/api/notification_read/${notification._id}`, { dispatch, body: {} })
    }
)
const initialState = notifyAdapter.getInitialState({
    status: 'idle', // || 'loading'
})
const notifySlice = createSlice({
    name: 'notify',
    initialState,
    reducers: {
        notificationAdded: notifyAdapter.upsertOne,
        notificationsAdded: notifyAdapter.upsertMany,
        notifRead: (state, action) => {
            let notif = action.payload
            notifyAdapter.upsertOne(state, {
                ...notif,
                read: true,
            })
        },
    },
    extraReducers: {
        [fetchNotifs.pending]: state => {
            state.status = 'loading'
        },
        [fetchNotifs.rejected]: state => {
            state.status = 'idle'
        },
        [fetchNotifs.fulfilled]: state => {
            state.status = 'idle'
        },
    },
})

const { reducer, actions } = notifySlice
export const { notificationAdded, notificationsAdded, notifRead } = actions
export default reducer

export const notifySelectors = notifyAdapter.getSelectors(state => state.notify)

export const selectUnread = createSelector([notifySelectors.selectAll], all =>
    all.filter(one => !one.read)
)
