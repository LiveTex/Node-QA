


/**
 * @interface
 */
qa.log.IEventIterator = function() {};


/**
 * @param {function(!qa.log.Event=)} callback Обработчик получения.
 */
qa.log.IEventIterator.prototype.next = function(callback) {};


/**
 *
 */
qa.log.IEventIterator.prototype.destroy = function() {};
