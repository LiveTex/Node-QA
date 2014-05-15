


/**
 * Исключительная ситуация.
 *
 * Является результатом теста.
 *
 * @constructor
 * @implements {qa.result.IResult}
 *
 * @param {Error=} opt_exception
 */
qa.result.Exception = function(opt_exception) {

  /**
   * @type {Error}
   */
  this.__exception = opt_exception || null;

};


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
