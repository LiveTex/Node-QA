


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

  console.info((result.get() ? '\033[32m |\u2714| ' : '\033[31m |\u2718| ')  +
      tags.join(' ') + ' \033[0m');
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
