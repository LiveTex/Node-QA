


/**
 * Узел парсинга объекта данных передаваемого шаблону.
 *
 * @constructor
 * @implements {qa.result.folder.IFolder}
 * @param {string} configPath Папка с файлами конфикурации.
 */
qa.result.folder.Suite = function(configPath) {

  /**
   * @type {!qa.result.IResult}
   */
  this.__result = new qa.result.Base();

  /**
   * @type {string}
   */
  this.__configFolder = configPath;
};


/**
 * @inheritDoc
 */
qa.result.folder.Suite.prototype.createChild = function(name) {
  var config = {};

  try {
    config = require(this.__configFolder + '/' + name + '.json');
  } catch (error) {
    console.error(error, __dirname);
  }

  return new qa.result.folder.Case(name, this, config, []);
};


/**
 * @inheritDoc
 */
qa.result.folder.Suite.prototype.processState = function(tags) {
  console.info((this.__result.get() ?
      '\033[32m |\u2714| ' : '\033[31m |\u2718| ') +
          tags + ' \033[0m');
};


/**
 * @inheritDoc
 */
qa.result.folder.Suite.prototype.addResult = function(result, tags) {
  this.__result = new qa.result.Union(result, this.__result);

  console.info((result.get() ? '\033[32m |\u2714| ' : '\033[31m |\u2718| ') +
      tags + ' \033[0m');
};


/**
 * @inheritDoc
 */
qa.result.folder.Suite.prototype.getResult = function() {
  return this.__result;
};
