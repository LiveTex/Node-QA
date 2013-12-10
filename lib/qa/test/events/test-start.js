


/**
 * @constructor
 * @extends {qa.test.events.TestEvent}
 * @param {string} scenarioName Имя сценария события.
 */
qa.test.events.TestStart = function(scenarioName) {
  qa.test.events.TestEvent.call(this, scenarioName, false);
};
