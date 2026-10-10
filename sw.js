// 练习打卡 PWA 离线缓存
// 首页(index.html)用「网络优先」：在线时总是取最新版，离线时才回退缓存；
// 静态资源(图标/manifest)用「缓存优先」：快且稳定。
var CACHE = "lianxi-v4";
var FILES = ["./", "./index.html", "./manifest.json", "./icon.svg", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./favicon-32.png"];
self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){if(k!==CACHE)return caches.delete(k);}));}).then(function(){return self.clients.claim();}));
});
self.addEventListener("fetch", function(e){
  if(e.request.method !== "GET") return;
  // 页面导航：网络优先，离线回退
  if(e.request.mode === "navigate"){
    e.respondWith(
      fetch(e.request).then(function(resp){
        var copy = resp.clone();
        caches.open(CACHE).then(function(c){c.put("./index.html", copy);});
        return resp;
      }).catch(function(){return caches.match("./index.html");})
    );
    return;
  }
  // 其他资源：缓存优先
  e.respondWith(caches.match(e.request).then(function(r){
    return r || fetch(e.request).then(function(resp){
      var copy = resp.clone();
      caches.open(CACHE).then(function(c){c.put(e.request, copy);});
      return resp;
    }).catch(function(){return r;});
  }));
});
