


/**
 * @interface
 */
qa.test.IContext = function() {};


/**
 * @param {!qa.test.IResult} result Результат теста.
 * @param {!Array.<string>} tags Метки реультата.
 */
qa.test.IContext.prototype.passResult = function(result, tags) {};


/**
 * @return {!qa.test.IResult} Резульатат теста.
 */
qa.test.IContext.prototype.getResult = function() {};


/**
 * @return {!qa.db.Node} Не имя.
 */
qa.test.IContext.prototype.getDataNode = function() {};
