

/**
 * @namespace
 */
var qa = {};


/**
 * Build Report.
 */
qa.buildReport = function() {
  console.log(JSON.stringify(qa.format.summaryReport()));
  process.exit(0);
};


/**
 * @param {function(!qa.TestCase)} scenario Сценарий тестирования.
 */
qa.run = function(scenario) {
  var reporter = new qa.report.Reporter();
  qa.report.setReporter(reporter);

  var suite = new qa.TestCase('Test suite.');
  scenario(suite);
  suite.buildStep()(null, qa.buildReport, qa.buildReport);
};


/**
 * @param {!Object} testsObj Test Object.
 * @param {!string} testCase Test Case.
 * @param {!async.TaskFunction} complete Complete Task.
 * @param {!async.TaskFunction} cancel Cancel Task.
 */
qa.runner = function(testsObj, testCase, complete, cancel) {
  if ((typeof testsObj === 'object') && (testsObj.hasOwnProperty(testCase))) {
    if (testsObj[testCase] instanceof qa.TestCase) {
      testsObj[testCase].buildStep()(null, complete, cancel);
    } else if (typeof testsObj[testCase] === 'function') {
      testsObj[testCase].call(null);
    }
  }
};
