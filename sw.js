// 练习打卡 PWA 离线缓存（仅缓存自身单文件，保证断网也能打开）
var CACHE = "lianxi-v1";
var FILES = ["./", "./index.html", "./manifest.json", "./icon.svg", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./favicon-32.png"];
self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){if(k!==CACHE)return caches.delete(k);}));}).then(function(){return self.clients.claim();}));
});
self.addEventListener("fetch", function(e){
  if(e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(function(r){
    return r || fetch(e.request).then(function(resp){
      return caches.open(CACHE).then(function(c){c.put(e.request, resp.clone());return resp;});
    }).catch(function(){return r;});
  }));
});
