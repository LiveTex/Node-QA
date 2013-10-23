


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
 * @param {qa.business.Request} request Request.
 * @param {function(Object=)} complete Success handler.
 * @param {function(string, number)} cancel Error handler.
 */
qa.business.IConnection.prototype.request =
    function(request, complete, cancel) {};
