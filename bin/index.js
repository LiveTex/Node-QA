var util = require('util');
var async = require('node-async');
var events = require('events');
var assert = require('assert');



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
qa.run = function(scenario) {

  function buildReport() {
    qa.report.buildReport();
    process.exit();
  }

  var reporter = new qa.report.Reporter();
  qa.report.setReporter(reporter);

  var suite = new qa.TestCase("Test suite.");
  scenario(suite);
  suite.buildStep()(null, buildReport, buildReport);
};


/**
 * @param {!boolean} value Значение.
 * @param {string=} opt_message Комментарий к утверждению.
 */
qa.assert.ok = function(value, opt_message) {
  qa.report.__reporter.addAssertion(value, opt_message);
};


/**
 * @type {!qa.report.Reporter}
 */
qa.report.__reporter = {};


/**
 * @param {!qa.report.Reporter} reporter Репортер.
 */
qa.report.setReporter = function(reporter) {
  qa.report.__reporter = reporter;
};


/**
 * @constructor
 */
qa.report.Reporter = function() {

  /**
   * @type {!Array<!qa.report.ReportItem>}
   * @private
   */
  this.__items = [];

};


/**
 * Добавляет утверждение в журнал.
 * @param {!boolean} value Истинность утверждения.
 * @param {!string} name Утверждение.
 */
qa.report.Reporter.prototype.addAssertion = function(value, name) {
  this.__items.push(new qa.report.AssertionItem(value, name));
};


/**
 * @returns {!Array<!qa.report.ReportItem>} Репорт выполнения.
 */
qa.report.getReport = function() {
  return qa.report.__reporter.getReport();
};


/**
 * @returns {!Array<!qa.report.ReportItem>} Репорт выполнения.
 */
qa.report.Reporter.prototype.getReport = function() {
  return this.__items;
};


/**
 * @param name
 */
qa.report.Reporter.prototype.caseStarted = function(name) {
  this.__items.push(new qa.report.ReportItem(
    qa.report.ReportItemType.TEST_CASE_STARTED,
    name,
    {}
  ));
};


/**
 * @param name
 */
qa.report.Reporter.prototype.caseStopped = function(name) {
  this.__items.push(new qa.report.ReportItem(
    qa.report.ReportItemType.TEST_CASE_STOPPED,
    name,
    {}
  ));
};


/**
 * @param {!string} type
 * @param {!string} name
 * @param {!Object} data
 * @constructor
 */
qa.report.ReportItem = function(type, name, data) {

  /**
   * @type {!string}
   * @private
   */
  this.__type = type;


  /**
   * @type {!string} Имя записи.
   * @private
   */
  this.__name = name;


  /**
   * @type {!Object}
   * @private
   */
  this.__data = data;

};


/**
 * @returns {!string} Тип записи.
 */
qa.report.ReportItem.prototype.getType = function() {
  return this.__type;
}

qa.report.AssertionItem = function(value, name, testCaseName) {

  /**
   * @type {!string}
   * @private
   */
  this.__type = qa.report.ReportItemType.ASSERTION_RESULT;

  /**
   * @type {string=}
   * @private
   */
  this.__name = name;


  /**
   * @type {!boolean}
   * @private
   */
  this.__value = value;


  /**
   * @type {!string}
   * @private
   */
  this.__testCaseName = testCaseName;
};

util.inherits(qa.report.AssertionItem, qa.report.ReportItem);


/**
 * @return {!boolean}
 */
qa.report.AssertionItem.prototype.getValue = function() {
  return this.__value;
};


/**
 * @param {!Array<!qa.report.ReportItem>} items
 * @param {!string} type
 * @return {!Array<!qa.report.ReportItem>}
 */
qa.report.filterItemsByType = function(items, type) {
  return items.filter(function (item) {
    return item.getType() === type;
  })
};


/**
 * @param {qa.report.ReportItem} data
 * @param {!function(*)} complete
 * @constructor
 */
qa.report.AsyncGetType = function (data, complete){
  complete(data.getType());
};



/**
 * @enum {string}
 */
qa.report.ReportItemType = {
  ASSERTION_RESULT: "assertion-result",

  TEST_CASE_STARTED: "test-case-started",
  TEST_CASE_STOPPED: "test-case-stopped",
  TEST_STEP_STARTED: "test-step-started"
};

qa.report.getItemTypeStatistic = function(items, complete) {
  var typeStatistic = {};
  typeStatistic[qa.report.ReportItemType.ASSERTION_RESULT] = 0;
  typeStatistic[qa.report.ReportItemType.TEST_CASE_STARTED] = 0;
  typeStatistic[qa.report.ReportItemType.TEST_CASE_STOPPED] = 0;
  typeStatistic[qa.report.ReportItemType.TEST_STEP_STARTED] = 0;

  complete(items.reduce(
    function(stat, current){
      stat[current] += 1;
      return stat;
    },
    typeStatistic));
};


qa.report.getAssertionStatistic = function(items, complete) {
  var assertionStatistic = {
    ok: 0,
    fail: 0
  };

  complete(items.reduce(
    function(stat, current) {
      if (current.getValue()) {
        stat["ok"] += 1;
      } else {
        stat["fail"] += 1;
      }
      return stat;
    },
    assertionStatistic
  ));
};


qa.report.buildReport = function() {
  async.sequence([
    async.each(qa.report.AsyncGetType),
    qa.report.getItemTypeStatistic
  ])(qa.report.__reporter.getReport(),
     qa.report.printSummaryReport,
     console.log);
  async.sequence([
    qa.report.getAssertionStatistic
  ])(qa.report.filterItemsByType(
      qa.report.__reporter.getReport(),
      qa.report.ReportItemType.ASSERTION_RESULT
     ),
     qa.report.printAssertionReport,
     console.log
    );
};


qa.report.printSummaryReport = function(stat) {
  console.log("------- SUMMARY -------");
  console.log(stat[qa.report.ReportItemType.TEST_CASE_STARTED] + " tests, " +
              stat[qa.report.ReportItemType.TEST_CASE_STOPPED] + " successful, " +
              (stat[qa.report.ReportItemType.TEST_CASE_STARTED] -
              stat[qa.report.ReportItemType.TEST_CASE_STOPPED]) + " fail. ");
};

qa.report.printAssertionReport = function(stat) {
  var logger = undefined;
  if (stat["fail"] > 0) {
    logger = console.warn;
  } else {
    logger = console.error;
  }

  logger(stat["ok"] + " assertions, " + stat["fail"] + " fail.");
};



/**
 * @param {string=} opt_name Имя тест-кейса.
 * @constructor
 */
qa.TestCase = function(opt_name) {

  /**
   * @type {string=} Имя тест-кейса.
   * @private
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
 * @return {string=} Имя теста.
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
    qa.report.__reporter.caseStopped(self.getName());
    step.call(null, self, complete, cancel);
  }
};


/**
 * @return {!async.TaskFunction} Дейсвие выполнения сценария.
 */
qa.TestCase.prototype.buildStep = function() {
  return async.sequence(
    [this.__setUp].concat(this.__steps).concat(this.__tearDown));
};


module.exports = qa;