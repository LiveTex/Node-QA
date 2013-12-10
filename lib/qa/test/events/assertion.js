


/**
 * @constructor
 * @extends {qa.test.events.TestEvent}
 * @param {string} scenarioName Имя сценария события.
 * @param {boolean} isFailed Верно ли утверждение.
 * @param {string} comment Комментарий.
 */
qa.test.events.Assertion = function(scenarioName, isFailed, comment) {
  qa.test.events.TestEvent.call(this, scenarioName, isFailed, comment);
};

util.inherits(qa.test.events.Assertion, qa.test.events.TestEvent);
