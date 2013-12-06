


/**
 * @interface
 */
qa.business.io.IConnection = function() {};


/**
 * @param {string} type Request type.
 * @param {!Object} data Request data.
 */
qa.business.io.IConnection.prototype.write = function(type, data) {};


/**
 * Destroys channel.
 */
qa.business.io.IConnection.prototype.destroy = function() {};


/**
 * @param {string} type Request type.
 * @param {!Object} data Request data.
 * @param {function(!Object)} complete One-time callback for request`s response.
 * @param {function(string, number=)} cancel Error handler.
 * @param {string=} opt_callbackType Request type for callback.
 */
qa.business.io.IConnection.prototype.request =
    function(type, data, complete, cancel, opt_callbackType) {};


/**
 * Sets one-time callback for an event.
 * @param {string} event Event type.
 * @param {function(!Object)} callback Event listener.
 */
qa.business.io.IConnection.prototype.setCallback =
    function(event, callback) {};
