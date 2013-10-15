


/**
 * @namespace
 */
var qa = {};


/**
 * @param {function(!qa.TestCase)} scenario Сценарий тестирования.
 */
qa.run = function(scenario) {
  var suite = new qa.TestCase();
  scenario(suite);
  suite.buildStep()(null, process.exit, console.error);
};
