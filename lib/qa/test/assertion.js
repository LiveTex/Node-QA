


/**
 * @constructor
 * @implements {qa.test.IResult}
 * @param {boolean} value начение утверждения.
 */
qa.test.Assertion = function(value) {

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
qa.test.Assertion.prototype.getAssertionCount = function() {
  return this.__assertionCount;
};


/**
 * @inheritDoc
 */
qa.test.Assertion.prototype.getFailCount = function() {
  return this.__failCount;
};


/**
 * @inheritDoc
 */
qa.test.Assertion.prototype.get = function() {
  return this.__failCount === 0;
};
