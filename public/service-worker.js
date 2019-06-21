/*
 * @license
 * Your First PWA Codelab (https://g.co/codelabs/pwa)
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */
'use strict';

// CODELAB: Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-v1';

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
  "/offline.html"
];

self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');
  // CODELAB: Precache static resources here.


  let openCacheStoreItem = async () => {
    let cache = await caches.open(CACHE_NAME)
    console.log("Cache Opened!")
    return await cache.addAll(FILES_TO_CACHE)
  }

  evt.waitUntil(
    openCacheStoreItem()
  )



  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
  // CODELAB: Remove previous cached data from disk.

  let clearCache = async () => {
    let cacheItems = await caches.keys()
    let toRemove = cacheItems.map( item => {
      if ( item !== CACHE_NAME ) {
        console.log("Remove item from cache:" , item)
        return caches.delete(key)
      }
    } ) 
    return Promise.all(toRemove)
  }


  evt.waitUntil(
    clearCache()
  )

  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  console.log('[ServiceWorker] Fetch', evt.request.url);
  // CODELAB: Add fetch event handler here.

  if (evt.request.mode !== "navigate") {
    return
  }


  let interceptNavigation = async () => {
    try {
      let response = await fetch(evt.request)
      return response
    } catch (err) {
      let cache = await caches.open(CACHE_NAME)
      return await cache.match("offline.html")
    }
   

  }



  evt.respondWith(
    interceptNavigation()
  )




  

});
