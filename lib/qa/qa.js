

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
