

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
qa.db = {};


/**
 * @namespace
 */
qa.db.assert = {};


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
 * @type {number}
 */
qa.APP_CASE_TIMEOUT = 300000;


/**
 * @type {string}
 */
qa.TIMEOUT_PREFIX = 'timeout-';


/**
 * @type {string}
 */
qa.INPUT_PREFIX = 'input-';


/**
 * @type {string}
 */
qa.CASE_PREFIX = 'test-';


/**
 * @type {string}
 */
qa.APP_CASE_PREFIX = 'app-';


/**
 * @param {!qa.log.IEventLog} log Имя теста.
 * @param {function(string)} print Обработчик результата.
 * @param {function(number)} callback Обработчик результата.
 */
qa.report = function(log, print, callback) {
  var iterator = log.getIterator();
  var ok = true;

  /**
   * @param {!qa.log.Event=} opt_event
   */
  function step(opt_event) {
    if (opt_event instanceof qa.test.events.TestEvent) {
      ok = ok && !opt_event.isProblem();
      print(opt_event.toString());

      iterator.next(step);
    } else {
      iterator.destroy();

      callback(Number(!ok));
    }
  }

  iterator.next(step);
};


/**
 * @param {!qa.test.IContextFactory} contextFactory Приложение.
 */
qa.setContextFactory = function(contextFactory) {
  qa.__contextFactory = contextFactory;
};


/**
 * @param {!Object} base Реестр тестов.
 * @param {string} names Имя теста.
 * @param {!qa.log.IEventLog} log Имя теста.
 * @param {function()} complete Приложение.
 */
qa.run = function(base, names, log, complete) {
  var suite = [];

  if (names.length > 0) {
    var list = names.split(qa.NAME_SEPARATOR);
    for (var i = 0; i < list.length; i += 1) {
      var name = list[i];

      if (base[qa.CASE_PREFIX + name] !== undefined) {
        suite.push(qa.__buildCase(base, name, log));
      } else if (base[qa.APP_CASE_PREFIX + name] !== undefined) {
        suite.push(qa.__buildApplicationCase(base, name, log));
      }
    }
  } else {
    for (var key in base) {
      if (key.indexOf(qa.CASE_PREFIX) === 0) {
        suite.push(qa.__buildCase(
            base, key.substr(qa.CASE_PREFIX.length), log));

      } else if (key.indexOf(qa.APP_CASE_PREFIX) === 0) {
        suite.push(qa.__buildApplicationCase(
            base, key.substr(qa.APP_CASE_PREFIX.length), log));
      }
    }
  }

  async.proc.sequence(suite).call(null, null, complete, console.error);
};


/**
 * @type {qa.test.IContextFactory}
 */
qa.__contextFactory = null;


/**
 * @param {!Object} base Реестр тестов.
 * @param {string} name Имя.
 * @param {!qa.log.IEventLog} log Имя теста.
 * @return {!async.Step} Кейс.
 */
qa.__buildCase = function(base, name, log) {
  return qa.__case(name, log, new qa.db.Node({}),
      base[qa.INPUT_PREFIX + name] || async.nop,
          base[qa.CASE_PREFIX + name] || async.nop,
              base[qa.TIMEOUT_PREFIX + name] || qa.CASE_TIMEOUT);
};


/**
 * @param {!Object} base Реестр тестов.
 * @param {string} name Имя.
 * @param {!qa.log.IEventLog} log Имя теста.
 * @return {!async.Step} Кейс.
 */
qa.__buildApplicationCase = function(base, name, log) {
  return qa.__applicationCase(name, log, new qa.db.Node({}),
      base[qa.INPUT_PREFIX + name] || async.nop,
          base[qa.APP_CASE_PREFIX + name] || async.nop,
              base[qa.TIMEOUT_PREFIX + name] || qa.CASE_TIMEOUT);
};


/**
 * @param {string} name Имя.
 * @param {!qa.log.IEventLog} log Имя теста.
 * @param {!qa.db.Node} node Имя.
 * @return {!async.Step} Метод создания.
 */
qa.__createContext = function(name, log, node) {

  /**
   * @param {*} data Данные.
   * @param {function(qa.test.IContext)} complete Обработчик завершения.
   * @param {function(string, number=)} cancel Обрабтчик ошибки.
   */
  function createContext(data, complete, cancel) {
    if (qa.__contextFactory !== null) {
      qa.__contextFactory.createContext(
          name, log, node, data, complete, cancel);
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
    createContext(data, function(context, type) {
      if (context === null) {
        context = new qa.test.Context(name, log, node);
      }

      complete(context)
    }, cancel);
  }

  return async.esc(factory);
};


/**
 * @param {string} name Имя.
 * @param {!qa.log.IEventLog} log Имя теста.
 * @param {!qa.db.Node} node Имя.
 * @param {!async.Step} input Сценарии тестирования.
 * @param {!async.Step} actor Сценарии тестирования.
 * @param {number} timeout Максимальное время выполнения.
 * @return {!async.Step} Тест.
 */
qa.__case = function(name, log, node, input, actor, timeout) {

  async.context.isolate(async.proc.parallel([
    async.proc.fold.sequence(resultListener),
    async.proc.fold.sequence(eventListener),
    async.script.sequence([

    ])

  ]), qa.__createContext);

/*
  var test = async.error.try(qa.assert.timeout(actor, timeout));

  return async.context.isolate(async.script.sequence([
    qa.__logStart, input, test, qa.__logEnd
  ]), qa.__createContext(name, log, node));*/
};



/**
 * @param {string} name Сценарии тестирования.
 * @param {!qa.log.IEventLog} log Имя теста.
 * @param {!qa.db.Node} node Имя.
 * @param {!async.Step} input Сценарии тестирования.
 * @param {!Object.<string, !async.Step>} scenario Сценарии тестирования.
 * @param {number} timeout Максимальное время выполнения.
 * @return {!async.Step} Тест.
 */
qa.__applicationCase = function(name, log, node, input, scenario, timeout) {
  var test = [];

  for (var key in scenario) {
    test.push(qa.__case(name + '/' + key, log, node.growChild(key),
        async.nop, scenario[key], timeout));
  }

  return qa.__case(name, log, node, input, async.proc.fold.zip(test), timeout);
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
