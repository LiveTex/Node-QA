
/**
 * @param {!async.Step} actor Сценарии тестирования.
 * @param {string} comment Не имя.
 * @return {!async.Step} Тест.
 */
qa.assert.success = function(actor, comment) {

  /**
   * @this {qa.db.Node}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function assert(data, complete, cancel) {
    var test = this.getCase();

    /**
     * @param {*} data Данные.
     */
    function localComplete(data) {
      test.passAssertion(true, comment);
      complete(data);
    }

    /**
     * @param {string} error
     * @param {number=} opt_code
     */
    function localCancel(error, opt_code) {
      test.passAssertion(false, error);
      cancel(error, opt_code);
    }

    actor.call(this, data, localComplete, localCancel);
  }

  return assert;
};


/**
 * @param {!async.Step} step Сценарии тестирования.
 * @param {string} comment Не имя.
 * @return {!async.Step} Тест.
 */
qa.assert.fail = function(step, comment) {

  /**
   * @this {qa.db.Node}
   * @param {*} input Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function assert(input, complete, cancel) {
    var test = this.getCase();
    var done = false;

    /**
     * @param {string} error
     * @param {number=} opt_code
     */
    function localCancel(error, opt_code) {
      if (!done) {
        done = true;
        test.passAssertion(true, error);
        complete(input);
      }
    }

    /**
     * @param {*} data Данные.
     */
    function localComplete(data) {
      test.passAssertion(false, comment);
      cancel(comment);
    }

    step.call(this, input, localComplete, localCancel);
  }

  return assert;
};


/**
 * @param {*} value Не имя.
 * @param {string} comment Не имя.
 * @return {!async.Step} Тест.
 */
qa.assert.equals = function(value, comment) {

  /**
   * @this {qa.db.Node}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function assert(data, complete, cancel) {
    var assertion = data === value;

    this.getCase()
        .passAssertion(assertion, comment);

    if (assertion) {
      complete(data);
    } else {
      cancel(comment);
    }
  }

  return assert;
};


/**
 * @param {(string|!Object)} type Тип.
 * @param {string} comment Не имя.
 * @return {!async.Step} Тест.
 */
qa.assert.type = function(type, comment) {

  /**
   * @this {qa.db.Node}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function assert(data, complete, cancel) {
    var assertion = typeof data === type ||
        type instanceof Object && data instanceof type;

    this.getCase()
        .passAssertion(assertion, comment);

    if (assertion) {
      complete(data);
    } else {
      cancel(comment);
    }
  }

  return assert;
};
