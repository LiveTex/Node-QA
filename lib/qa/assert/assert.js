


/**
 * Шаг утверждения.
 *
 * Шаг утверждения выполняется в контексте узла дерева состояния и добавляет
 * в соответсвующий накопитель новый результат теста.
 *
 * @see qa.state.Node
 * @see qa.result.IResult
 *
 * @typedef {async.Step}
 */
qa.assert.Step;


/**
 * Создание шага утверждения об успешном выполнении сценария.
 *
 * @param {!async.Scenario} scenario Сценарии тестирования.
 * @param {string} comment Комментарий к утверждению.
 * @return {!qa.assert.Step} Созданный шаг утверждения.
 */
qa.assert.success = function(scenario, comment) {

  /**
   * @this {qa.state.Node}
   * @param {async.Input} input Данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function assert(input, complete, cancel) {
    var folder = this.getFolder();

    /**
     * @param {*} data Данные.
     */
    function localComplete(data) {
      folder.passAssertion(true, comment);
      complete(data);
    }

    /**
     * @param {string} error
     * @param {number=} opt_code
     */
    function localCancel(error, opt_code) {
      folder.passAssertion(false, error);
      cancel(error, opt_code);
    }

    scenario.call(this, input, localComplete, localCancel);
  }

  return assert;
};


/**
 * Создание шага утверждения об выполнении сценария с ошибкой.
 *
 * @param {!async.Scenario} scenario Сценарии тестирования.
 * @param {string} comment Комментарий к утверждению.
 * @return {!qa.assert.Step} Созданный шаг утверждения.
 */
qa.assert.fail = function(scenario, comment) {

  /**
   * @this {qa.state.Node}
   * @param {async.Input} input Данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function assert(input, complete, cancel) {
    var test = this.getFolder();
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

    scenario.call(this, input, localComplete, localCancel);
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
   * @this {qa.state.Node}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function assert(data, complete, cancel) {
    var assertion = data === value;

    this.getFolder()
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
   * @this {qa.state.Node}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function assert(data, complete, cancel) {
    var assertion = typeof data === type ||
        type instanceof Object && data instanceof type;

    this.getFolder()
        .passAssertion(assertion, comment);

    if (assertion) {
      complete(data);
    } else {
      cancel(comment);
    }
  }

  return assert;
};
