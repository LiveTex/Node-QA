


/**
 * @constructor
 * @implements {qa.test.IResult}
 * @param {!qa.test.IResult} target Утверждение.
 * @param {!qa.test.IResult} base Предыдущий результат.
 */
qa.test.Result = function(target, base) {

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
qa.test.Result.prototype.getAssertionCount = function() {
  return this.__assertionCount;
};


/**
 * @inheritDoc
 */
qa.test.Result.prototype.getFailCount = function() {
  return this.__failCount;
};


/**
 * @inheritDoc
 */
qa.test.Result.prototype.get = function() {
  return this.__failCount === 0;
};
