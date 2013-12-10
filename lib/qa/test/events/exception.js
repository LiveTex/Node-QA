


/**
 * @constructor
 * @extends {qa.test.events.TestEvent}
 * @param {string} scenarioName Имя сценария события.
 * @param {boolean} isFailed Верно ли утверждение.
 * @param {string} comment Комментарий.
 * @param {string} message Ошибка.
 */
qa.test.events.Exception = function(scenarioName, isFailed, comment, message) {
  qa.test.events.TestEvent.call(this, scenarioName, isFailed, message);
};

util.inherits(qa.test.events.Exception, qa.test.events.TestEvent);
