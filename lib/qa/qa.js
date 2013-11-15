

/**
 * @namespace
 */
var qa = {};


/**
 * Build Report.
 */
function buildReport() {
  console.log(JSON.stringify(qa.format.summaryReport(), [''], 2));
  process.exit(0);
}


/**
 * @param {function(!qa.TestCase)} scenario Сценарий тестирования.
 */
qa.run = function(scenario) {
  var reporter = new qa.report.Reporter();
  qa.report.setReporter(reporter);

  var suite = new qa.TestCase('Test suite.');
  scenario(suite);
  suite.buildStep()(null, buildReport, buildReport);
};


/**
 * @param {!Object} testsObj Test Object.
 * @param {!string} testCase Test Case.
 */
qa.runner = function(testsObj, testCase) {
  if (typeof testsObj === 'object') {
    if (testsObj[testCase] instanceof qa.TestCase) {
      testsObj[testCase].buildStep()(null, buildReport, buildReport);
    } else if (typeof testsObj[testCase] === 'function') {
      testsObj[testCase].call(null);
    } else if (typeof testsObj[testCase] === 'object') {
      for (var key in testsObj[testCase]) {
        if (testsObj[testCase].hasOwnProperty(key)) {
          qa.runner(testsObj[testCase], key);
        }
      }
    }
  }
};
