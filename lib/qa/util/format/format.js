



/**
 * Шаг раскодирования JSON строки.
 *
 * @param {string} input Передаваемое значение.
 * @param {!async.CompleteHandler} complete Обработчик результата.
 * @param {!async.ErrorHandler} cancel Обработчик ошибки.
 */
qa.util.format.decodeJson = function(input, complete, cancel) {
  try {
    complete(JSON.parse(input));
  } catch (error) {
    cancel(error.message);
  }
};