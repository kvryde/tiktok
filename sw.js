const C='reels-v1',CORE=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
const CDN=['www.gstatic.com','fonts.googleapis.com','fonts.gstatic.com'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(C).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET')return;
  if(u.origin===location.origin){
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(C).then(x=>x.put(r,c));return res})
      .catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
  }else if(CDN.includes(u.hostname)){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const c=res.clone();caches.open(C).then(x=>x.put(r,c));return res})));
  }
});
