var util = require('util');
var async = require('node-async');
var ts = require('node-ts');
var events = require('events');
var assert = require('assert');


/**
 * @namespace
 */
var qa = {};


/**
 * @param {function(!qa.TestCase)} scenario Сценарий тестирования.
 */
qa.run = function(scenario) {
  function buildReport() {
    console.log(JSON.stringify(qa.format.summaryReport(), [''], 2));
    process.exit(0);
  }

  var reporter = new qa.report.Reporter();
  qa.report.setReporter(reporter);

  var suite = new qa.TestCase('Test suite.');
  scenario(suite);
  suite.buildStep()(null, buildReport, buildReport);
};


/**
 * @namespace
 */
qa.assert = {};


/**
 * @param {!boolean} value Значение.
 * @param {string=} opt_message Комментарий к утверждению.
 */
qa.assert.ok = function(value, opt_message) {
  qa.report.__reporter.addAssertion(value, opt_message);
};


/**
 * @namespace
 */
qa.format = {};


/**
 * @param {!*} node Узел дерева.
 * @param {!Array.<*>} path Путь в дереве.
 * @param {!Object} obj Дерево.
 */
qa.format.addNode = function(node, path, obj) {
  var step = path.shift();
  if (path.length === 0) {
    obj[step] = node;
  } else if ((obj[step] !== null) && (typeof obj[step] === 'object')) {
    qa.format.addNode(node, path, obj[step]);
  }
};


/**
 * @return {!Object} Отчет о тестах в формате JSON.
 */
qa.format.report = function() {
  var path = [];
  var result = {};
  var items = qa.report.__reporter.getReport();
  for (var i in items) {
    var item = items[i];
    switch (item.getType()) {
      case qa.report.ReportItemType.TEST_CASE_STARTED:
        path.push(item.getName());
        qa.format.addNode({}, path.slice(0), result);
        break;
      case qa.report.ReportItemType.TEST_CASE_STOPPED:
        path.pop();
        break;
      case qa.report.ReportItemType.ASSERTION_RESULT:
        qa.format.addNode(item.getValue(),
            path.slice(0).concat('Assertion#' + item.getId()), result);
        break;
    }
  }
  return result;
};


/**
 * @return {!Object} Отчет о тестах в формате JSON.
 */
qa.format.summaryReport = function() {
  var statistics = {
    'tests-passed': 0,
    'tests-failed': 0,
    'assertion-passed': 0,
    'assertion-failed': 0
  };
  var items = qa.report.__reporter.getReport();
  var test_status = true;

  for (var i in items) {
    var item = items[i];
    switch (item.getType()) {
      case qa.report.ReportItemType.TEST_CASE_STARTED:
        test_status = true;
        break;
      case qa.report.ReportItemType.TEST_CASE_STOPPED:
        if (test_status) {
          statistics['tests-passed'] += 1;
        } else {
          statistics['tests-failed'] += 1;
        }
        test_status = true;
        break;
      case qa.report.ReportItemType.ASSERTION_RESULT:
        var assertion_status = item.getValue();
        test_status = test_status && assertion_status;
        if (assertion_status) {
          statistics['assertion-passed'] += 1;
        } else {
          statistics['assertion-failed'] += 1;
        }
        break;
    }
  }
  return statistics;
};


/**
 * @namespace
 */
qa.report = {};


/**
 * @type {qa.report.Reporter}
 */
qa.report.__reporter = null;


/**
 * @param {!qa.report.Reporter} reporter Репортер.
 */
qa.report.setReporter = function(reporter) {
  qa.report.__reporter = reporter;
};


/**
 * @return {!Array.<!qa.report.ReportItem>} Репорт выполнения.
 */
qa.report.getReport = function() {
  return qa.report.__reporter.getReport();
};


/**
 * @param {!Array.<!qa.report.ReportItem>} items
 * @param {string} type
 * @return {!Array.<!qa.report.ReportItem>}
 */
qa.report.filterItemsByType = function(items, type) {
  return items.filter(function(item) {
    return item.getType() === type;
  });
};


/**
 * @param {!qa.report.ReportItem} data
 * @param {function(string)} complete
 * @param {function(string, number=)} cancel Обработчик ошибки.
 */
qa.report.asyncGetType = function(data, complete, cancel) {
  complete(data.getType());
};



/**
 * @constructor
 * @extends {qa.report.ReportItem}
 * @param {!string} id
 * @param {!boolean} value
 * @param {string=} opt_name
 * @param {string=} opt_testCaseName
 */
