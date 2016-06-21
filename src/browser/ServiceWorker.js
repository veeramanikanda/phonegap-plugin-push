self.addEventListener('install', function(event) {
    self.skipWaiting();
    console.log('SW Installed', event);
});

self.addEventListener('activate', function(event) {
    console.log('*** Activated', event);
});

self.addEventListener('push', function(event) {
    console.log('Push message received', event);
});
