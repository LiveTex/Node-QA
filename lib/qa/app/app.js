

/**
 * @type {number}
 */
qa.app.CASE_TIMEOUT = 300000;


/**
 * @param {!qa.app.IApplicationFactory} factory Фабрика.
 */
qa.app.setApplicationFactory = function(factory) {
  qa.app.__applicationFactory = factory;
};


/**
 * @param {string} name Имя.
 * @param {!Array.<!async.Actor>} scenarios Сценарии тестирования.
 * @return {!async.Actor} Тест.
 */
qa.app.case = function(name, scenarios) {
  var test = [];

  for (var i = 0, l = scenarios.length; i < l; i += 1) {
    var scenario = async.try(qa.timeout(scenarios[i], qa.CASE_TIMEOUT),
        qa.app.__errorCatcher);

    test.push(async.context.isolate(qa.app.__createApplication(name),
        async.script.sequence([ scenario, qa.app.__report ])));
  }

  return async.proc.zip(test);
};


/**
 * @type {qa.app.IApplicationFactory}
 */
qa.app.__applicationFactory = null;


/**
 * @param {string} name Имя.
 * @return {!async.Actor} Тест.
 */
qa.app.__createApplication = function(name) {

  /**
   * @param {*} target Цель создания приложения.
   * @param {function(!qa.app.IApplication)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function creator(target, complete, cancel) {
    if (qa.app.__applicationFactory !== null) {
      qa.app.__applicationFactory.createApplication(
          name, target, complete, cancel);
    } else {
      cancel('Application factory is not set. [qa.app.__createApplication]');
    }
  }

  return creator;
};


/**
 * @this {qa.app.IApplication}
 * @param {*} data Данные.
 * @param {function(!Array.<!qa.ReportItem>)} complete Приложение.
 * @param {function(string, number=)} cancel Отмена выполнения.
 */
qa.app.__report = function(data, complete, cancel) {
  complete(this.report(data));
};


/**
 * @param {string} error Ошибка.
 * @param {number=} opt_code Код ошибки.
 * @return {!async.Actor} Тест.
 */
qa.app.__errorCatcher = function(error, opt_code) {
  return function(data, complete, cancel) {
    this.exception(error, opt_code);
    complete(data);
  };
};

