


/**
 * Фабрикa обработчиков ошибки целевого шага.
 *
 * @constructor
 * @implements {async.error.IHandlerFactory}
 */
qa.ErrorHandlerFactory = function() {};


/**
 * @inheritDoc
 */
qa.ErrorHandlerFactory.prototype.createHandler = function(message, opt_code) {

  /**
   * @param {*} data Данные.
   * @param {function(*)} complete Обработчик завершения.
   * @param {function(string, number=)} cancel Обрабтчик ошибки.
   */
  function pass(data, complete, cancel) {
    this.getEventLog().pass(new qa.test.events.Exception(
        this.getName(), true, 'Unhandled exception.', message));

    complete(data);
  }

  return async.esc(pass);
};


/**
 * @inheritDoc
 */
qa.ErrorHandlerFactory.prototype.createTolerantHandler = function() {
  return console.error;
};
