


/**
 * @interface
 */
qa.business.comm.IConnection = function() {};


/**
 * @param {qa.business.comm.Message} message Message.
 */
qa.business.comm.IConnection.prototype.write = function(message) {};


/**
 * Destroys channel.
 */
qa.business.comm.IConnection.prototype.destroy = function() {};


/**
 * @param {qa.business.comm.Message} message Request message.
 * @param {function(qa.business.comm.Message)} complete One-time callback
 *   for request`s response.
 * @param {function(string, number=)} cancel Error handler.
 * @param {string=} opt_callbackType Request type for callback.
 */
qa.business.comm.IConnection.prototype.request =
    function(message, complete, cancel, opt_callbackType) {};


/**
 * Sets callback for an event.
 * @param {string} event Event type.
 * @param {function(qa.business.comm.Message)} callback Event listener.
 * @return {!ds.queue.QueueItem} Callback item (to remove).
 */
qa.business.comm.IConnection.prototype.setCallback =
    function(event, callback) {};


/**
 * @param {string} type Callback type.
 * @param {!ds.queue.QueueItem} callbackItem Callback item
 *   (returned by setCallback).
 */
qa.business.comm.IConnection.prototype.removeCallback =
    function(type, callbackItem) {};
