


/**
 * @constructor
 * @implements {qa.ICase}
 * @extends {qa.db.Node}
 * @param {*} value Имя.
 * @param {!qa.ICase} parent Родительский узел данных.
 * @param {qa.db.Node} node Родительский узел данных.
 * @param {string} name Имя.
 */
qa.Case = function(value, parent, node, name) {
  qa.db.Node.call(this, value, this, node, name);

  /**
   * @type {!qa.ICase}
   */
  this.__parentContext = parent;

  /**
   * @type {!qa.IResult}
   */
  this.__result = new qa.BaseResult();

  /**
   * @type {!Object.<string, string>}
   */
  this.__cookies = {};
};

util.inherits(qa.Case, qa.db.Node);


/**
 * TODO: Сделать ок-индексацию по доменам.
 *
 * @param {string} domain Домен.
 * @param {string} cookie Куки.
 */
qa.Case.prototype.setCookie = function(domain, cookie) {
  this.__cookies[domain] = cookie;
};


/**
 * @param {string} domain Домен.
 * @return {string} Куки.
 */
qa.Case.prototype.getCookie = function(domain) {
  return this.__cookies[domain] || '';
};


/**
 * @inheritDoc
 */
qa.Case.prototype.passResult = function(result, tags) {
  this.__parentContext.passResult(result, [this.getKey()].concat(tags));
};


/**
 * @inheritDoc
 */
qa.Case.prototype.getResult = function() {
  return this.__result;
};


/**
 * @param {string} tag Тег утверждения.
 */
qa.Case.prototype.passException = function(tag) {
  var exception = new qa.Exception();
  this.__result = new qa.Result(exception, this.__result);

  this.passResult(exception, [tag]);
};


/**
 *
 */
qa.Case.prototype.passTimeout = function() {
  this.__result = new qa.Result(
      new qa.Exception(), this.__result);

  this.passCurrentResult(qa.ResultType.TIMEOUT);
};


/**
 * @param {boolean} value Утверждение.
 * @param {string} tag Тег утверждения.
 */
qa.Case.prototype.passAssertion = function(value, tag) {
  var assertion = new qa.Assertion(value);
  this.__result = new qa.Result(assertion, this.__result);

  this.passResult(assertion, [tag]);
};


/**
 * @param {qa.ResultType} tag Тег результата.
 */
qa.Case.prototype.passCurrentResult = function(tag) {
  this.__parentContext.passResult(this.__result, [this.getKey(), tag]);
};
