console.log("Background sync plugin added!");
//https://developers.google.com/web/tools/workbox/modules/workbox-background-sync

//send the post requests when online is established
const bgSyncPlugin = new workbox.backgroundSync.Plugin('offline-requests-queue', {
    maxRetentionTime: 24 * 60 // Retry for max of 24 Hours (specified in minutes)
});

// use BG sync for api routes
workbox.routing.registerRoute(
    /\/api\//,
    new workbox.strategies.NetworkOnly({
      plugins: [bgSyncPlugin]
    }),
    'POST'
);

function openDB(){
  // Open the todos DB
  return new Promise((resolve, reject) => {
    var DBOpenRequest = indexedDB.open("todos-db", 1);
    DBOpenRequest.onsuccess = (event) => {
      db = DBOpenRequest.result;
      var objectStore = db.transaction(["all-todos"], "readwrite").objectStore("all-todos");
      // Make a request to get all records
      var objectStoreRequest = objectStore.getAll();
      objectStoreRequest.onsuccess = (event) => {
        resolve(objectStoreRequest.result);
      }
      objectStoreRequest.onerror = (err) => {
        reject(err);
      }
    }
  });
}

workbox.routing.registerRoute(/\/api\/getEverything/, async ({ url, event, params }) => {
  try {
    let res = await fetch(event.request);
    res = await res.json();
    return await new Response(JSON.stringify(res)); //fall through to normal network request if online
  }
  //error with response, load from indexed DB
  catch (err) {
    return openDB().then(res => {
      return new Response(JSON.stringify({ status: 2, results: res})); //respond  with whats in IDB if offline
    })
  }
});