


/**
 * @interface
 */
qa.test.IContext = function() {};


/**
 * @param {!qa.test.IResult} result Результат теста.
 * @param {string} tag Метка реультата.
 * @param {!Array.<string>=} opt_tags Метки реультата.
 */
qa.test.IContext.prototype.passResult = function(result, tag, opt_tags) {};


/**
 * @return {!qa.db.Node} Не имя.
 */
qa.test.IContext.prototype.getDataNode = function() {};
