


/**
 * @interface
 */
qa.test.IContext = function() {};


/**
 * @return {string} Имя.
 */
qa.test.IContext.prototype.getName = function() {};


/**
 * @return {!qa.db.Node} Не имя.
 */
qa.test.IContext.prototype.getDataNode = function() {};


/**
 * @return {!qa.log.IEventLog} Не имя.
 */
qa.test.IContext.prototype.getEventLog = function() {};
