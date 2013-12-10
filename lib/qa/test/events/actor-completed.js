


/**
 * @constructor
 * @extends {qa.test.events.TestEvent}
 * @param {string} scenarioName Имя сценария события.
 * @param {boolean} isFailed Верно ли утверждение.
 * @param {string} comment Комментарий.
 */
qa.test.events.ActorCompleted = function(scenarioName, isFailed, comment) {
  qa.test.events.TestEvent.call(this, scenarioName, isFailed);

  /**
   * @type {string}
   */
  this.__comment = comment;
};
