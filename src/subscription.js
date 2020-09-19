/**
 * conforms to both Apis (promise or callback)
 */
export function askPermission() {
    return new Promise(function (resolve, reject) {
        const permissionResult = Notification.requestPermission(function (result) {
            resolve(result);
        });
        if (permissionResult) {
            permissionResult.then(resolve, reject);
        }
    }).then(result => {
        if (result !== 'granted') {
            alert('Notication permission denied\nIf it was by mistake, turn it on in settings')
            return false
        }
        return true
    })
}

export function subscribeUserToPush() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(function (registration) {
            if (!registration.pushManager) {
                console.log('Push manager unavailable.')
                return
            }

            registration.pushManager.getSubscription().then(function (existingSubscription) {
                if (existingSubscription === null) {
                    console.info('No subscription detected, make a request.')
                    const subscribeOptions = {
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(
                            'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
                        )
                    };
                    registration.pushManager.subscribe(subscribeOptions).then(function (newSubscription) {
                        console.log('New subscription added.', newSubscription)
                        return newSubscription
                        // sendSubscription(newSubscription)
                    }).catch(function (e) {
                        if (Notification.permission !== 'granted') {
                            console.info('Permission was not granted.')
                        } else {
                            console.error('An error ocurred during the subscription process.', e)
                        }
                    })
                } else {
                    console.info('Existing subscription detected.', existingSubscription)
                    return existingSubscription
                }
            })
        })
            .catch(function (e) {
                console.error('An error ocurred during Service Worker registration.', e)
            })
    }
}


function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4)
    // eslint-disable-next-line
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}