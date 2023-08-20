/* eslint no-restricted-globals: "off" */
import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute'
import { registerRoute } from 'workbox-routing'
import { ExpirationPlugin } from 'workbox-expiration'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { skipWaiting, clientsClaim } from 'workbox-core'

skipWaiting()
clientsClaim()
const manifest = self.__WB_MANIFEST || []
precacheAndRoute(manifest);

/**
 * Offline and caching
 */

//index doc, stale-while-revalidate
self.addEventListener('install', async event => {
    event.waitUntil(caches.open('index').then(cache => cache.add('/index.html')))
})

function cleanResponse(response) {
    const clonedResponse = response.clone()

    // Not all browsers support the Response.body stream, so fall back to reading
    // the entire body into memory as a blob.
    const bodyPromise =
        'body' in clonedResponse ? Promise.resolve(clonedResponse.body) : clonedResponse.blob()

    return bodyPromise.then(body => {
        // new Response() is happy when passed either a stream or a Blob.
        return new Response(body, {
            headers: clonedResponse.headers,
            status: clonedResponse.status,
            statusText: clonedResponse.statusText,
        })
    })
}

registerRoute(
    ({ request }) => request.destination === 'document',
    async ({ event }) => {
        const cache = await caches.open('index')
        const cachedResponse = await cache.match('/index.html')
        const networkResponsePromise = fetch('/index.html')

        event.waitUntil(
            (async function () {
                const networkResponse = await networkResponsePromise
                const cleaned = await cleanResponse(networkResponse)
                await cache.put('/index.html', cleaned)
            })()
        )

        // Returned the cached response if we have one, otherwise return the network response.
        return cachedResponse || networkResponsePromise
    }
)

// images cache first
registerRoute(
    ({ request, url }) =>
        request.destination === 'image' &&
        (url.origin === process.env.REACT_APP_API_SERVER || url.origin === self.location.origin),
    new CacheFirst({
        cacheName: 'images',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 20,
                maxAgeSeconds: 2 * 24 * 60 * 60, // 2 Days
            }),
        ],
    })
)
// fallback scripts
registerRoute(
    ({ request }) => request.destination === 'script',
    new StaleWhileRevalidate({
        cacheName: 'scripts',
    })
)
// requests to cors-anywhere proxy, cache-first
registerRoute(
    ({ url }) => url.origin === 'https://cors-anywhere.herokuapp.com',
    new CacheFirst({
        cacheName: 'previews',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    })
)
/**
 * Push n Notifications
 */

self.addEventListener('push', event => {
    const data = event.data.json()
    console.info('New notification', data)
    const options = {
        icon: './android-chrome-192x192.png',
        badge: './favicon-32x32.png',
        actions: [
            {
                action: 'open',
                title: 'Open',
            },
            {
                action: 'close',
                title: 'Close',
            },
        ],
        data: {}, //server may send page field in this eg,{ page: `/post/2334`}
        ...data.options,
    }
    event.waitUntil(self.registration.showNotification(data.title, options))
})

self.addEventListener('notificationclick', function (event) {
    const clickedNotification = event.notification
    clickedNotification.close()
    fetch(`/api/notification_read/${clickedNotification.data._id}`, {
        method: 'POST',
    })
    if (event.action === 'close') return
    else {
        //`open` action or just click anywhere on notification
        const page = clickedNotification.data.page || '/notifications'
        const url = new URL(page, self.location.origin).href
        const promiseChain = self.clients
            .matchAll({
                type: 'window',
                includeUncontrolled: true,
            })
            .then(windowClients => {
                let matchingClient = windowClients[0]
                if (matchingClient) {
                    return matchingClient
                        .navigate(url)
                        .then(matchingClient => matchingClient.focus())
                } else {
                    return self.clients.openWindow(url)
                }
            })

        event.waitUntil(promiseChain)
    }
})
self.addEventListener('notificationclose', function (event) {
    const closedNotification = event.notification
    fetch(`/api/notification_read/${closedNotification.data._id}`, {
        method: 'POST',
    })
})

const registration = self.registration
registration.onupdatefound = () => {
    const installingWorker = registration.installing
    if (installingWorker == null) {
        return
    }
    installingWorker.onstatechange = () => {
        if (installingWorker.state === 'activated') {
            // At this point, the updated precached content has been fetched,
            // window.location.reload();
            const url = new URL('/', self.location.origin).href
            self.clients
                .matchAll({
                    type: 'window',
                    includeUncontrolled: true,
                })
                .then(async windowClients => {
                    for (let client of windowClients) {
                        await client.navigate(url)
                    }
                })
        }
    }
}
