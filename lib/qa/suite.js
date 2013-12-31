

/**
 * Узел парсинга объекта данных передаваемого шаблону.
 *
 * @constructor
 * @implements {qa.result.IFolder}
 * @implements {qa.result.IFolderFactory}
 */
qa.Suite = function() {

  /**
   * @type {!qa.result.IResult}
   */
  this.__result = new qa.result.Base();
};


/**
 * @inheritDoc
 */
qa.Suite.prototype.createFolder = function(name) {
  return new qa.Case(name, {}, this);
};


/**
 * @inheritDoc
 */
qa.Suite.prototype.passResult = function(result, tags) {
  this.__result = new qa.result.Union(result, this.__result);

  console.info((result.get() ? '\033[32m |\u2714| ' : '\033[31m |\u2718| ')  +
      tags.join(' ') + ' \033[0m');
};


/**
 * @inheritDoc
 */
qa.Suite.prototype.getResult = function() {
  return this.__result;
};
