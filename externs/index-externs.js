 

/**
 * @namespace
 */
var qa = {};

/**
 * @param {function(!qa.TestCase)} scenario Сценарий тестирования.
 */
qa.run = function(scenario) {};

/**
 * @namespace
 */
qa.assert = {};

/**
 * @param {!boolean} value Значение.
 * @param {string=} opt_message Комментарий к утверждению.
 */
qa.assert.ok = function(value, opt_message) {};

/**
 * @namespace
 */
qa.format = {};

/**
 * @param {!*} node Узел дерева.
 * @param {!Array.<*>} path Путь в дереве.
 * @param {!Object} obj Дерево.
 */
qa.format.addNode = function(node, path, obj) {};

/**
 * @return {!Object} Отчет о тестах в формате JSON.
 */
qa.format.report = function() {};

/**
 * @return {!Object} Отчет о тестах в формате JSON.
 */
qa.format.summaryReport = function() {};

/**
 * @namespace
 */
qa.report = {};

/**
 * @param {!qa.report.Reporter} reporter Репортер.
 */
qa.report.setReporter = function(reporter) {};

/**
 * @return {!Array.<!qa.report.ReportItem>} Репорт выполнения.
 */
qa.report.getReport = function() {};

/**
 * @param {!Array.<!qa.report.ReportItem>} items
 * @param {string} type
 * @return {!Array.<!qa.report.ReportItem>}
 */
qa.report.filterItemsByType = function(items, type) {};

/**
 * @param {!qa.report.ReportItem} data
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel Обработчик ошибки.
 */
qa.report.asyncGetType = function(data, complete, cancel) {};

/**
 * @constructor
 * @param {string} type
 * @param {string=} opt_name
 */
qa.report.ReportItem = function(type, opt_name) {};

/**
 * @return {string} Время.
 */
qa.report.ReportItem.prototype.getTime = function() {};

/**
 * @return {string} Тип записи.
 */
qa.report.ReportItem.prototype.getType = function() {};

/**
 * @return {string|undefined} Имя записи.
 */
qa.report.ReportItem.prototype.getName = function() {};

/**
 * @constructor
 * @extends {qa.report.ReportItem}
 * @param {!string} id
 * @param {!boolean} value
 * @param {string=} opt_name
 * @param {string=} opt_testCaseName
 */
qa.report.AssertionItem = function(id, value, opt_name, opt_testCaseName) {};

/**
 * @return {string} Время.
 */
qa.report.AssertionItem.prototype.getId = function() {};

/**
 * @return {boolean}
 */
qa.report.AssertionItem.prototype.getValue = function() {};

/**
 * @constructor
 */
qa.report.Reporter = function() {};

/**
 * Добавляет утверждение в журнал.
 * @param {!boolean} value Истинность утверждения.
 * @param {string=} opt_name Утверждение.
 */
qa.report.Reporter.prototype.addAssertion = function(value, opt_name) {};

/**
 * @return {!Array.<!qa.report.ReportItem>} Репорт выполнения.
 */
qa.report.Reporter.prototype.getReport = function() {};

/**
 * @param {string=} opt_name Имя.
 */
qa.report.Reporter.prototype.caseStarted = function(opt_name) {};

/**
 * @param {string=} opt_name Имя.
 */
qa.report.Reporter.prototype.caseStopped = function(opt_name) {};

/**
 * @enum {string}
 */
qa.report.ReportItemType = {
  ASSERTION_RESULT: 'assertion-result',

  TEST_CASE_STARTED: 'test-case-started',
  TEST_CASE_STOPPED: 'test-case-stopped',
  TEST_STEP_STARTED: 'test-step-started'
};

/**
 * @constructor
 * @param {string=} opt_name Имя тест-кейса.
 */
qa.TestCase = function(opt_name) {};

/**
 * @return {string|undefined} Имя теста.
 */
qa.TestCase.prototype.getName = function() {};

/**
 * @param {!async.TaskFunction} step Задача шага.
 */
qa.TestCase.prototype.setUp = function(step) {};

/**
 * @param {!async.TaskFunction} step Задача шага.
 */
qa.TestCase.prototype.addStep = function(step) {};

/**
 * @param {!qa.TestCase} testCase Задача шага.
 */
qa.TestCase.prototype.addCase = function(testCase) {};

/**
 * @param {!async.TaskFunction} step Задача шага.
 */
qa.TestCase.prototype.tearDown = function(step) {};

/**
 * @return {!async.TaskFunction} Дейсвие выполнения сценария.
 */
qa.TestCase.prototype.buildStep = function() {};


