

/**
 * @param {!async.Actor} actor Сценарии тестирования.
 * @param {string} comment Не имя.
 * @return {!async.Actor} Тест.
 */
qa.assert.success = function(actor, comment) {

  /**
   * @this {qa.test.IContext}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function assert(data, complete, cancel) {
    var self = this;

    /**
     * @param {*} data Данные.
     */
    function localComplete(data) {
      self.getEventLog().pass(new qa.test.events.ActorCompleted(
          self.getName(), false, comment));

      complete(data);
    }

    actor.call(this, data, localComplete, cancel);
  }

  return assert;
};


/**
 * @param {!async.Actor} actor Сценарии тестирования.
 * @param {string} comment Не имя.
 * @return {!async.Actor} Тест.
 */
qa.assert.fail = function(actor, comment) {

  /**
   * @this {qa.test.IContext}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function assert(data, complete, cancel) {
    var self = this;

    /**
     * @param {string} error
     * @param {number=} opt_code
     */
    function localCancel(error, opt_code) {
      self.getEventLog().pass(new qa.test.events.Exception(
          self.getName(), false, comment, error));

      complete(data);
    }

    /**
     * @param {*} data Данные.
     */
    function localComplete(data) {
      self.getEventLog().pass(new qa.test.events.ActorCompleted(
          self.getName(), true, comment));

      complete(data);
    }

    actor.call(this, data, localComplete, localCancel);
  }

  return assert;
};


/**
 * @param {!async.Actor} actor Действие.
 * @param {number} time Время задержки.
 * @return {!async.Actor} Задержка.
 */
qa.assert.timeout = function(actor, time) {

  /**
   * @this {qa.test.IContext}
   * @param {*} data Входные данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function timeout(data, complete, cancel) {
    var self = this;

    /**
     * @param {string} error
     * @param {number=} opt_code
     */
    function localCancel(error, opt_code) {
      clearTimeout(timeout);
      cancel(error, opt_code);
    }

    /**
     * @param {*} data Данные.
     */
    function localComplete(data) {
      clearTimeout(timeout);
      complete(data);
    }

    var timeout = setTimeout(function() {
      self.getEventLog().pass(new qa.test.events.Timeout(self.getName()));
      complete(data);
    }, time);

    actor.call(this, data, localComplete, localCancel);
  }

  return async.esc(timeout);
};


/**
 * @param {*} value Не имя.
 * @param {string} comment Не имя.
 * @return {!async.Actor} Тест.
 */
qa.assert.equals = function(value, comment) {

  /**
   * @this {qa.test.IContext}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function assert(data, complete, cancel) {
    var assertion = data === value;

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
