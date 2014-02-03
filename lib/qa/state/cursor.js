


/**
 * Курсор в дереве состояния теста.
 *
 * Положение курсора задается путем в дереве. Путь в дереве представляет собой
 * последоваетльность вложенных ключей и управлящих значений.
 *
 * Для конечного представления такой последовательности обычно ипользуется
 * строка из ключей разделенных символом `/`.
 *
 * При наличии символа `/` в начале последовательности путь считается
 * абсолютным. Абсолюным называется путь раскрывающий вложенность из корня
 * дерева. Наличие символа `/` в окончании последовательности не имеет значения.
 *
 * Например:
 * ```
 * /global/path/to/value - выпор по абсолютному пути;
 * relative/path/to/value - выпор по относительному пути;
 * / - выбор корневого узла.
 * ```
 *
 * Символы `.` и `..` являются управляющими и использутся для получения
 * дополнительных возможностей выбора значений.
 *
 * `.` - взятие текущего узла в последовательности. Например:
 * ```
 * some/value/. - тоже что и some/value;
 * . - выбор текущего узла.
 * ```
 *
 * `..` - взятие родительского узла, при его наличии. Например:
 * ```
 * some/value/.. - тоже что и some;
 * ../ - выбор родительского узла;
 * ../sibling - выбор соседнего узла.
 * ```
 *
 * @see qa.state.Tree
 * @see qa.state.PathToken
 * @see qa.state.PATH_SEPARATOR
 *
 * @constructor
 * @implements {qa.ext.IClientLibrary}
 * @implements {qa.result.folder.IFolder}
 *
 * @param {!qa.state.Tree} core Объект состояния.
 * @param {!Array.<!qa.state.Key>} origin Исходное положение.
 * @param {!qa.result.folder.IFolder} folder Накопитель результатов теста.
 * @param {!qa.ext.IClientLibrary} clientLibrary Библиотека пользователей
 *    интерфейса.
 */
qa.state.Cursor = function(core, origin, folder, clientLibrary) {

  /**
   * @type {!qa.state.Tree}
   */
  this.__core = core;

  /**
   * @type {!Array.<!qa.state.Key>}
   */
  this.__path = origin.slice(0);

  /**
   * @type {!qa.result.folder.IFolder}
   */
  this.__folder = folder;

  /**
   * @type {!qa.ext.IClientLibrary}
   */
  this.__clientLibrary = clientLibrary;
};


/**
 * @inheritDoc
 */
qa.state.Cursor.prototype.registerClient = function(name, client) {
  this.__clientLibrary.registerClient(name, client);
};


/**
 * @inheritDoc
 */
qa.state.Cursor.prototype.getClient = function(name) {
  return this.__clientLibrary.getClient(name);
};


/**
 * @inheritDoc
 */
qa.state.Cursor.prototype.terminateClient = function(name) {
  this.__clientLibrary.terminateClient(name);
};


/**
 * @inheritDoc
 */
qa.state.Cursor.prototype.createChild = function(name) {
  return this.__folder.createChild(name);
};


/**
 * @inheritDoc
 */
qa.state.Cursor.prototype.processState = function(tags) {
  this.__folder.processState(tags);
};


/**
 * @inheritDoc
 */
qa.state.Cursor.prototype.addResult = function(result, tags) {
  this.__folder.addResult(result, tags);
};


/**
 * @inheritDoc
 */
qa.state.Cursor.prototype.getResult = function() {
  return this.__folder.getResult();
};


/**
 * @return {!qa.state.Tree} Корневой объект состояния.
 */
qa.state.Cursor.prototype.getCore = function() {
  return this.__core;
};


/**
 * Получение ключа курсора - последнего элемента текущего пути.
 *
 * @return {!qa.state.Key} Ключ курсора.
 */
qa.state.Cursor.prototype.getKey = function() {
  return this.__path[this.__path.length - 1] || '';
};


/**
 * @return {!Array.<!qa.state.Key>} Путь.
 */
qa.state.Cursor.prototype.getPath = function() {
  return this.__path;
};


/**
 * @param {!Array.<!qa.state.Key>} path Путь.
 * @return {!qa.state.Cursor} Созданный курсор.
 */
qa.state.Cursor.prototype.copy = function(path) {
  return new qa.state.Cursor(this.__core, this.evaluatePath(path),
      this.__folder, this.__clientLibrary);
};


/**
 * @param {!Array.<!qa.state.Key>} path Путь к узлу.
 * @return {!Array.<!qa.state.Key>} Новый путь.
 */
qa.state.Cursor.prototype.evaluatePath = function(path) {
  var result = this.__path.slice(0);

  var i = 0,
      l = path.length;

  while (i < l) {
    switch (path[i]) {
      case qa.state.PathToken.ROOT: {
        result.length = 0;
        break;
      }

      case qa.state.PathToken.PARENT: {
        result.pop();
        break;
      }

      case qa.state.PathToken.CURRENT: {
        break;
      }

      default: {
        result.push(path[i]);
      }
    }

    i += 1;
  }

  return result;
};


/**
 * Установка значения узла.
 *
 * @param {!Array.<!qa.state.Key>} path Путь к узлу.
 * @param {!qa.state.Value} value Значение.
 */
qa.state.Cursor.prototype.set = function(path, value) {
  var targetPath = this.evaluatePath(path);
  var needle = this.__core;

  var i = 0,
      l = targetPath.length;

  while (i < l) {
    var token = targetPath[i];

    i += 1;

    if (i === l) {
      needle[token] = value;
    } else {
      if (needle[token] === undefined) {
        needle[token] = {};
      }

      needle = needle[token];
    }
  }
};


/**
 * Получение значения узла.
 *
 * @param {!Array.<!qa.state.Key>=} opt_path Путь к узлу.
 * @return {qa.state.Value} Значение.
 */
qa.state.Cursor.prototype.get = function(opt_path) {
  var targetPath = opt_path ? this.evaluatePath(opt_path) : this.__path;
  var needle = this.__core;

  var i = 0,
      l = targetPath.length;

  while (i < l && needle !== null) {
    var token = targetPath[i];

    i += 1;

    if (needle[token] !== undefined) {
      needle = needle[token];
    } else {
      needle = null;
    }
  }

  return needle;
};


/**
 * Удаление узла.
 *
 * @param {!Array.<!qa.state.Key>=} opt_path Путь к узлу.
 */
qa.state.Cursor.prototype.remove = function(opt_path) {
  var targetPath = opt_path ? this.evaluatePath(opt_path) : this.__path;
  var needle = this.__core;

  var i = 0,
      l = targetPath.length;

  while (i < l) {
    var token = targetPath[i];

    i += 1;

    if (i === l) {
      delete needle[token];
    } else {
      if (needle[token] === undefined) {
        needle[token] = {};
      }

      needle = needle[token];
    }
  }
};

