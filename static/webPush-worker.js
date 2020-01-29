// Custom notifications -> sent from Express
console.log("Web push script loaded!");

self.addEventListener('push', function (event) {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Nibble!';
  const options = {
    body: 'Yay it works.',
    icon: 'icon.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});