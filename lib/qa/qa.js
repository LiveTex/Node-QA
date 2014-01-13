

/**
 * Основная область имен объединяющая классы и функции реализующие модель
 * теста - утверждения, состояния, варианты проверки и их объединения, а также
 * набор специальных клиентов к тестируемым интерфейсам.
 *
 * @namespace
 */
var qa = {};


/**
 * Область имен объединяющая функции необходимые для создания различных
 * утвержений о состоянии асинхронного сценария.
 *
 * @see async.Scenario
 * @namespace
 */
qa.assert = {};


/**
 * Область имен элементы которой реализуют модель результата теста.
 *
 * @namespace
 */
qa.result = {};


/**
 * Область имен элементы которой реализуют модель накопителей результата теста.
 *
 * @namespace
 */
qa.result.folder = {};


/**
 * Область имен функции и классы которой предоставяют инструментарий для работы
 * с состоянием теста представленным в виде дерева.
 *
 * @namespace
 */
qa.state = {};


/**
 * Область имен объединяющая функции необходимые для создания утверждений о
 * текущем состоянии теста.
 *
 * @namespace
 */
qa.state.assert = {};


/**
 * Область имен элементы которой реализуют модель клиента соответсвющего
 * интерфеса, а также реестра экземпляров клиентов.
 *
 * @namespace
 */
qa.ext = {};


/**
 * Область имен объединяющая всомогательные функции и классы для взаимодействия
 * с сетевыми интерфесами.
 *
 * @namespace
 */
qa.ext.net = {};


/**
 * Область имен объединяющая всомогательные функции и классы для работы с
 * сокет-соединениями.
 *
 * @namespace
 */
qa.ext.net.socket = {};


/**
 * Область имен объединяющая вспомогательные фунции необходимые для
 * организации теста.
 *
 * @namespace
 */
qa.util = {};


/**
 * Область имен объединяющаяя вспомогательные фунции необходимые для
 * отладки тестовых сценариев.
 *
 * @namespace
 */
qa.util.debug = {};


/**
 * Описание варинта тестирования в базовом объекте теста - асинхронный
 * сценарий выполняемый в контексте узла дерева состояния теста.
 *
 * @see qa.CASE_PREFIX
 * @see qa.TestBase
 * @see qa.TestScenario
 * @see async.Context
 * @see qa.state.Cursor
 *
 * @typedef {async.Scenario}
 */
qa.CaseScenario;


/**
 * Описание варианта тестирования взаимодействия в базовом объекте теста -
 * таблица именованых асинхронных сценариев запускаемых параллельно
 * соответсвенно входным данным.
 *
 * Выполнение каждого сценария происходит в разных узлах одного дерева теста.
 *
 * @see qa.APP_CASE_PREFIX
 * @see qa.TestBase
 * @see qa.TestScenario
 * @see async.proc.zip.Scenario
 * @see async.Context
 * @see qa.state.Cursor
 *
 * @typedef {Object.<string, !async.Scenario>}
 */
qa.AppCaseScenario;


/**
 * Базовый объект теста - таблица соотвествия имени и объекта описания сценария
 * теста.
 *
 * Кроме сценариев теста, базовый объект может содержать поля аргументирования
 * соответвующих тестов - настройки тестов.
 *
 * Связь между тестовыми сценариями и их настройками устанавливается
 * именем теста и соответсвующими префиксами.
 *
 * @see qa.TestOption
 * @see qa.TestScenario
 *
 * @typedef {Object.<string, (!qa.TestScenario|!qa.TestOption)>}
 */
qa.TestBase;


/**
 * Объект описания сценария тестирования - все, что может выступать в роли
 * описания сценария.
 *
 * @see qa.CaseScenario
 * @see qa.AppCaseScenario
 * @see qa.TestBase
 *
 * @typedef {qa.CaseScenario|qa.AppCaseScenario}
 */
qa.TestScenario;


/**
 * Все, что может выступать в роли настройки в базовом объекте теста.
 *
 * @see qa.TestBase
 *
 * @typedef {*}
 */
qa.TestOption;


/**
 * Префикс поля в базовом объекте теста, со сценарием варианта.
 *
 * Пример создания варинта с именем "my-cool-case":
 * ```
 * base[qa.CASE_PREFIX + 'my-cool-case'] = async.script.sequence([
 *   // ...
 * ]);
 * ```
 *
 * @see qa.TestBase
 * @see qa.CaseScenario
 *
 * @type {string}
 */
