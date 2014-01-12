

/**
 * Шаг копирования передаваемого входного значения.
 *
 * @param {async.Input} input Данные.
 * @param {!async.CompleteHandler} complete Обработчик результата.
 * @param {!async.ErrorHandler} cancel Обработчик ошибки.
 */
qa.util.clone = function(input, complete, cancel) {
  try {
    complete(util.clone(input));
  } catch (error) {
    cancel(error.message);
  }
};
