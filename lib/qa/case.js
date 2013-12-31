


/**
 * @constructor
 * @extends {qa.state.Node}
 * @implements {qa.result.IFolder}
 * @implements {qa.result.IFolderFactory}
 * @param {!*} value Имя.
 * @param {!qa.result.IFolder} parent Родительский узел данных.
 * @param {!qa.state.Node=} opt_node Родительский узел данных.
 * @param {string} name Имя.
 */
qa.Case = function(name, value, parent, opt_node) {
  qa.state.Node.call(this, name, value, this, opt_node);

  /**
   * @type {!qa.result.IFolder}
   */
  this.__parentFolder = parent;

  /**
   * @type {!qa.result.IResult}
   */
  this.__result = new qa.result.Base();

  /**
   * @type {!Object.<string, string>}
   */
  this.__cookies = {};
};

util.inherits(qa.Case, qa.state.Node);


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
qa.Case.prototype.createFolder = function(name) {
  return new qa.Case(name, {}, this, this);
};


/**
 * @inheritDoc
 */
qa.Case.prototype.passResult = function(result, tags) {
  this.__parentFolder.passResult(result, [this.getKey()].concat(tags));
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
  var exception = new qa.result.Exception();
  this.__result = new qa.result.Union(exception, this.__result);

  this.passResult(exception, [tag]);
};


/**
 *
 */
qa.Case.prototype.passTimeout = function() {
  this.__result = new qa.result.Union(
      new qa.result.Exception(), this.__result);

  this.passCurrentResult(qa.Event.TIMEOUT);
};


/**
 * @param {boolean} value Утверждение.
 * @param {string} tag Тег утверждения.
 */
qa.Case.prototype.passAssertion = function(value, tag) {
  var assertion = new qa.result.Assertion(value);
  this.__result = new qa.result.Union(assertion, this.__result);

  this.passResult(assertion, [tag]);
};


/**
 * @param {qa.Event} tag Тег результата.
 */
qa.Case.prototype.passCurrentResult = function(tag) {
  this.__parentFolder.passResult(this.__result, [this.getKey(), tag]);
};
