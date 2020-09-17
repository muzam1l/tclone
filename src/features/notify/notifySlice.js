import {
    createAsyncThunk,
    createSlice,
    createEntityAdapter,
    createSelector
} from '@reduxjs/toolkit'
import io from 'socket.io-client'
import { request } from 'api'

const notifyAdapter = createEntityAdapter({
    selectId: notification => notification._id.toString(),
    sortComparer: (a, b) => (b.created_at.localeCompare(a.created_at))
})

/* TODO move to its own file for general purpose */
const socket = io('/auth', {
    autoConnect: false,
    reconnectionDelay: 15 * 1000
});


const initialState = notifyAdapter.getInitialState({})

export const initSocket = createAsyncThunk(
    'notify/initSocket',
    async (_, { dispatch }) => {
        socket.on('connect', () => {
            console.log("Socket connected? ", socket.connected, ' id: ', socket.id); // true
        });

        socket.on('disconnect', () => {
            console.log("Socket connected? ", socket.connected, ' id: ', socket.id); // false
        });
        socket.on('error', err => {
            console.log('Socket error: ', err)
        })

        socket.on('notification', notification => dispatch(notificationAdded(notification)))
        socket.on('notifications', notifications => dispatch(notificationsAdded(notifications)))
        socket.on('message', message => console.log('got message: ', message))
        socket.open()
    }
)
export const fetchNotifs = createAsyncThunk(
    'notifs/fetchAll',
    async (_, { dispatch }) => {
        let { notifications } = await request('/api/notifications', { dispatch })
        if (!notifications)
            throw Error('No notifications')
        return dispatch(notificationsAdded(notifications))
    }
)
export const readNotif = createAsyncThunk(
    'notifs/readNotif',
    async (notification, { dispatch }) => {
        dispatch(notifRead(notification))
        return request(`/api/notification_read/${notification._id}`, { dispatch })
    }
)

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
                read: true
            })
        }
    }
})

const { reducer, actions } = notifySlice
export const { notificationAdded, notificationsAdded, notifRead } = actions
export default reducer

export const notifySelectors = notifyAdapter.getSelectors(state => state.notify)

export const selectUnread = createSelector(
    [notifySelectors.selectAll],
    all => all.filter(one => !one.read)
)