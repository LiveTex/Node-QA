

/**
 * @param {string} basePath Не имя.
 * @param {string} targetPath Не имя.
 * @param {string} comment Не имя.
 * @return {!async.Step} Тест.
 */
qa.db.assert.equals = function(basePath, targetPath, comment) {
  var base = new qa.db.Path(basePath);
  var target = new qa.db.Path(targetPath);

  /**
   * @this {qa.test.IContext}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function assert(data, complete, cancel) {
    var assertion =
        target.get(this.getDataNode()) === base.get(this.getDataNode());

    this.getEventLog().pass(new qa.test.events.Assertion(
        this.getName(), !assertion, comment));

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
 * @param {string} comment Не имя.
 * @return {!async.Step} Тест.
 */
qa.db.assert.equalsTo = function(basePath, comment) {
  var base = new qa.db.Path(basePath);

  /**
   * @this {qa.test.IContext}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function assert(data, complete, cancel) {
    var assertion = data === base.get(this.getDataNode());

    this.getEventLog().pass(new qa.test.events.Assertion(
        this.getName(), !assertion, comment));

    if (assertion) {
      complete(data);
    } else {
      cancel(comment);
    }
  }

  return assert;
};
