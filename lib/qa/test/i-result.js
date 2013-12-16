

/**
 * @interface
 */
qa.test.IResult = function() {};


/**
 * @return {number} Количество утвержденний.
 */
qa.test.IResult.prototype.getAssertionCount = function() {};


/**
 * @return {number} Количество провальных утверждений.
 */
qa.test.IResult.prototype.getFailCount = function() {};