qa.CASE_PREFIX = 'test-';


/**
 * Префикс поля в базовом объекте теста, со сценарием варианта взаимодействия.
 *
 * Пример создания варинта с именем "my-cool-apps":
 * ```
 * base[qa.APP_CASE_PREFIX + 'my-cool-apps'] = {
 *   '1-app': async.script.sequence([
 *     // ...
 *   ]),
 *
 *   '2-app': async.script.sequence([
 *     // ...
 *   ])
 * };
 * ```
 *
 * @see qa.TestBase
 * @see qa.AppCaseScenario
 *
 * @type {string}
 */
qa.APP_CASE_PREFIX = 'app-';


/**
 * Максмальное время для проверки варината.
 *
 * Данное значение используется в качестве значения по-умолчанию для сценариев
 * тестирования, максимальное время работы которых не указано.
 *
 * @see qa.TestOption
 *
 * @type {number}
 */
qa.CASE_TIMEOUT = 60000;


/**
 * Максмальное время для проверки варината взаимодействия.
 *
 * Данное значение используется в качестве значения по-умолчанию для сценариев
 * взаимодействия, максимальное время работы которых не указано.
 *
 * @see qa.TestOption
 *
 * @type {number}
 */
qa.APP_CASE_TIMEOUT = 300000;


/**
 * Настройка максимального времени выполнения тестового сценария.
 *
 * Пример настройки варинта с именем "my-cool-apps":
 * ```
 * base[qa.TIMEOUT_PREFIX + 'my-cool-apps'] = 10000;
 * ```
 *
 * Время указыватся в миллисекундах.
 *
 * @see qa.TestOption
 * @see qa.TestBase
 * @see qa.TestScenario
 *
 * @type {string}
 */
qa.TIMEOUT_PREFIX = 'timeout-';


/**
 * Настройка шага инициализации исходного состояния теста и передачи входных
 * данных.
 *
 * Для сценария взаимодействия входные данные должны быть массивом
 * соответсвующим последовательности отсортированных полей сценариев
 * взаимодействия. Например:
 *
 * ```
 * base[qa.APP_CASE_PREFIX + 'my-cool-apps'] = {
 *   '5-app': async.script.sequence([
 *     qa.assert.equals('5', 'Input is "5".')
 *   ]),
 *
 *   '1-app': async.script.sequence([
 *     qa.assert.equals('2', 'Input is "1".')
 *   ])
 * };
 *
 * base[qa.SETUP_PREFIX + 'my-cool-apps'] = async.insert(['1', '5']);
 * ```
 *
 * Если шаг инициализации не задан, входными данными любого сценария будет
 * значение `null`.
 *
 * @see async.Input
 * @see qa.AppCaseScenario
 * @see async.Step
 * @see async.insert
 * @see qa.assert.equals
 *
 * @type {string}
 */
qa.SETUP_PREFIX = 'setup-';


/**
 * Последовательный запуск тестовых сценариев выбранного базового объекта.
 *
 * Результатом выполнения теста является вызов обработчика результата теста. В
 * качестве аргумента обработчик принимает объект результата теста.
 *
 * Запуск может опционально аргументироваться именами тестов, которые следует
 * выполнить.
 *
 * @see qa.TestScenario
 * @see qa.TestBase
 * @see qa.result.IResult
 *
 * @param {!qa.TestBase} base Базовый объект теста.
 * @param {function(!qa.result.IResult)} complete Обработчик результата.
 * @param {!async.ErrorHandler} cancel Обработчик ошибки.
 * @param {!Array.<string>=} opt_names Имена тестов для запуска.
 */
qa.run = function(base, complete, cancel, opt_names) {
  var suite = new qa.result.folder.Suite();
  var cases = [];

  if (opt_names !== undefined) {
    for (var i = 0; i < opt_names.length; i += 1) {
      var name = opt_names[i];

      if (base[qa.CASE_PREFIX + name] !== undefined) {
        cases.push(qa.__buildCase(base, name));
      } else if (base[qa.APP_CASE_PREFIX + name] !== undefined) {
        cases.push(qa.__buildApplicationCase(base, name));
      }
    }
  } else {
    for (var key in base) {
      if (key.indexOf(qa.CASE_PREFIX) === 0) {
        cases.push(qa.__buildCase(base, key.substr(qa.CASE_PREFIX.length)));
      } else if (key.indexOf(qa.APP_CASE_PREFIX) === 0) {
        cases.push(qa.__buildApplicationCase(base,
            key.substr(qa.APP_CASE_PREFIX.length)));
      }
    }
  }

  suite.processState(qa.EventType.BEGIN);
  async.proc.sequence(cases).call(suite, null, function() {
    suite.processState(qa.EventType.END);
    complete(suite.getResult());
  }, cancel);
};


