


/**
 * @constructor
 * @implements {qa.IResult}
 * @param {!qa.IResult} target Утверждение.
 * @param {!qa.IResult} base Предыдущий результат.
 */
qa.Result = function(target, base) {

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
qa.Result.prototype.getAssertionCount = function() {
  return this.__assertionCount;
};


/**
 * @inheritDoc
 */
qa.Result.prototype.getFailCount = function() {
  return this.__failCount;
};


/**
 * @inheritDoc
 */
qa.Result.prototype.get = function() {
  return this.__failCount === 0;
};
