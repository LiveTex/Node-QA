

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


/**
 * Шаг вывода указанного значения в консоль.
 *
 * @see console.log
 *
 * @param {*} value Указанное значение.
 * @return {!async.Step} Созданный шаг.
 */
qa.util.debug.print = function(value) {

  /**
   * @param {async.Input} input Передаваемое значение.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function print(input, complete, cancel) {
    console.log(value);
    complete(input);
  }

  return print;
};
