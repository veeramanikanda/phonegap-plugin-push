'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global cordova:false */
/* globals window */

/*!
 * Module dependencies.
 */

var exec = cordova.require('cordova/exec');

var PushNotification = function () {
  /**
   * PushNotification constructor.
   *
   * @param {Object} options to initiate Push Notifications.
   * @return {PushNotification} instance that can be monitored and cancelled.
   */

  function PushNotification(options) {
    var _this = this;

    _classCallCheck(this, PushNotification);

    this.handlers = {
      registration: [],
      notification: [],
      error: []
    };

    // require options parameter
    if (typeof options === 'undefined') {
      throw new Error('The options argument is required.');
    }

    // store the options to this object instance
    this.options = options;

    // triggered on registration and notification
    var success = function success(result) {
      if (result && typeof result.registrationId !== 'undefined') {
        _this.emit('registration', result);
      } else if (result && result.additionalData && typeof result.additionalData.callback !== 'undefined') {
        var executeFunctionByName = function executeFunctionByName(functionName, context) {
          for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            args[_key - 2] = arguments[_key];
          }

          var namespaces = functionName.split('.');
          var func = namespaces.pop();
          for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
          }
          return context[func].apply(context, args);
        };

        executeFunctionByName(result.additionalData.callback, window, result);
      } else if (result) {
        _this.emit('notification', result);
      }
    };

    // triggered on error
    var fail = function fail(msg) {
      var e = typeof msg === 'string' ? new Error(msg) : msg;
      _this.emit('error', e);
    };

    // wait at least one process tick to allow event subscriptions
    setTimeout(function () {
      exec(success, fail, 'PushNotification', 'init', [options]);
    }, 10);
  }

  /**
   * Unregister from push notifications
   */


  _createClass(PushNotification, [{
    key: 'unregister',
    value: function unregister(successCallback) {
      var _this2 = this;

      var errorCallback = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];
      var options = arguments[2];

      if (typeof errorCallback !== 'function') {
        console.log('PushNotification.unregister failure: failure parameter not a function');
        return;
      }

      if (typeof successCallback !== 'function') {
        console.log('PushNotification.unregister failure: success callback parameter must be a function');
        return;
      }

      var cleanHandlersAndPassThrough = function cleanHandlersAndPassThrough() {
        if (!options) {
          _this2.handlers = {
            registration: [],
            notification: [],
            error: []
          };
        }
        successCallback();
      };

      exec(cleanHandlersAndPassThrough, errorCallback, 'PushNotification', 'unregister', [options]);
    }

    /**
     * Call this to set the application icon badge
     */

  }, {
    key: 'setApplicationIconBadgeNumber',
    value: function setApplicationIconBadgeNumber(successCallback) {
      var errorCallback = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];
      var badge = arguments[2];

      if (typeof errorCallback !== 'function') {
        console.log('PushNotification.setApplicationIconBadgeNumber failure: failure parameter not a function');
        return;
      }

      if (typeof successCallback !== 'function') {
        console.log('PushNotification.setApplicationIconBadgeNumber failure: success callback parameter must be a function');
        return;
      }

      exec(successCallback, errorCallback, 'PushNotification', 'setApplicationIconBadgeNumber', [{ badge: badge }]);
    }

    /**
     * Get the application icon badge
     */

  }, {
    key: 'getApplicationIconBadgeNumber',
    value: function getApplicationIconBadgeNumber(successCallback) {
      var errorCallback = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

      if (typeof errorCallback !== 'function') {
        console.log('PushNotification.getApplicationIconBadgeNumber failure: failure parameter not a function');
        return;
      }

      if (typeof successCallback !== 'function') {
        console.log('PushNotification.getApplicationIconBadgeNumber failure: success callback parameter must be a function');
        return;
      }

      exec(successCallback, errorCallback, 'PushNotification', 'getApplicationIconBadgeNumber', []);
    }

    /**
     * Clear all notifications
     */

  }, {
    key: 'clearAllNotifications',
    value: function clearAllNotifications(successCallback) {
      var errorCallback = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

      if (typeof errorCallback !== 'function') {
        console.log('PushNotification.clearAllNotifications failure: failure parameter not a function');
        return;
      }

      if (typeof successCallback !== 'function') {
        console.log('PushNotification.clearAllNotifications failure: success callback parameter must be a function');
        return;
      }

      exec(successCallback, errorCallback, 'PushNotification', 'clearAllNotifications', []);
    }
    /**
     * Listen for an event.
     *
     * The following events are supported:
     *
     *   - registration
     *   - notification
     *   - error
     *
     * @param {String} eventName to subscribe to.
     * @param {Function} callback triggered on the event.
     */

  }, {
    key: 'on',
    value: function on(eventName, callback) {
      if (this.handlers.hasOwnProperty(eventName)) {
        this.handlers[eventName].push(callback);
      }
    }

    /**
     * Remove event listener.
     *
     * @param {String} eventName to match subscription.
     * @param {Function} handle function associated with event.
     */

  }, {
    key: 'off',
    value: function off(eventName, handle) {
      if (this.handlers.hasOwnProperty(eventName)) {
        var handleIndex = this.handlers[eventName].indexOf(handle);
        if (handleIndex >= 0) {
          this.handlers[eventName].splice(handleIndex, 1);
        }
      }
    }

    /**
     * Emit an event.
     *
     * This is intended for internal use only.
     *
     * @param {String} eventName is the event to trigger.
     * @param {*} all arguments are passed to the event listeners.
     *
     * @return {Boolean} is true when the event is triggered otherwise false.
     */

  }, {
    key: 'emit',
    value: function emit() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var eventName = args.shift();

      if (!this.handlers.hasOwnProperty(eventName)) {
        return false;
      }

      for (var i = 0, length = this.handlers[eventName].length; i < length; i++) {
        var callback = this.handlers[eventName][i];
        if (typeof callback === 'function') {
          callback.apply(undefined, args);
        } else {
          console.log('event handler: ' + eventName + ' must be a function');
        }
      }

      return true;
    }
  }, {
    key: 'finish',
    value: function finish() {
      var successCallback = arguments.length <= 0 || arguments[0] === undefined ? function () {} : arguments[0];
      var errorCallback = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];
      var id = arguments.length <= 2 || arguments[2] === undefined ? 'handler' : arguments[2];

      if (typeof successCallback !== 'function') {
        console.log('finish failure: success callback parameter must be a function');
        return;
      }

      if (typeof errorCallback !== 'function') {
        console.log('finish failure: failure parameter not a function');
        return;
      }

      exec(successCallback, errorCallback, 'PushNotification', 'finish', [id]);
    }
  }]);

  return PushNotification;
}();

/*!
 * Push Notification Plugin.
 */

module.exports = {
  /**
   * Register for Push Notifications.
   *
   * This method will instantiate a new copy of the PushNotification object
   * and start the registration process.
   *
   * @param {Object} options
   * @return {PushNotification} instance
   */

  init: function init(options) {
    return new PushNotification(options);
  },

  hasPermission: function hasPermission(successCallback, errorCallback) {
    exec(successCallback, errorCallback, 'PushNotification', 'hasPermission', []);
  },

  /**
   * PushNotification Object.
   *
   * Expose the PushNotification object for direct use
   * and testing. Typically, you should use the
   * .init helper method.
   */
  PushNotification: PushNotification
};