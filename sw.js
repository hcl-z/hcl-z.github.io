self.addEventListener('fetch', (event) => {
    // if (/\.jpg$|\.png$/.test(event.request.url)) {
    //     let supportWebp = false;
    //     if (event.request.headers.has('accept')) {
    //         supportWebp = event.request.headers.get('accept').includes('webp')
    //     }
    //     // if (supportWebp) {
    //     //     let reqClone = event.request.clone()
    //     //     let returnUrl = reqClone.url.substr(0, reqClone.url.lastIndexOf('.')) + '.webp'
    //     //     event.respondWith(
    //     //         fetch(returnUrl, {
    //     //             mode:'no-cors'
    //     //         }))
    //     // }
    // }
    event.respondWith(
        caches.match(event.request)
            .then(res => {
                if (res) return res
                let requestClone = event.request.clone()

                return fetch(requestClone)
                    .then(data => {
                        let responseClone = data.clone()
                        caches.open('main-cache')
                            .then(cache => {
                                //console.log(requestClone, responseClone);
                                cache.put(requestClone, responseClone).catch((err)=>{})
                            })
                        return data
                    })
                    .catch(() => {
                        return caches.match('./offline.html')
                    })
            })
    )
})

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('main-cache').then(cache => {
            cache.addAll(['/offline.html', 'tawindcss.css', 'cat.jpg'])
        })
    )
    //self.skipWaiting();
});

// self.addEventListener('activate', (event) => {
//     event.waitUntil(self.clients.claim())
// })