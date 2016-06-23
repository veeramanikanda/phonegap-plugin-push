var messageChannel;

self.addEventListener('install', function(event) {
    self.skipWaiting();
    console.log('SW Installed', event);
});

self.addEventListener('activate', function(event) {
    console.log('*** Activated', event);
});

self.addEventListener('push', function(event) {
    console.log('Push message received', event);
    messageChannel.ports[0].postMessage(event.data);
});

self.addEventListener('message', function(event) {
    console.log('SW Received Message: ', event.data);
    console.log(event);
    messageChannel = event;
});
