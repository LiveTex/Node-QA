


/**
 * Интерфейс накопителя результатов теста.
 *
 * @see qa.result.IResult
 *
 * @interface
 */
qa.result.IFolder = function() {};


/**
 * Получение результата теста накопителем.
 *
 * Получению результата сопуствует упорядоченный набор меток результата,
 * необходимый для соотствующей обработчки накопителем.
 *
 * @param {!qa.result.IResult} result Результат теста.
 * @param {!Array.<string|number>} tags Метки реультата.
 */
qa.result.IFolder.prototype.passResult = function(result, tags) {};


/**
 * Получение результата накопления.
 *
 * Результат накопления так же является результатом теста.
 *
 * @return {!qa.result.IResult} Резульатат накопления.
 */
qa.result.IFolder.prototype.getResult = function() {};
