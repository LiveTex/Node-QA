

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

