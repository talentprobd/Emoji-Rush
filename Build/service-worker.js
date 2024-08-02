self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('rusher-cache').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/Build/Experiment.data.br',
          '/Build/Experiment.framework.js.br',
          '/Build/Experiment.wasm.br',
          '/StreamingAssets', // Add any other assets you want to cache
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        // Modify request URL to fetch Brotli compressed files
        let requestUrl = event.request.url;
        if (requestUrl.endsWith('.js') || requestUrl.endsWith('.wasm') || requestUrl.endsWith('.data')) {
          requestUrl += '.br';
        }
  
        return fetch(requestUrl).then((fetchResponse) => {
          return caches.open('rusher-cache').then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  });
  