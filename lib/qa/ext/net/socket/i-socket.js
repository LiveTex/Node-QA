


/**
 * @interface
 * @extends {events.IEventEmitter}
 *
 * @event message
 * @event destroy
 */
qa.ext.net.socket.ISocket = function() {};


/**
 * @param {!Object=} opt_options Socket settings (port, host, etc).
 */
qa.ext.net.socket.ISocket.prototype.connect = function(opt_options) {};


/**
 *
 */
qa.ext.net.socket.ISocket.prototype.pause = function() {};


/**
 *
 */
qa.ext.net.socket.ISocket.prototype.resume = function() {};


/**
 * @param {string} message Сообщение.
 */
qa.ext.net.socket.ISocket.prototype.send = function(message) {};


/**
 *
 */
qa.ext.net.socket.ISocket.prototype.destroy = function() {};
