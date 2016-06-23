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

    // Need to figure out a way to make these configurable
    var title = 'Title';
    var body = 'Message';
    var icon = 'https://avatars1.githubusercontent.com/u/60365?v=3&s=200';
    var tag = 'simple-push-demo-notification-tag';

    event.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            icon: icon,
            tag: tag
        })
    );

    var pushData = {
        title: 'Title',
        message: 'Message',
        count: 1,
        sound: 'default',
        additionalData: {}
    };
    messageChannel.ports[0].postMessage(pushData);

});

self.addEventListener('message', function(event) {
    console.log('SW Received Message: ', event.data);
    console.log(event);
    messageChannel = event;
});
