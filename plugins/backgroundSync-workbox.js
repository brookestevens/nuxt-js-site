console.log("Back ground sync");
//https://developers.google.com/web/tools/workbox/modules/workbox-background-sync

const bgSyncPlugin = new workbox.backgroundSync.Plugin('myQueueName', {
    maxRetentionTime: 24 * 60 // Retry for max of 24 Hours (specified in minutes)
});

workbox.routing.registerRoute(
    /\/api\/.*\/*.json/,
    new workbox.strategies.NetworkOnly({
      plugins: [bgSyncPlugin]
    }),
    'POST'
);