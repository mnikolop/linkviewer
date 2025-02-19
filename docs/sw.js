var APP_PREFIX = 'LinkViewer'     // Identifier for this app (this needs to be consistent across every cache update)
var VERSION = 'version1'              // Version of the off-line cache (change this value everytime you want to update cache)
var CACHE_NAME = APP_PREFIX + VERSION
var URLS = [                            // Add URL you want to cache in this list.
//  '/linkviewer/',                     // If you have separate JS/CSS files,
//  '/linkviewer/index.html',
  '/linkviewer/data/index.json',
  '/linkviewer/data/links.json'
]

// Respond with cached resources
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { // if cache is available, respond with cache
        console.log('responding with cache : ' + e.request.url)
        return request
      } else {       // if there are no cache, try fetching request
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request)
      }

      // You can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    })
  )
})

// Cache index.html
self.importScripts('js/sw-toolbox.js');
self.addEventListener('message', event => {
  if (event.data) {
  //  let data = JSON.parse(event.data); // parse the message back to JSON
    if (event.data == "CacheIndex") { // check the action
      var toolbox = self.toolbox;
      //self.toolbox.cache(["/linkviewer/index.html"]); // here you can use sw-toolbox or anything to cache your stuff.
      // Get URL objects for each client's location.
      self.clients.matchAll({includeUncontrolled: true}).then(clients => {
        for (const client of clients) {
          const clientUrl = new URL(client.url);
          var j = 0;
        }
      });

      caches.open(CACHE_NAME).then(function (cache) {
        console.log('Adding loaded index.html : ' + CACHE_NAME)
        return cache.put(["/linkviewer/"]);
      })
    }
  }
});

// Cache resources
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(URLS)
    })
  )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create white list
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      // add current cache name to white list
      cacheWhitelist.push(CACHE_NAME)

      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i] )
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})
