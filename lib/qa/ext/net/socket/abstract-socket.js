


/**
 * @constructor
 * @extends {events.EventEmitter}
 *
 * @event message
 * @event destroy
 */
qa.ext.net.socket.AbstractSocket = function() {
  events.EventEmitter.call(this);
};

util.inherits(qa.ext.net.socket.AbstractSocket, events.EventEmitter);


/**
 *
 */
qa.ext.net.socket.AbstractSocket.prototype.pause = function() {};


/**
 *
 */
qa.ext.net.socket.AbstractSocket.prototype.resume = function() {};


/**
 * @param {string} message Сообщение.
 */
qa.ext.net.socket.AbstractSocket.prototype.send = function(message) {};


/**
 *
 */
qa.ext.net.socket.AbstractSocket.prototype.destroy = function() {};
