 

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
qa.report = {};

/**
 * @param {function(!qa.TestCase)} scenario Сценарий тестирования.
 */
qa.run = function(scenario) {};

/**
 * @param {!boolean} value Значение.
 * @param {string=} opt_message Комментарий к утверждению.
 */
qa.assert.ok = function(value, opt_message) {};

/**
 * @param {!qa.report.Reporter} reporter Репортер.
 */
qa.report.setReporter = function(reporter) {};

/**
 * @constructor
 */
qa.report.Reporter = function() {};

/**
 * Добавляет утверждение в журнал.
 * @param {!boolean} value Истинность утверждения.
 * @param {!string} name Утверждение.
 */
qa.report.Reporter.prototype.addAssertion = function(value, name) {};

/**
 * @returns {!Array<!qa.report.ReportItem>} Репорт выполнения.
 */
qa.report.getReport = function() {};

/**
 * @returns {!Array<!qa.report.ReportItem>} Репорт выполнения.
 */
qa.report.Reporter.prototype.getReport = function() {};

/**
 * @param name
 */
qa.report.Reporter.prototype.caseStarted = function(name) {};

/**
 * @param name
 */
qa.report.Reporter.prototype.caseStopped = function(name) {};

/**
 * @param {!string} type
 * @param {!string} name
 * @param {!Object} data
 * @constructor
 */
qa.report.ReportItem = function(type, name, data) {};

/**
 * @returns {!string} Тип записи.
 */
qa.report.ReportItem.prototype.getType = function() {}

qa.report.AssertionItem = function(value, name, testCaseName) {};

/**
 * @return {!boolean}
 */
qa.report.AssertionItem.prototype.getValue = function() {};

/**
 * @param {!Array<!qa.report.ReportItem>} items
 * @param {!string} type
 * @return {!Array<!qa.report.ReportItem>}
 */
qa.report.filterItemsByType = function(items, type) {};

/**
 * @param {qa.report.ReportItem} data
 * @param {!function(*)} complete
 * @constructor
 */
qa.report.AsyncGetType = function (data, complete){};

/**
 * @enum {string}
 */
qa.report.ReportItemType = {
  ASSERTION_RESULT: "assertion-result",

  TEST_CASE_STARTED: "test-case-started",
  TEST_CASE_STOPPED: "test-case-stopped",
  TEST_STEP_STARTED: "test-step-started"
};

qa.report.getItemTypeStatistic = function(items, complete) {};

/**
 * @param {string=} opt_name Имя тест-кейса.
 * @constructor
 */
qa.TestCase = function(opt_name) {};

/**
 * @return {string=} Имя теста.
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


