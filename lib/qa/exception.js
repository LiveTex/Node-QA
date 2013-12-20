


/**
 * @constructor
 * @implements {qa.IResult}
 */
qa.Exception = function() {};


/**
 * @inheritDoc
 */
qa.Exception.prototype.getAssertionCount = function() {
  return 0;
};


/**
 * @inheritDoc
 */
qa.Exception.prototype.getFailCount = function() {
  return 1;
};


/**
 * @inheritDoc
 */
qa.Exception.prototype.get = function() {
  return false;
};
