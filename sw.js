self.addEventListener('fetch', (event) => {
    console.log(event);
    event.respondWith(
        fetch(event.request).catch(err=>{
            return caches.match('./offline.html')
        })
    )
})

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('main-cache', (cache) => {
            console.log('ok');
            return cache.add('/offline.html')
        })
    )
});