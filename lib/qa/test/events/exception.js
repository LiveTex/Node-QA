


/**
 * @constructor
 * @extends {qa.test.events.TestEvent}
 * @param {string} scenarioName Имя сценария события.
 * @param {boolean} isFailed Верно ли утверждение.
 * @param {string} comment Комментарий.
 * @param {string} message Ошибка.
 * @param {number=} opt_code Код ошибки.
 */
qa.test.events.Exception = function(scenarioName, isFailed, comment, message,
                                    opt_code) {
  qa.test.events.TestEvent.call(this, scenarioName, isFailed);

  /**
   * @type {string}
   */
  this.__message = message;

  /**
   * @type {number}
   */
  this.__code = opt_code || -1;
};
