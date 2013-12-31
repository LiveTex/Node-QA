

/**
 * @param {string} basePath Не имя.
 * @param {string} comment Не имя.
 * @return {!async.Step} Тест.
 */
qa.state.assert.equals = function(basePath, comment) {
  var base = new qa.state.Path(basePath);

  /**
   * @this {qa.state.Node}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function assert(data, complete, cancel) {
    var assertion = data === base.get(this);

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
 * @param {string} basePath Не имя.
 * @param {string} targetPath Не имя.
 * @param {string} comment Не имя.
 * @return {!async.Step} Тест.
 */
qa.state.assert.equalsValues = function(basePath, targetPath, comment) {
  var base = new qa.state.Path(basePath);
  var target = new qa.state.Path(targetPath);

  /**
   * @this {qa.state.Node}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function assert(data, complete, cancel) {
    var assertion = target.get(this) === base.get(this);

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
 * @param {string} basePath Не имя.
 * @param {*} value Не имя.
 * @param {string} comment Не имя.
 * @return {!async.Step} Тест.
 */
qa.state.assert.equalsTo = function(basePath, value, comment) {
  var base = new qa.state.Path(basePath);

  /**
   * @this {qa.state.Node}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function assert(data, complete, cancel) {
    var assertion = value === base.get(this);

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
 * @param {string} path Не имя.
 * @param {string} comment Не имя.
 * @return {!async.Step} Тест.
 */
qa.state.assert.exists = function(path, comment) {
  var evaluator = new qa.state.Path(path);

  /**
   * @this {qa.state.Node}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function assert(data, complete, cancel) {
    var assertion = evaluator.get(this) !== null;

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
 * @param {string} path Не имя.
 * @param {(string|!Object)} type Тип.
 * @param {string} comment Не имя.
 * @return {!async.Step} Тест.
 */
qa.state.assert.type = function(path, type, comment) {
  var evaluator = new qa.state.Path(path);

  /**
   * @this {qa.state.Node}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function assert(data, complete, cancel) {
    var value = evaluator.get(this);

    var assertion = typeof value === type ||
        type instanceof Object && value instanceof type;

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
