


/**
 * Базовый результат теста.
 *
 * Без утверждений, ошибок и заранее успешный.
 *
 * @see qa.result.Union
 *
 * @constructor
 * @implements {qa.result.IResult}
 */
qa.result.Base = function() {};


/**
 * @inheritDoc
 */
qa.result.Base.prototype.getAssertionCount = function() {
  return 0;
};


/**
 * @inheritDoc
 */
qa.result.Base.prototype.getFailCount = function() {
  return 0;
};


/**
 * @inheritDoc
 */
qa.result.Base.prototype.get = function() {
  return true;
};
