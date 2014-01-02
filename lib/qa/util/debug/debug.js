


/**
 * Шаг вывода передаваемого значения в консоль.
 *
 * @see console.log
 *
 * @param {async.Input} input Передаваемое значение.
 * @param {!async.CompleteHandler} complete Обработчик результата.
 * @param {!async.ErrorHandler} cancel Обработчик ошибки.
 */
qa.util.debug.log = function(input, complete, cancel) {
  console.log(input);
  complete(input);
};
