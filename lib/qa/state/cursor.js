


/**
 * Узел дерева состояния теста.
 *
 * @constructor
 * @implements {qa.result.folder.IFolder}
 *
 * @param {!qa.state.Object} core Объект состояния.
 * @param {!Array.<!qa.state.Key>} origin Исходное положение.
 * @param {!qa.result.folder.IFolder} folder Накопитель результатов теста.
 */
qa.state.Cursor = function(core, origin, folder) {

  /**
   * @type {!qa.state.Object}
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
qa.state.Cursor.prototype.passState = function(tags) {
  this.__folder.passState(tags);
};


/**
 * @inheritDoc
 */
qa.state.Cursor.prototype.passResult = function(result, tags) {
  this.__folder.passResult(result, tags);
};


/**
 * @inheritDoc
 */
qa.state.Cursor.prototype.getResult = function() {
  return this.__folder.getResult();
};


/**
 * @return {!qa.state.Object} Корневой объект состояния.
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
 */
qa.state.Cursor.prototype.copy = function(path) {
  return new qa.state.Cursor(this.__core,
      this.evaluatePath(path), this.__folder);
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