qa.report.AssertionItem = function(id, value, opt_name, opt_testCaseName) {
  qa.report.ReportItem.call(this,
      qa.report.ReportItemType.ASSERTION_RESULT, opt_name);

  /**
   * @type {string}
   */
  this.__id = id;

  /**
   * @type {boolean}
   */
  this.__value = value;

  /**
   * @type {string|undefined}
   */
  this.__testCaseName = opt_testCaseName;
};

util.inherits(qa.report.AssertionItem, qa.report.ReportItem);


/**
 * @return {string} Время.
 */
qa.report.AssertionItem.prototype.getId = function() {
  return this.__id;
};


/**
 * @return {boolean}
 */
qa.report.AssertionItem.prototype.getValue = function() {
  return this.__value;
};



/**
 * @constructor
 */
qa.report.Reporter = function() {

  /**
   * @type {!Array.<!qa.report.ReportItem>}
   */
  this.__items = [];

  /**
   * @type {number}
   */
  this.__assertionCounter = 0;

};


/**
 * Добавляет утверждение в журнал.
 * @param {!boolean} value Истинность утверждения.
 * @param {string=} opt_name Утверждение.
 */
qa.report.Reporter.prototype.addAssertion = function(value, opt_name) {
  this.__assertionCounter += 1;
  this.__items.push(
      new qa.report.AssertionItem(String(this.__assertionCounter),
      value, opt_name));
};


/**
 * @return {!Array.<!qa.report.ReportItem>} Репорт выполнения.
 */
qa.report.Reporter.prototype.getReport = function() {
  return this.__items;
};


/**
 * @param {string} name Имя.
 */
qa.report.Reporter.prototype.caseStarted = function(name) {
  this.__items.push(new qa.report.ReportItem(
      qa.report.ReportItemType.TEST_CASE_STARTED,
      name));
};


/**
 * @param {string} name Имя.
 */
qa.report.Reporter.prototype.caseStopped = function(name) {
  this.__items.push(new qa.report.ReportItem(
      qa.report.ReportItemType.TEST_CASE_STOPPED,
      name));
};



/**
 * @constructor
 * @param {string} type
 * @param {string=} opt_name
 */
qa.report.ReportItem = function(type, opt_name) {

  /**
   * @type {string}
   */
  this.__type = type;

  /**
   * @type {string|undefined} Имя записи.
   */
  this.__name = opt_name;

  /**
   * @type {string}
   */
  this.__time = Date.now().toString();
};


/**
 * @return {string} Время.
 */
qa.report.ReportItem.prototype.getTime = function() {
  return this.__time;
};


/**
 * @return {string} Тип записи.
 */
qa.report.ReportItem.prototype.getType = function() {
  return this.__type;
};


/**
 * @return {string|undefined} Имя записи.
 */
qa.report.ReportItem.prototype.getName = function() {
  return this.__name;
};


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
qa.TestCase = function(opt_name) {

  /**
   * @type {string|undefined} Имя тест-кейса.
   */
  this.__name = opt_name;

  /**
   * @type {!Array.<!async.TaskFunction>}
   */
  this.__steps = [];

  /**
   * @type {!async.TaskFunction}
   */
  this.__setUp = async.nop;

  /**
   * @type {!async.TaskFunction}
   */
  this.__tearDown = async.nop;

  this.setUp(async.nop);
  this.tearDown(async.nop);
};


/**
 * @return {string|undefined} Имя теста.
 */
qa.TestCase.prototype.getName = function() {
  return this.__name;
};


/**
 * @param {!async.TaskFunction} step Задача шага.
 */
qa.TestCase.prototype.setUp = function(step) {
  var self = this;

  this.__setUp = function(data, complete, cancel) {
    qa.report.__reporter.caseStarted(self.getName());
    step.call(null, self, complete, cancel);
  };
};


/**
 * @param {!async.TaskFunction} step Задача шага.
 */
qa.TestCase.prototype.addStep = function(step) {
  var self = this;

  this.__steps.push(function(data, complete, cancel) {
    step.call(null, self, complete, cancel);
  });
};


/**
 * @param {!qa.TestCase} testCase Задача шага.
 */
qa.TestCase.prototype.addCase = function(testCase) {
  this.__steps.push(testCase.buildStep());
};


/**
 * @param {!async.TaskFunction} step Задача шага.
 */
qa.TestCase.prototype.tearDown = function(step) {
  var self = this;

  this.__tearDown = function(data, complete, cancel) {
    function localComplete(data) {
      qa.report.__reporter.caseStopped(self.getName());
      complete(data);
    }

    step.call(null, self, localComplete, cancel);
  };
};


/**
 * @return {!async.TaskFunction} Дейсвие выполнения сценария.
 */
qa.TestCase.prototype.buildStep = function() {
  return async.sequence(
      [this.__setUp].concat(this.__steps).concat(this.__tearDown));
};


/**
 * @type {*}
 */
module.exports = qa;
