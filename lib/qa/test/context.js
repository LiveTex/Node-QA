


/**
 * @constructor
 * @implements {qa.test.IContext}
 * @param {string} name Имя.
 * @param {!qa.test.IContext} parent Имя.
 */
qa.test.Context = function(name, parent) {

  /**
   * @type {string}
   */
  this.__name = name;

  /**
   * @type {!qa.test.IContext}
   */
  this.__parent = parent;

  /**
   * @type {!qa.db.Node}
   */
  this.__dataNode = parent.getDataNode().growChild(name);

  /**
   * @type {!qa.test.IResult}
   */
  this.__result = new qa.test.BaseResult();
};


/**
 * @param {string} tag Тег утверждения.
 */
qa.test.Context.prototype.passException = function(tag) {
  var exception = new qa.test.Exception();
  this.__result = new qa.test.Result(exception, this.__result);

  this.passResult(exception, [tag]);
  this.passCurrentResult(qa.test.ResultTag.UPDATE);
};


/**
 *
 */
qa.test.Context.prototype.passTimeout = function() {
  this.__result = new qa.test.Result(new qa.test.Exception(), this.__result);
  this.passCurrentResult(qa.test.ResultTag.TIMEOUT);
  this.passCurrentResult(qa.test.ResultTag.UPDATE);
};


/**
 * @param {boolean} value Утыверждение.
 * @param {string} tag Тег утверждения.
 */
qa.test.Context.prototype.passAssertion = function(value, tag) {
  var assertion = new qa.test.Assertion(value);
  this.__result = new qa.test.Result(assertion, this.__result);

  this.passResult(assertion, [tag]);
  this.passCurrentResult(qa.test.ResultTag.UPDATE);
};


/**
 * @param {qa.test.ResultTag} tag Тег результата.
 */
qa.test.Context.prototype.passCurrentResult = function(tag) {
  this.__parent.passResult(this.__result, [this.__name, tag]);
};


/**
 * @inheritDoc
 */
qa.test.Context.prototype.passResult = function(result, tags) {
  this.__parent.passResult(result, [this.__name].concat(tags));
};


/**
 * @inheritDoc
 */
qa.test.Context.prototype.getResult = function() {
  return this.__result;
};


/**
 * @inheritDoc
 */
qa.test.Context.prototype.getDataNode = function() {
  return this.__dataNode;
};
