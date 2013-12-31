


/**
 * Утверждение.
 *
 * Является результатом теста.
 *
 * @constructor
 * @implements {qa.result.IResult}
 * @param {boolean} value Значение истинности утверждения.
 */
qa.result.Assertion = function(value) {

  /**
   * @type {number}
   */
  this.__assertionCount = 1;

  /**
   * @type {number}
   */
  this.__failCount = value ? 0 : 1;
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
