// غيّر رقم الإصدار عند كل تحديث ليصل التحديث للمستخدمين
const CACHE='morse-v3';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// شبكة أولاً ثم الذاكرة عند انقطاع الإنترنت؛ لا نتدخل في طلبات المواقع الأخرى (Firebase)
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
});
