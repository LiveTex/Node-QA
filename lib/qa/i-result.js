

/**
 * @interface
 */
qa.IResult = function() {};


/**
 * @return {number} Количество утвержденний.
 */
qa.IResult.prototype.getAssertionCount = function() {};


/**
 * @return {number} Количество провальных утверждений.
 */
qa.IResult.prototype.getFailCount = function() {};


/**
 * @return {boolean} Резульатат.
 */
qa.IResult.prototype.get = function() {};