/**
 * @param {!Object} base Реестр тестов.
 * @param {string} name Имя.
 * @return {!async.Step} Кейс.
 */
qa.__buildCase = function(base, name) {
  return qa.__case(name,
      base[qa.SETUP_PREFIX + name] || async.nop,
      base[qa.CASE_PREFIX + name] || async.nop,
      base[qa.TIMEOUT_PREFIX + name] || qa.CASE_TIMEOUT);
};


/**
 * @param {!Object} base Реестр тестов.
 * @param {string} name Имя.
 * @return {!async.Step} Кейс.
 */
qa.__buildApplicationCase = function(base, name) {
  return qa.__applicationCase(name,
      base[qa.SETUP_PREFIX + name] || async.nop,
      base[qa.APP_CASE_PREFIX + name] || {},
      base[qa.TIMEOUT_PREFIX + name] || qa.CASE_TIMEOUT);
};


/**
 * @param {string} name Имя.
 * @param {!async.Step} input Сценарии тестирования.
 * @param {!async.Step} step Сценарии тестирования.
 * @param {number} timeout Максимальное время выполнения.
 * @return {!async.Step} Тест.
 */
qa.__case = function(name, input, step, timeout) {
  return async.context.isolate(async.script.sequence([
    qa.__processState(qa.EventType.SETUP),
    async.error.try(qa.__timeout(input, timeout), qa.__errorCatcher),
    qa.__processState(qa.EventType.BEGIN),
    async.error.try(qa.__timeout(step, timeout), qa.__errorCatcher),
    qa.__processState(qa.EventType.END)
  ]), qa.__createFolder(name));
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
  var keys = Object.keys(scenario).sort();

  var i = 0;
  while (i < keys.length) {
    test.push(qa.__case(keys[i], async.nop, scenario[keys[i]], timeout));

    i += 1;
  }

  if (input === async.nop) {
    var source = [];

    while (source.length < keys.length) {
      source.push(null);
    }

    input = async.insert(source);
  }

  return qa.__case(name, input, async.proc.zip.parallel(test), timeout);
};


/**
 * @param {string} name Имя.
 * @return {!async.Step} Метод создания.
 */
qa.__createFolder = function(name) {

  /**
   * @this {qa.result.folder.IFolder}
   * @param {async.Input} input Входные данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function factory(input, complete, cancel) {
    complete(this.createChild(name));
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
   * @this {qa.state.Cursor}
   * @param {async.Input} input Входные данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function timeout(input, complete, cancel) {
    var folder = this;
    var done = false;

    /**
     * @param {string} error Сообщение ошибки.
     * @param {number=} opt_code Код ошибки.
     */
    function localCancel(error, opt_code) {
      done = true;
      cancel(error, opt_code);
    }

    /**
     * @param {async.Output} output Данные.
     */
    function localComplete(output) {
      if (!done && (done = true)) {
        complete(input);
      }
    }

    /**
     *
     */
    function localTimeout() {
      if (!done && (done = true)) {
        folder.processState(qa.EventType.TIMEOUT);
        complete(input);
      }
    }

    setTimeout(localTimeout, time);
    step.call(this, input, localComplete, localCancel);
  }

  return timeout;
};


/**
 * @param {string} message Сообщение об ошибке.
 * @param {number=} opt_code Код ошибки.
 * @return {!async.Step} Шаг обработки.
 */
qa.__errorCatcher = function(message, opt_code) {

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} input Входные данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function catcher(input, complete, cancel) {
    var result = this.getResult();
    if (result.getFailCount() === 0) {
      this.addResult(qa.result.exception(), message);
    }

    complete(input);
  }

  return catcher;
};


/**
 * @param {!qa.EventType} tag Тег результата.
 * @return {!async.Step} Шаг обработки.
 */
qa.__processState = function(tag) {

  /**
   * @this {qa.state.Cursor}
   * @param {async.Input} input Входные данные.
   * @param {!async.CompleteHandler} complete Обработчик результата.
   * @param {!async.ErrorHandler} cancel Обработчик ошибки.
   */
  function process(input, complete, cancel) {
    this.processState(tag);
    complete(input);
  }

  return process;
};

