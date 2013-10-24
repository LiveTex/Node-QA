


/**
 * @interface
 */
qa.business.comm.IConnection = function() {};


/**
 * @param {string} payload Message.
 */
qa.business.comm.IConnection.prototype.write = function(payload) {};


/**
 * Connects channel.
 */
qa.business.comm.IConnection.prototype.connect = function() {};


/**
 * Destroys channel.
 */
qa.business.comm.IConnection.prototype.destroy = function() {};


/**
 * @param {qa.business.comm.Message} message Request message.
 * @param {function(qa.business.comm.Message)} complete Success handler.
 * @param {function(string, number)} cancel Error handler.
 */
qa.business.comm.IConnection.prototype.request =
    function(message, complete, cancel) {};


/**
 * Sets callback for an event.
 * @param {string} event Event type.
 * @param {function(qa.business.comm.Message)} callback Event listener.
 */
qa.business.comm.IConnection.prototype.setCallback = function(event, callback) {};
