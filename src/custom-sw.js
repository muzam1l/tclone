/* eslint no-restricted-globals: "off" */
import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute';
import { registerRoute } from 'workbox-routing';
import { ExpirationPlugin } from 'workbox-expiration';
import { StaleWhileRevalidate } from 'workbox-strategies';

/**
 * Offline and caching
 */

//index doc
self.addEventListener('install', async (event) => {
    event.waitUntil(
        caches.open('index')
            .then((cache) => cache.add('/index.html'))
    );
});
registerRoute(
    ({ request }) => request.destination === 'document',
    async ({ event }) => {
        const cache = await caches.open('index');
        const cachedResponse = await cache.match('/index.html');
        const networkResponsePromise = fetch('/index.html');

        event.waitUntil(async function () {
            const networkResponse = await networkResponsePromise;
            await cache.put('/index.html', networkResponse.clone());
        }());

        // Returned the cached response if we have one, otherwise return the network response.
        return cachedResponse || networkResponsePromise;
    }
)

// images
registerRoute(
    ({ request, url }) => request.destination === 'image' && url.origin === 'https://tclone-api.herokuapp.com',
    new StaleWhileRevalidate({
        cacheName: 'images',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 20,
                maxAgeSeconds: 2 * 24 * 60 * 60, // 2 Days
            }),
        ],
    })
);
//scripts
registerRoute(
    ({ request }) => request.destination === 'script',
    new StaleWhileRevalidate({
        cacheName: 'scripts',
    })
);

// fallback to precache
precacheAndRoute(self.__WB_MANIFEST || [])

