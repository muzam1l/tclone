import { logout } from 'store/authSlice'

/**
 *
 * request - general method for all requests handling authorization within
 * @param {String} url url to fetch
 * @param {{ dispatch: Function, body: Object, headers: Object}} data adding data for request
 * @returns {Promise<Object>}
 */
export async function request(url, { dispatch, body, headers } = {}) {
    let res = await fetch(url, {
        method: body !== undefined ? 'POST' : 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: JSON.stringify(body),
    })
    if (res.ok) {
        return res.json()
    } else if (res.status === 401) {
        await dispatch(logout())
        throw Error('Not Authorized')
    } else throw Error('Something went wrong')
}
