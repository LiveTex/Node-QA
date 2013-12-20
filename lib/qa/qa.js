

/**
 * @namespace
 */
var qa = {};


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
qa.db.util = {};


/**
 * @namespace
 */
qa.test = {};


/**
 * @namespace
 */
qa.net = {};


/**
 * @namespace
 */
qa.net.cookies = {};


/**
 * @namespace
 */
qa.util = {};


/**
 * @namespace
 */
qa.util.json = {};


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
qa.CASE_PREFIX = 'test-';


/**
 * @type {string}
 */
qa.APP_CASE_PREFIX = 'app-';


/**
 * @type {string}
 */
qa.APP_INPUT_PREFIX = 'input-';


/**
 * @param {!Object} base Реестр тестов.
 * @param {string} names Имя теста.
 * @param {function(number)} complete Приложение.
 * @param {*=} opt_data Приложение.
 */
qa.run = function(base, names, complete, opt_data) {
  var cases = [];

  if (names.length > 0) {
    var list = names.split(qa.NAME_SEPARATOR);
    for (var i = 0; i < list.length; i += 1) {
      var name = list[i];

      if (base[qa.CASE_PREFIX + name] !== undefined) {
        cases.push(qa.__buildCase(base, name));
      } else if (base[qa.APP_CASE_PREFIX + name] !== undefined) {
        cases.push(qa.__buildApplicationCase(base, name));
      }
    }
  } else {
    for (var key in base) {
      if (key.indexOf(qa.CASE_PREFIX) === 0) {
        cases.push(qa.__buildCase(
            base, key.substr(qa.CASE_PREFIX.length)));

      } else if (key.indexOf(qa.APP_CASE_PREFIX) === 0) {
        cases.push(qa.__buildApplicationCase(
            base, key.substr(qa.APP_CASE_PREFIX.length)));
      }
    }
  }

  var suite = new qa.Suite();

  async.proc.sequence(cases).call(suite, opt_data || null, function() {
    complete(suite.getResult().getFailCount());
  }, console.error);
};


/**
 * @param {!Object} base Реестр тестов.
 * @param {string} name Имя.
 * @return {!async.Step} Кейс.
 */
qa.__buildCase = function(base, name) {
  return qa.__case(name, base[qa.CASE_PREFIX + name] || async.nop,
      base[qa.TIMEOUT_PREFIX + name] || qa.CASE_TIMEOUT);
};


/**
 * @param {!Object} base Реестр тестов.
 * @param {string} name Имя.
 * @return {!async.Step} Кейс.
 */
qa.__buildApplicationCase = function(base, name) {
  return qa.__applicationCase(name, base[qa.APP_INPUT_PREFIX + name] || async.nop,
      base[qa.APP_CASE_PREFIX + name] || {},
          base[qa.TIMEOUT_PREFIX + name] || qa.CASE_TIMEOUT);
};


/**
 * @param {string} name Имя.
 * @param {!async.Step} step Сценарии тестирования.
 * @param {number} timeout Максимальное время выполнения.
 * @return {!async.Step} Тест.
 */
qa.__case = function(name, step, timeout) {
  return async.context.isolate(async.script.sequence([
    qa.__passCurrentResult(qa.ResultType.BEGIN),
    async.error.try(qa.__timeout(step, timeout), qa.__errorCatcher),
    qa.__passCurrentResult(qa.ResultType.END)
  ]), qa.__createContext(name));
};

/**
 * @param {string} name Сценарии тестирования.
 * @param {!async.Step} input Сценарии тестирования.
 * @param {!Object.<string, !async.Step>} scenario Сценарии тестирования.
 * @param {number} timeout Максимальное время выполнения.
 * @return {!async.Step} Тест.
 */
qa.__applicationCase = function(name, input, scenario, timeout) {
  var test = [];

  for (var key in scenario) {
    test.push(qa.__case(key, scenario[key], timeout));
  }

  return qa.__case(name, async.script.sequence([
    input, async.proc.zip.parallel(test)
  ]), timeout);
};


/**
 * @param {string} name Имя.
 * @return {!async.Step} Метод создания.
 */
qa.__createContext = function(name) {

  /**
   * @this {qa.ICaseFactory}
   * @param {*} data Данные.
   * @param {function(!qa.ICase)} complete Обработчик завершения.
   * @param {function(string, number=)} cancel Обрабтчик ошибки.
   */
  function factory(data, complete, cancel) {
    complete(this.createCase(name));
  }

  return async.esc(factory);
};


/**
 * @param {!async.Step} step Действие.
 * @param {number} time Время задержки.
 * @return {!async.Step} Задержка.
 */
qa.__timeout = function(step, time) {

  /**
   * @this {qa.db.Node}
   * @param {*} data Входные данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function timeout(data, complete, cancel) {
    var test = this.getCase();
    var done = false;

    /**
     * @param {string} error
     * @param {number=} opt_code
     */
    function localCancel(error, opt_code) {
      done = true;
      cancel(error, opt_code);
    }

    /**
     * @param {*} data Данные.
     */
    function localComplete(data) {
      if (!done) {
        done = true;
        complete(data);
      }
    }

    setTimeout(function() {
      if (!done) {
        done = true;
        test.passTimeout();
        complete(data);
      }
    }, time);

    step.call(this, data, localComplete, localCancel);
  }

  return async.esc(timeout);
};


/**
 * @param {string} message Сообщение об ошибке.
 * @param {number=} opt_code Код ошибки.
 * @return {!async.Step} Шаг обработки.
 */
qa.__errorCatcher = function(message, opt_code) {

  /**
   * @this {qa.db.Node}
   * @param {*} data Цель создания приложения.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function catcher(data, complete, cancel) {
    var result = this.getCase().getResult();
    if (result.getFailCount() === 0) {
      this.passException(message);
    }

    complete(data);
  }

  return catcher;
};


/**
 * @param {qa.ResultType} tag Тег результата.
 */
qa.__passCurrentResult = function(tag) {

  /**
   * @this {qa.db.Node}
   * @param {*} data Данные.
   * @param {function(*)} complete Обработчик завершения.
   * @param {function(string, number=)} cancel Обрабтчик ошибки.
   */
  function pass(data, complete, cancel) {
    this.getCase().passCurrentResult(tag);
    complete(data);
  }

  return pass;
};

