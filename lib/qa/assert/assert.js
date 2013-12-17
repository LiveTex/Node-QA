

/**
 * @param {!async.Step} step Сценарии тестирования.
 * @param {string} comment Не имя.
 * @return {!async.Step} Тест.
 */
qa.assert.fail = function(step, comment) {

  /**
   * @this {qa.test.Context}
   * @param {*} input Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function assert(input, complete, cancel) {
    var context = this;
    var done = false;

    /**
     * @param {string} error
     * @param {number=} opt_code
     */
    function localCancel(error, opt_code) {
      if (!done) {
        done = true;
        context.passAssertion(true, comment);
        complete(input);
      }
    }

    /**
     * @param {*} data Данные.
     */
    function localComplete(data) {
      context.passAssertion(false, comment);
      cancel(comment);
    }

    step.call(this, data, localComplete, localCancel);
  }

  return assert;
};


/**
 * @param {*} value Не имя.
 * @param {string} comment Не имя.
 * @return {!async.Step} Тест.
 */
qa.assert.equalsTo = function(value, comment) {

  /**
   * @this {qa.test.Context}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function assert(data, complete, cancel) {
    var assertion = data === value;

    this.passAssertion(assertion, comment);

    if (assertion) {
      complete(data);
    } else {
      cancel(comment);
    }
  }

  return assert;
};
