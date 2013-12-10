


/**
 * @constructor
 * @param {string} scenarioName Имя сценария события.
 * @param {boolean} isProblem Проблемное ли события.
 * @param {string} comment Имя сценария события.
 */
qa.test.events.TestEvent = function(scenarioName, isProblem, comment) {

  /**
   * @type {boolean}
   */
  this.__isProblem = isProblem;

  /**
   * @type {string}
   */
  this.__scenarioName = scenarioName;

  /**
   * @type {string}
   */
  this.__comment = comment;
};


/**
 * @return {boolean} Результат поверки.
 */
qa.test.events.TestEvent.prototype.isProblem = function() {
  return this.__isProblem;
};


/**
 * @inheritDoc
 */
qa.test.events.TestEvent.prototype.toString = function() {
  return (this.__isProblem ? '\033[31m \u2718 ' : '\033[32m \u2714 ') +
      + ' ' + this.__scenarioName + ' ' + this.__comment + '\033[0m';
};
