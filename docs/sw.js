const CACHE_NAME="2024-07-23 08:30",urlsToCache=["/chess-clock/","/chess-clock/mp3/warning1.mp3","/chess-clock/mp3/menu1.mp3","/chess-clock/mp3/decision3.mp3","/chess-clock/index.js"];self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(e=>e.addAll(urlsToCache)))}),self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(t=>t||fetch(e.request)))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.filter(e=>e!==CACHE_NAME).map(e=>caches.delete(e)))))})