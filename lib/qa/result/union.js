


/**
 * Объединение результатов теста.
 *
 * @see qa.result.Base
 *
 * @constructor
 * @implements {qa.result.IResult}
 * @param {!qa.result.IResult} target Утверждение.
 * @param {!qa.result.IResult} base Предыдущий результат.
 */
qa.result.Union = function(target, base) {

  /**
   * @type {number}
   */
  this.__assertionCount = base.getAssertionCount() +
      target.getAssertionCount();

  /**
   * @type {number}
   */
  this.__failCount = base.getFailCount() + target.getFailCount();
};


/**
 * @inheritDoc
 */
qa.result.Union.prototype.getAssertionCount = function() {
  return this.__assertionCount;
};


/**
 * @inheritDoc
 */
qa.result.Union.prototype.getFailCount = function() {
  return this.__failCount;
};


/**
 * @inheritDoc
 */
qa.result.Union.prototype.get = function() {
  return this.__failCount === 0;
};
