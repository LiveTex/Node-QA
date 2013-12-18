


/**
 * @constructor
 * @implements {qa.test.IResult}
 */
qa.test.Exception = function() {};


/**
 * @inheritDoc
 */
qa.test.Exception.prototype.getAssertionCount = function() {
  return 0;
};


/**
 * @inheritDoc
 */
qa.test.Exception.prototype.getFailCount = function() {
  return 1;
};


/**
 * @inheritDoc
 */
qa.test.Exception.prototype.get = function() {
  return false;
};
