

/**
 * @param {string} path Указанный путь.
 * @param {!async.Step} then Шаг выполняемый при успешном результате проверки.
 * @param {!async.Step=} opt_else Шаг вызываемый в случае, если результат
 *    проверки отрицательный.
 * @return {!async.Step}
 */
qa.state.if.equals = function(path, then, opt_else) {
  var tokens = path.split(qa.state.PATH_SEPARATOR);

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} input Передаваемое значение.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function condition(input, complete, cancel) {
    complete(input === this.get(tokens));
  }

  return async.script.if(condition, then, opt_else);
};
