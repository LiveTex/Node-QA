

/**
 * Все, что может быть представленно в виде значения.
 *
 * @typedef {*}
 */
qa.assert.Value;


/**
 * Все, что может быть представленно в виде типа значения.
 *
 * @typedef {?string|Object}
 */
qa.assert.Type;


/**
 * Шаг утверждения.
 *
 * Шаг утверждения выполняется в контексте узла дерева состояния и добавляет
 * в соответсвующий накопитель новый результат теста.
 *
 * @see qa.state.Cursor
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
   * @this {qa.state.Cursor}
   * @param {async.Input} input Передаваемое значение.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function assert(input, complete, cancel) {
    var folder = this;

    /**
     * @param {*} data Данные.
     */
    function localComplete(data) {
      folder.addResult(qa.result.assertion(true), comment);
      complete(data);
    }

    /**
     * @param {string} error
     * @param {number=} opt_code
     */
    function localCancel(error, opt_code) {
      folder.addResult(qa.result.assertion(false), [comment, error]);
      cancel(error, opt_code);
    }

    scenario.call(this, input, localComplete, localCancel);
  }

  return assert;
};


/**
 * Создание шага утверждения о появлении ошибки при выполнении сценария.
 *
 * @param {!async.Scenario} scenario Сценарии тестирования.
 * @param {string} comment Комментарий к утверждению.
 * @return {!qa.assert.Step} Созданный шаг утверждения.
 */
qa.assert.fail = function(scenario, comment) {

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} input Передаваемое значение.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function assert(input, complete, cancel) {
    var folder = this;
    var done = false;

    /**
     * @param {string} error
     * @param {number=} opt_code
     */
    function localCancel(error, opt_code) {
      if (!done) {
        done = true;
        folder.addResult(qa.result.assertion(true), [comment, error]);
        complete(input);
      }
    }

    /**
     * @param {*} data Данные.
     */
    function localComplete(data) {
      folder.addResult(qa.result.assertion(false), comment);
      cancel(comment);
    }

    scenario.call(new qa.assert.Fail(this), input, localComplete, localCancel);
  }

  return assert;
};


/**
 * Создание шага утверждения о равенсвте входных данных шага указанному
 * значению.
 *
 * @param {qa.assert.Value} value Указанное значение.
 * @param {string} comment Комментарий к утверждению.
 * @return {!qa.assert.Step} Созданный шаг утверждения.
 */
qa.assert.equals = function(value, comment) {

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} input Передаваемое значение.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function assert(input, complete, cancel) {
    var assertion = input === value;

    this.addResult(qa.result.assertion(assertion), comment);

    if (assertion) {
      complete(input);
    } else {
      cancel(comment);
    }
  }

  return assert;
};


/**
 * Создание шага утверждения о совпадении типа входных данных шага с указанным.
 *
 * @param {!qa.assert.Type} type Тип.
 * @param {string} comment Комментарий к утверждению.
 * @return {!qa.assert.Step} Созданный шаг утверждения.
 */
qa.assert.type = function(type, comment) {

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} input Передаваемое значение.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function assert(input, complete, cancel) {
    var assertion = typeof input === type ||
        type instanceof Object && input instanceof type;

    this.addResult(qa.result.assertion(assertion), comment);

    if (assertion) {
      complete(input);
    } else {
      cancel(comment);
    }
  }

  return assert;
};
