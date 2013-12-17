


/**
 * @constructor
 * @implements {qa.test.IResult}
 */
qa.test.BaseResult = function() {};


/**
 * @inheritDoc
 */
qa.test.BaseResult.prototype.getAssertionCount = function() {
  return 0;
};


/**
 * @inheritDoc
 */
qa.test.BaseResult.prototype.getFailCount = function() {
  return 0;
};


/**
 * @inheritDoc
 */
qa.test.BaseResult.prototype.get = function() {
  return true;
};
