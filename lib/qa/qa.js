

/**
 * @namespace
 */
var qa = {};


/**
 * @namespace
 */
qa.app = {};


/**
 * @namespace
 */
qa.context = {};


/**
 * @type {number}
 */
qa.CASE_TIMEOUT = 60000;


/**
 * @type {string}
 */
qa.TEST_PREFIX = 'test-';


/**
 * @param {!qa.context.IContextFactory} factory Репортер.
 */
qa.setContextFactory = function(factory) {
  qa.__contextFactory = factory;
};


/**
 * @param {!Object} base Реестр тестов.
 * @param {string} prefix Источник тестов.
 * @param {!Array.<string>} names Имя теста.
 * @param {*} data Данные теста.
 * @param {function(*)} complete Приложение.
 * @param {function(string, number=)} cancel Отмена выполнения.
 */
qa.run = function(base, prefix, names, data, complete, cancel) {
  var source = new util.SafeObject(base);
  var suite = [];

  for (var i = 0; i < names.length; i += 1) {
    if (names[i].length !== 0) {
      qa.__populateSuite(source, suite,
          prefix + '.' + qa.TEST_PREFIX + names[i]);
    }
  }

  if (suite.length === 0) {
    qa.__populateSuite(source, suite, prefix);
  }

  qa.suite(suite).call(null, data, complete, cancel);
};


/**
 * @param {!util.SafeObject} source Массив тестов.
 * @param {!Array.<!async.Actor>} suite Массив тестов.
 * @param {string} path Перфикс.
 */
qa.__populateSuite = function(source, suite, path) {
  var test = source.getByPath(path.split('.'));
  if (typeof test === 'function') {
    suite.push(qa.case(path, test));
  } else if (typeof test === 'object') {
    for (var key in test) {
      if (key.indexOf(qa.TEST_PREFIX) === 0) {
        suite.push(qa.case(path + '.' + key, test[key]));
      }
    }
  }
};


/**
 * @param {!Array.<!async.Actor>} cases Кейсы.
 * @return {!async.Actor} Тест.
 */
qa.suite = function(cases) {
  return async.proc.sequence(cases, async.proc.ARRAY_COLLECTOR);
};


/**
 * @param {string} name Имя.
 * @param {!async.Actor} actor Сценарии тестирования.
 * @return {!async.Actor} Тест.
 */
qa.case = function(name, actor) {
  return async.context.isolate(qa.__createContext(name), async.script.sequence([
    async.try(qa.timeout(actor, qa.CASE_TIMEOUT), qa.__errorCatcher),
    qa.__report
  ]));
};


/**
 * @param {!async.Actor} actor Сценарии тестирования.
 * @param {string} comment Не имя.
 * @return {!async.Actor} Тест.
 */
qa.success = function(actor, comment) {

  /**
   * @this {qa.context.ITestContext}
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
      self.assert(true, comment);
      complete(data);
    }

    /**
     * @param {string} error Ошибка.
     * @param {number=} opt_code Не имя.
     */
    function localCancel(error, opt_code) {
      self.assert(false, comment);
      cancel(error, opt_code);
    }

    actor.call(this, data, localComplete, localCancel);
  }

  return assert;
};


/**
 * @param {!async.Actor} actor Сценарии тестирования.
 * @param {string} comment Не имя.
 * @return {!async.Actor} Тест.
 */
qa.fail = function(actor, comment) {

  /**
   * @this {qa.context.ITestContext}
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
      self.assert(true, comment + ' ("' + error + '")');
      complete(data);
    }

    /**
     * @param {*} data Данные.
     */
    function localComplete(data) {
      self.assert(false, comment);
      complete(data);
    }

    actor.call(this, data, localComplete, localCancel);
  }

  return assert;
};


/**
 * @param {*} value Не имя.
 * @param {string} comment Не имя.
 * @return {!async.Actor} Тест.
 */
qa.assertEquals = function(value, comment) {

  /**
   * @this {qa.context.ITestContext}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function assert(data, complete, cancel) {
    var assertion = data === value;
    this.assert(assertion, comment);

    if (assertion) {
      complete(data);
    } else {
      cancel(comment);
    }
  }

  return assert;
};



/**
 * @param {!async.Actor} actor Действие.
 * @param {number} time Время задержки.
 * @return {!async.Actor} Задержка.
 */
qa.timeout = function(actor, time) {

  /**
   * @this {qa.context.ITestContext}
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
      self.timeout();
      complete(data);
    }, time);

    actor.call(this, data, localComplete, localCancel);
  }

  return async.esc(timeout);
};



/**
 * @type {qa.context.IContextFactory}
 */
qa.__contextFactory = null;


/**
 * @param {string} name Имя.
 * @return {!async.Actor} Тест.
 */
qa.__createContext = function(name) {

  /**
   * @param {*} target Цель создания приложения.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function creator(target, complete, cancel) {
    if (qa.__contextFactory !== null) {
      qa.__contextFactory.createContext(name, target, complete, cancel);
    } else {
      complete(new qa.context.TestContext(name));
    }
  }

  return creator;
};


/**
 * @this {qa.context.ITestContext}
 * @param {*} data Данные.
 * @param {function(!Array.<!qa.ReportItem>)} complete Приложение.
 * @param {function(string, number=)} cancel Отмена выполнения.
 */
qa.__report = function(data, complete, cancel) {
  complete(this.report(data));
};


/**
 * @param {string} error Ошибка.
 * @param {number=} opt_code Код ошибки.
 * @return {!async.Actor} Тест.
 */
qa.__errorCatcher = function(error, opt_code) {
  return function(data, complete, cancel) {
    this.exception(error, opt_code);
    complete(data);
  };
};
