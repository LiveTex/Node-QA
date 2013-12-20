


/**
 * @constructor
 * @implements {qa.IResult}
 */
qa.BaseResult = function() {};


/**
 * @inheritDoc
 */
qa.BaseResult.prototype.getAssertionCount = function() {
  return 0;
};


/**
 * @inheritDoc
 */
qa.BaseResult.prototype.getFailCount = function() {
  return 0;
};


/**
 * @inheritDoc
 */
qa.BaseResult.prototype.get = function() {
  return true;
};
