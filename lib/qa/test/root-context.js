


/**
 * @constructor
 * @implements {qa.test.IContext}
 */
qa.test.RootContext = function() {

  /**
   * @type {!qa.test.IResult}
   */
  this.__result = new qa.test.BaseResult();
};


/**
 * @inheritDoc
 */
qa.test.RootContext.prototype.passResult = function(result, tags) {
  this.__result = new qa.test.Result(result, this.__result);
  console.log(tags);
};


/**
 * @inheritDoc
 */
qa.test.RootContext.prototype.getDataNode = function() {
  return new qa.db.Node({});
};


/**
 * @inheritDoc
 */
qa.test.RootContext.prototype.getResult = function() {
  return this.__result;
};
