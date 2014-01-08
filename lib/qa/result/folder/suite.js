

/**
 * Узел парсинга объекта данных передаваемого шаблону.
 *
 * @constructor
 * @implements {qa.result.folder.IFolder}
 */
qa.result.folder.Suite = function() {

  /**
   * @type {!qa.result.IResult}
   */
  this.__result = new qa.result.Base();
};


/**
 * @inheritDoc
 */
qa.result.folder.Suite.prototype.createChild = function(name) {
  return new qa.result.folder.Case(name, this);
};


/**
 * @inheritDoc
 */
qa.result.folder.Suite.prototype.passState = function(tags) {
  console.info((this.__result.get() ?
      '\033[32m |\u2714| ' : '\033[31m |\u2718| ') +
          tags.join(' ') + ' \033[0m');
};


/**
 * @inheritDoc
 */
qa.result.folder.Suite.prototype.passResult = function(result, tags) {
  this.__result = new qa.result.Union(result, this.__result);

  console.info((result.get() ? '\033[32m |\u2714| ' : '\033[31m |\u2718| ') +
      tags.join(' ') + ' \033[0m');
};


/**
 * @inheritDoc
 */
qa.result.folder.Suite.prototype.getResult = function() {
  return this.__result;
};
