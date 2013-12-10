

/**
 * @namespace
 */
var qa = {};


/**
 * @namespace
 */
qa.log = {};


/**
 * @namespace
 */
qa.assert = {};


/**
 * @namespace
 */
qa.storage = {};


/**
 * @namespace
 */
qa.storage.shared = {};


/**
 * @namespace
 */
qa.test = {};


/**
 * @namespace
 */
qa.test.events = {};


/**
 * @type {!RegExp}
 */
qa.NAME_SEPARATOR = /\s*,\s*/;


/**
 * @type {number}
 */
qa.CASE_TIMEOUT = 60000;


/**
 * @type {string}
 */
qa.CASE_PREFIX = 'test-';


/**
 * @type {number}
 */
qa.APP_CASE_TIMEOUT = 300000;


/**
 * @type {string}
 */
qa.APP_CASE_PREFIX = 'app-';


/**
 * @type {string}
 */
qa.APP_CASE_INPUT_SUFFIX = '-input';


/**
 * @param {!Object} base Реестр тестов.
 * @param {string} names Имя теста.
 * @param {!qa.log.IEventLog} log Имя теста.
 * @param {function()} complete Приложение.
 * @param {!qa.test.IContextFactory=} opt_contextFactory Приложение.
 */
qa.run = function(base, names, log, complete, opt_contextFactory) {
  var suite = [];
  var name = '';


  /**
   * @param {string} name Имя.
   * @return {!async.Actor} Метод создания.
   */
  function contextFactory(name) {

    /**
     * @param {*} data Данные.
     * @param {function(qa.test.IContext)} complete Обработчик завершения.
     * @param {function(string, number=)} cancel Обрабтчик ошибки.
     */
    function createContext(data, complete, cancel) {
      if (opt_contextFactory !== undefined) {
        opt_contextFactory.createContext(name, data, complete, cancel);
      } else {
        complete(null);
      }
    }

    /**
     * @param {*} data Данные.
     * @param {function(!qa.test.IContext)} complete Обработчик завершения.
     * @param {function(string, number=)} cancel Обрабтчик ошибки.
     */
    function factory(data, complete, cancel) {
      createContext(data, function(context) {
        if (context === null) {
          context = new qa.test.Context(name, log);
        }

        complete(context)
      }, cancel);
    }

    return async.esc(factory);
  }

  if (names.length > 0) {
    var list = names.split(qa.NAME_SEPARATOR);
    for (var i = 0; i < list.length; i += 1) {
      name = list[i];

      var test = base[qa.CASE_PREFIX + name];
      if (test !== undefined) {
        suite.push(qa.__case(test, contextFactory(name)));
      } else {
        var input = base[name + qa.APP_CASE_INPUT_SUFFIX] || async.nop;
        var app = base[qa.APP_CASE_PREFIX + name];
        if (app !== undefined) {
          suite.push(qa.__applicationCase(input, test, contextFactory(name)));
        }
      }
    }
  } else {
    for (var key in base) {
      if (key.indexOf(qa.CASE_PREFIX) === 0) {
        suite.push(qa.__case(base[key],
            contextFactory(key.substr(qa.CASE_PREFIX.length))));
      } else if (key.indexOf(qa.APP_CASE_PREFIX) === 0) {
        name = key.substr(qa.APP_CASE_PREFIX.length);
        suite.push(qa.__applicationCase(
            base[name + qa.APP_CASE_INPUT_SUFFIX] || async.nop, base[key],
            contextFactory(name)));
      }
    }
  }

  async.proc.sequence(suite).call(null, null, complete, console.error);
};


/**
 * @param {!async.Actor} actor Сценарии тестирования.
 * @param {!async.Actor} contextFactory Имя.
 * @param {number=} opt_timeout Максимальное время выполнения.
 * @return {!async.Actor} Тест.
 */
qa.__case = function(actor, contextFactory, opt_timeout) {
  var timeout = opt_timeout || qa.CASE_TIMEOUT;

  return async.context.isolate(contextFactory,
      async.script.sequence([ qa.__logStart,
          async.try(qa.assert.timeout(actor, timeout), qa.__exceptionLogger),
              qa.__logEnd ]));
};


/**
 * @param {!async.Actor} input Сценарии тестирования.
 * @param {!Object.<string, !async.Actor>} scenarios Сценарии тестирования.
 * @param {!async.Actor} contextFactory Имя.
 * @param {number=} opt_timeout Максимальное время выполнения.
 * @return {!async.Actor} Тест.
 */
qa.__applicationCase = function(input, scenarios, contextFactory, opt_timeout) {
  var timeout = opt_timeout || qa.APP_CASE_TIMEOUT;
  var test = [];

  for (var key in scenarios) {
    test.push(qa.__case(scenarios[key], contextFactory, timeout))
  }

  return qa.__case(async.script.sequence([
    input, async.proc.zip(test)
  ]), contextFactory, timeout);
};



/**
 * @this {qa.test.IContext}
 * @param {*} data Цель создания приложения.
 * @param {function(*)} complete Приложение.
 * @param {function(string, number=)} cancel Отмена выполнения.
 */
qa.__logStart = function(data, complete, cancel) {
  this.getEventLog().pass(new qa.test.events.TestStart(this.getName()));
  complete(data);
};


/**
 * @this {qa.test.IContext}
 * @param {*} data Цель создания приложения.
 * @param {function(*)} complete Приложение.
 * @param {function(string, number=)} cancel Отмена выполнения.
 */
qa.__logEnd = function(data, complete, cancel) {
  this.getEventLog().pass(new qa.test.events.TestEnd(this.getName()));
  complete(data);
};


/**
 * @this {qa.test.IContext}
 * @param {string} error Ошибка.
 * @param {number=} opt_code Код ошибки.
 * @return {!async.Actor} Тест.
 */
qa.__exceptionLogger = function(error, opt_code) {
  return function(data, complete, cancel) {
    this.getEventLog().pass(new qa.test.events.Exception(
        this.getName(), true, 'Unhandled exception.', error, opt_code));
    
    complete(data);
  };
};
