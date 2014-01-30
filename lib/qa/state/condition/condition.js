

/**
 * Создание шага условияравенства выбранного значения значению найденному
 * по указанному пути.
 *
 * @param {string} path Путь выбора значения.
 * @param {*} value Значение для сравнения.
 * @return {!async.ConditionStep} Созданный шаг условия.
 */
qa.state.condition.equalsTo = function(path, value) {
  var tokens = path.split(qa.state.PATH_SEPARATOR);

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} input Передаваемое значение.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function condition(input, complete, cancel) {
    complete(value === this.get(tokens));
  }

  return condition;
};
