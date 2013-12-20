


/**
 * @interface
 */
qa.ICase = function() {};


/**
 * @param {!qa.IResult} result Результат теста.
 * @param {!Array.<string>} tags Метки реультата.
 */
qa.ICase.prototype.passResult = function(result, tags) {};


/**
 * @return {!qa.IResult} Резульатат теста.
 */
qa.ICase.prototype.getResult = function() {};
