const convertedVapidKey = urlBase64ToUint8Array(process.env.REACT_APP_PUBLIC_VAPID_KEY)

/**
 * conforms to both Apis (promise or callback)
 */
export function askPermission() {
    return new Promise(function (resolve, reject) {
        const permissionResult = Notification.requestPermission(function (result) {
            resolve(result)
        })
        if (permissionResult) {
            permissionResult.then(resolve, reject)
        }
    }).then(result => {
        if (result !== 'granted') {
            alert('Notification permission denied\nIf it was by mistake, turn it on from the settings')
            return false
        }
        return true
    })
}

export function subscribeUserToPush() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(function (registration) {
            if (!registration.pushManager) {
                console.warn('Push manager unavailable.')
                return
            }

            registration.pushManager.getSubscription().then(function (existingSubscription) {
                if (existingSubscription === null) {
                    console.info('No push subscription detected. Making one..')
                    const subscribeOptions = {
                        userVisibleOnly: true,
                        applicationServerKey: convertedVapidKey,
                    }
                    registration.pushManager
                        .subscribe(subscribeOptions)
                        .then(function (newSubscription) {
                            console.log('New push subscription added.')
                            return sendSubscription(newSubscription)
                        })
                        .catch(function (e) {
                            if (Notification.permission !== 'granted') {
                                console.info('Permission was not granted.')
                            } else {
                                console.error(
                                    'An error ocurred during the subscription process.',
                                    e
                                )
                            }
                        })
                } else {
                    console.info('Existing subscription detected.')
                    return sendSubscription(existingSubscription)
                }
            })
        })
    }
}
export function unsubscribeUser() {
    removeSubscription().then(function () {
        navigator.serviceWorker.ready.then(function (registration) {
            registration.pushManager
                .getSubscription()
                .then(function (subscription) {
                    if (subscription) {
                        return subscription.unsubscribe()
                    }
                })
                .catch(function (error) {
                    console.error('Error unsubscribing', error)
                })
                .then(function () {
                    console.info('User is unsubscribed.')
                })
        })
    })
}
function removeSubscription() {
    return fetch('/api/notifications/unsubscribe', {
        method: 'POST',
    })
}

function sendSubscription(subscription) {
    return fetch('/api/notifications/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    // eslint-disable-next-line
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}
