


/**
 * @interface
 * @extends {util.ISafeObject}
 */
qa.context.ITestContext = function() {};


/**
 * @param {boolean} assertion Утверждение.
 * @param {string} comment Комментарий.
 */
qa.context.ITestContext.prototype.assert = function(assertion, comment) {};


/**
 * @param {string} error Ошибка.
 * @param {number=} opt_code Код ошибки.
 */
qa.context.ITestContext.prototype.exception = function(error, opt_code) {};


/**
 *
 */
qa.context.ITestContext.prototype.timeout = function() {};


/**
 * @param {*} data Не имя.
 * @return {!Array.<!qa.ReportItem>} Не имя.
 */
qa.context.ITestContext.prototype.report = function(data) {};
