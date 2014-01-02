


/**
 * Узел дерева состояния теста.
 *
 * @constructor
 * @param {!qa.state.Object} core Объект состояния.
 * @param {!Array.<!qa.state.Key>} origin Исходное положение.
 */
qa.state.Cursor = function(core, origin) {

  /**
   * @type {!qa.state.Object}
   */
  this.__core = core;

  /**
   * @type {!Array.<!qa.state.Key>}
   */
  this.__origin = origin;

  /**
   * @type {!Array.<!qa.state.Key>}
   */
  this.__path = origin.slice(0);
};

/**
 * @param {!Array.<!qa.state.Key>} path Путь.
 */
qa.state.Cursor.prototype.copy = function(path) {
  this.move(path);
  return new qa.state.Cursor(this.__core, this.__path);
};


/**
 * @param {!Array.<!qa.state.Key>} path Путь.
 */
qa.state.Cursor.prototype.move = function(path) {
  this.__path = this.__origin.slice(0);

  var i = 0,
      l = path.length;

  while (i < l) {
    switch (path[i]) {
      case qa.state.PathToken.ROOT: {
        this.__path.length = 0;
        break;
      }

      case qa.state.PathToken.PARENT: {
        this.__path.pop();
        break;
      }

      case qa.state.PathToken.CURRENT: {
        break;
      }

      default: {
        this.__path.push(path[i]);
      }
    }

    i += 1;
  }
};


/**
 * Установка значения текущего узла.
 *
 * @param {!qa.state.Value} value Значение.
 */
qa.state.Cursor.prototype.set = function(value) {
  var needle = this.__core;

  var i = -1,
      l = this.__path.length;

  while (i < l) {
    var token = this.__path[i += 1];

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
 * Получение значения текущего узла.
 *
 * @return {qa.state.Value} Значение.
 */
qa.state.Cursor.prototype.get = function() {
  var needle = this.__core;

  var i = -1,
      l = this.__path.length;

  while (i < l && needle !== null) {
    var token = this.__path[i += 1];

    if (needle[token] !== undefined) {
      needle = needle[token];
    } else {
      needle = null;
    }
  }

  return needle;
};


/**
 * Удаление текущего узла.
 */
qa.state.Cursor.prototype.remove = function() {
  var needle = this.__core;

  var i = -1,
      l = this.__path.length;

  while (i < l) {
    var token = this.__path[i += 1];

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

