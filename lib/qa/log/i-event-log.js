


/**
 * @interface
 */
qa.log.IEventLog = function() {};


/**
 * @return {!qa.log.IEventIterator} Итератор.
 */
qa.log.IEventLog.prototype.getIterator = function() {};


/**
 * @param {!qa.log.Event} event Событие.
 */
qa.log.IEventLog.prototype.pass = function(event) {};
