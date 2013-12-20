

/**
 * Узел парсинга объекта данных передаваемого шаблону.
 *
 * @constructor
 * @implements {qa.ICase}
 * @implements {qa.ICaseFactory}
 */
qa.Suite = function() {

  /**
   * @type {!qa.IResult}
   */
  this.__result = new qa.BaseResult();
};


/**
 * @inheritDoc
 */
qa.Suite.prototype.createCase = function(name) {
  return new qa.Case({}, this, null, name);
};


/**
 * @inheritDoc
 */
qa.Suite.prototype.passResult = function(result, tags) {
  this.__result = new qa.Result(result, this.__result);

  console.info((result.get() ? '\033[32m |\u2714| ' : '\033[31m |\u2718| ')  +
      tags.join(' ') + ' \033[0m');
};


/**
 * @inheritDoc
 */
qa.Suite.prototype.getResult = function() {
  return this.__result;
};
