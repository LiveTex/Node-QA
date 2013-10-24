


/**
 * @interface
 * @event {string} data Data received.
 * @event {} close Connection closed.
 */
qa.business.IConnection = function() {};


/**
 * @param {string} payload Message.
 */
qa.business.IConnection.prototype.write = function(payload) {};


/**
 * Connects channel.
 */
qa.business.IConnection.prototype.connect = function() {};


/**
 * Destroys channel.
 */
qa.business.IConnection.prototype.destroy = function() {};


/**
 * @param {qa.business.Message} message Request message.
 * @param {function(qa.business.Message)} complete Success handler.
 * @param {function(string, number)} cancel Error handler.
 */
qa.business.IConnection.prototype.request =
    function(message, complete, cancel) {};


/**
 * Sets callback for an event.
 * @param {string} event Event type.
 * @param {function(qa.business.Message)} callback Event listener.
 */
qa.business.IConnection.prototype.setCallback = function(event, callback) {};
