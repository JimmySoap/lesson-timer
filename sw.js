const CACHE="ta-timer-v5";
const ASSETS=[".","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  // Network-first for the page itself so a schedule change shows up on the next open;
  // fall back to cache only when offline. Icons/manifest stay cache-first (fast).
  if(e.request.mode==="navigate"||e.request.destination==="document"){
    e.respondWith(
      fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(ca=>ca.put(e.request,c));return r;})
      .catch(()=>caches.match(e.request).then(r=>r||caches.match("index.html")))
    );
  }else{
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
  }
});
