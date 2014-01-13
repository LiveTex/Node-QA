

/**
 * Создание шага утверждения о равенстве входных данных шага значению
 * найденному по указанному пути.
 *
 * @param {string} path Указанный путь.
 * @param {string} comment Комментарий к утверждению.
 * @return {!qa.assert.Step} Созданный шаг утверждения.
 */
qa.state.assert.equals = function(path, comment) {
  var tokens = path.split(qa.state.PATH_SEPARATOR);

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} input Передаваемое значение.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function assert(input, complete, cancel) {
    var assertion = input === this.get(tokens);

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
 * Создание шага утверждения о равенстве значений найденных по указанным путям.
 *
 * @param {string} base Путь для сравнения.
 * @param {string} target Путь для сравнения.
 * @param {string} comment Комментарий к утверждению.
 * @return {!qa.assert.Step} Созданный шаг утверждения.
 */
qa.state.assert.equalsValues = function(base, target, comment) {
  var baseTokens = base.split(qa.state.PATH_SEPARATOR);
  var targetTokens = target.split(qa.state.PATH_SEPARATOR);

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} input Передаваемое значение.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function assert(input, complete, cancel) {
    var assertion = this.get(baseTokens) === this.get(targetTokens);

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
 * Создание шага утверждения о равенстве выбранного значения значению найденному
 * по указанному пути.
 *
 * @param {string} path Путь выбора значения.
 * @param {*} value Значение для сравнения.
 * @param {string} comment Комментарий к утверждению.
 * @return {!qa.assert.Step} Созданный шаг утверждения.
 */
qa.state.assert.equalsTo = function(path, value, comment) {
  var tokens = path.split(qa.state.PATH_SEPARATOR);

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} input Передаваемое значение.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function assert(input, complete, cancel) {
    var assertion = value === this.get(tokens);

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
 * Создание шага утверждения о существовании выбранного значения по указанному
 * пути.
 *
 * Сущестование соотвтсвует неравенству выбранного значения значению `null`.
 *
 * @param {string} path Указанный путь.
 * @param {string} comment Комментарий к утверждению.
 * @return {!qa.assert.Step} Созданный шаг утверждения.
 */
qa.state.assert.exists = function(path, comment) {
  var tokens = path.split(qa.state.PATH_SEPARATOR);

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} input Передаваемое значение.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function assert(input, complete, cancel) {
    var assertion = this.get(tokens) !== null;

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
 * Создание шага утверждения о совпадении типа выбранного значения с указанным.
 *
 * @param {string} path Путь выбора значения.
 * @param {string|!Object} type Тип.
 * @param {string} comment Комментарий к утверждению.
 * @return {!qa.assert.Step} Созданный шаг утверждения.
 */
qa.state.assert.type = function(path, type, comment) {
  var tokens = path.split(qa.state.PATH_SEPARATOR);

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} input Передаваемое значение.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function assert(input, complete, cancel) {
    var value = this.get(tokens);

    var assertion = typeof value === type ||
        type instanceof Object && value instanceof type;

    this.addResult(qa.result.assertion(assertion), comment);

    if (assertion) {
      complete(input);
    } else {
      cancel(comment);
    }
  }

  return assert;
};
