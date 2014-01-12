


/**
 * Интерфейс результата теста.
 *
 * Резульатат теста определяется количеством утверждений, количеством ошибок и
 * булевым значением успешности результата.
 *
 * @see qa.assert
 * @see qa.run
 *
 * @interface
 */
qa.result.IResult = function() {};


/**
 * Получение количества утвержений.
 *
 * @return {number} Количество утвержденний.
 */
qa.result.IResult.prototype.getAssertionCount = function() {};


/**
 * Получение количества ошибок.
 *
 * @return {number} Количество ошибок.
 */
qa.result.IResult.prototype.getFailCount = function() {};


/**
 * Проверка успешности результата.
 *
 * @return {boolean} Результат проверки.
 */
qa.result.IResult.prototype.get = function() {};
