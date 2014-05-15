


/**
 * Утверждение.
 *
 * Является результатом теста.
 *
 * @constructor
 * @implements {qa.result.IResult}
 * @param {boolean} value Значение истинности утверждения.
 * @param {string=} opt_comment  Комментарий.
 */
qa.result.Assertion = function(value, opt_comment) {

  /**
   * @type {number}
   */
  this.__assertionCount = 1;

  /**
   * @type {number}
   */
  this.__failCount = value ? 0 : 1;

  /**
   * @type {string}
   */
  this.__comment = opt_comment || '';
};


/**
 * @inheritDoc
 */
qa.result.Assertion.prototype.getAssertionCount = function() {
  return this.__assertionCount;
};


/**
 * @inheritDoc
 */
qa.result.Assertion.prototype.getFailCount = function() {
  return this.__failCount;
};


/**
 * @inheritDoc
 */
qa.result.Assertion.prototype.get = function() {
  return this.__failCount === 0;
};


/**
 * @return {string}
 */
qa.result.Assertion.prototype.getComment = function() {
  return this.__comment;
};
