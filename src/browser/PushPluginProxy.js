module.exports = {
    init: function(onSuccess, onFail, args) {
        console.log('*** push plugin init');

        if ("serviceWorker" in navigator) {
            console.log("Service Worker is supported");
            // var ServiceWorker = require('phonegap-plugin-push.ServiceWorker');

            navigator.serviceWorker.register('ServiceWorker.js').then(function() {
                return navigator.serviceWorker.ready;
            })
            .then(function(reg) {
                console.log("Service Worker is ready: ");
                console.log(reg);
                reg.pushManager.subscribe({userVisibleOnly: true}).then(function(sub) {
                    console.log('endpoint: ');
                    console.log(sub.endpoint);
                }).catch(function(error) {
                    console.log('*** subscription error');
                    console.log(error);
                });
            }).catch(function(error) {
                console.log("Service Worker error: ");
                console.log(error);
            });
        } else {
            console.log('Service Worker is not supported');
        }
    },
    unregister: function(onSuccess, onFail, args) {
        console.log('*** push plugin unregister');
    }
};

require("cordova/exec/proxy").add("PushNotification", module.exports);
