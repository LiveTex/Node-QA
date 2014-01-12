


/**
 * Исключительная ситуация.
 *
 * Является результатом теста.
 *
 * @constructor
 * @implements {qa.result.IResult}
 */
qa.result.Exception = function() {};


/**
 * @inheritDoc
 */
qa.result.Exception.prototype.getAssertionCount = function() {
  return 0;
};


/**
 * @inheritDoc
 */
qa.result.Exception.prototype.getFailCount = function() {
  return 1;
};


/**
 * @inheritDoc
 */
qa.result.Exception.prototype.get = function() {
  return false;
};
