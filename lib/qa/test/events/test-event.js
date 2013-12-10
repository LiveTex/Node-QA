


/**
 * @constructor
 * @param {string} scenarioName Имя сценария события.
 * @param {boolean} isProblem Проблемное ли события.
 */
qa.test.events.TestEvent = function(scenarioName, isProblem) {

  /**
   * @type {boolean}
   */
  this.__isProblem = isProblem;

  /**
   * @type {string}
   */
  this.__scenarioName = scenarioName;
};


/**
 * @return {boolean} Результат поверки.
 */
qa.test.events.TestEvent.prototype.isProblem = function() {
  return this.__isProblem;
};


/**
 * @return {string} Имя сценария события.
 */
qa.test.events.TestEvent.prototype.getScenarioName = function() {
  return this.__scenarioName;
};
