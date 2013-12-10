


/**
 * @interface
 */
qa.test.IContext = function() {};


/**
 * @return {!qa.test.IContext} Корневой контекст.
 */
qa.test.IContext.prototype.getRoot = function() {};


/**
 * @return {qa.test.IContext} Родительский контекст.
 */
qa.test.IContext.prototype.getParent = function() {};


/**
 * @return {string} Имя.
 */
qa.test.IContext.prototype.getName = function() {};


/**
 * @return {!util.ISafeObject} Не имя.
 */
qa.test.IContext.prototype.getStorage = function() {};


/**
 * @return {!qa.log.IEventLog} Не имя.
 */
qa.test.IContext.prototype.getEventLog = function() {};
