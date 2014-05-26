


/**
 * Исключительная ситуация.
 *
 * Является результатом теста.
 *
 * @constructor
 * @implements {qa.result.IResult}
 *
 * @param {string=} opt_comment
 */
qa.result.Exception = function(opt_comment) {

  /**
   * @type {string}
   */
  this.__comment = opt_comment || '';

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


/**
 * @return {string}
 */
qa.result.Exception.prototype.getComment = function() {
  return this.__comment;
};

