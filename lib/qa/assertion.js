


/**
 * @constructor
 * @implements {qa.IResult}
 * @param {boolean} value начение утверждения.
 */
qa.Assertion = function(value) {

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
qa.Assertion.prototype.getAssertionCount = function() {
  return this.__assertionCount;
};


/**
 * @inheritDoc
 */
qa.Assertion.prototype.getFailCount = function() {
  return this.__failCount;
};


/**
 * @inheritDoc
 */
qa.Assertion.prototype.get = function() {
  return this.__failCount === 0;
};
