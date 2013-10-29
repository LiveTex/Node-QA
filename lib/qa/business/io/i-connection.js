


/**
 * @interface
 */
qa.business.io.IConnection = function() {};


/**
 * @param {!qa.business.io.Message} message Message.
 */
qa.business.io.IConnection.prototype.write = function(message) {};


/**
 * Destroys channel.
 */
qa.business.io.IConnection.prototype.destroy = function() {};


/**
 * @param {!qa.business.io.Message} message Request message.
 * @param {function(qa.business.io.Message)} complete One-time callback
 *   for request`s response.
 * @param {function(string, number=)} cancel Error handler.
 * @param {string=} opt_callbackType Request type for callback.
 */
qa.business.io.IConnection.prototype.request =
    function(message, complete, cancel, opt_callbackType) {};


/**
 * Sets callback for an event.
 * @param {string} event Event type.
 * @param {function(qa.business.io.Message)} callback Event listener.
 * @return {!ds.queue.QueueItem} Callback item (to remove).
 */
qa.business.io.IConnection.prototype.setCallback =
    function(event, callback) {};


/**
 * @param {string} type Callback type.
 * @param {!ds.queue.QueueItem} callbackItem Callback item
 *   (returned by setCallback).
 */
qa.business.io.IConnection.prototype.removeCallback =
    function(type, callbackItem) {};
