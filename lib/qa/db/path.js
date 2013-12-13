

/**
 * Класс объекта взятия данных по выбранному пути.
 *
 * @constructor
 * @param {string} path Путь к данным.
 */
qa.db.Path = function(path) {

  /**
   * @type {!Array.<string>}
   */
  this.__path = path.split('/');

  /**
   * @type {string}
   */
  this.__key = this.__path.pop();
};


/**
 * Выборка данных из узла по установленному пути.
 *
 * @param {!qa.db.Node} node Узел данных для выборки.
 * @return {*} Узел-результат выборки.
 */
qa.db.Path.prototype.get = function(node) {
  var target = this.__getChild(node, 0);
  if (target !== null) {
    return target.get(this.__key);
  }

  return null;
};


/**
 * Выборка данных из узла по установленному пути.
 *
 * @param {!qa.db.Node} node Узел данных для выборки.
 * @param {*} value Значение.
 */
qa.db.Path.prototype.set = function(node, value) {
  var target = this.__growChild(node, 0);
  if (target !== null) {
    if (value !== null) {
      target.set(this.__key, value);
    } else {
      target.remove(this.__key);
    }
  }
};


/**
 * Функция рекурсивной выборки данных.
 *
 * @param {!qa.db.Node} node Узел для выборки.
 * @param {number} index Индекс элемента пути.
 * @return {qa.db.Node} Ррезультат выборки.
 */
qa.db.Path.prototype.__getChild = function(node, index) {
  if (this.__path.length > index) {
    var next = this.__getByToken(this.__path[index], node);
    if (next !== null) {
      return this.__getChild(next, index + 1);
    }

    return next;
  }

  return node;
};


/**
 * Функция рекурсивной выборки данных.
 *
 * @param {!qa.db.Node} node Узел для выборки.
 * @param {number} index Индекс элемента пути.
 * @return {qa.db.Node} Ррезультат выборки.
 */
qa.db.Path.prototype.__growChild = function(node, index) {
  if (this.__path.length > index) {
    var next = this.__growByToken(this.__path[index], node);
    if (next !== null) {
      return this.__growChild(next, index + 1);
    }

    return next;
  }

  return node;
};


/**
 * Применение элемента ключа пути к узлу данных.
 *
 * @param {string} token Ключ пути.
 * @param {!qa.db.Node} node Узел данных.
 * @return {qa.db.Node} Результат применения.
 */
qa.db.Path.prototype.__getByToken = function(token, node) {
  if (token.length === 0) {
    return node.getRoot();
  }

  if (token === '.') {
    return node;
  }

  if (token === '..') {
    return node.getParent();
  }

  return node.getChild(token);
};


/**
 * Применение элемента ключа пути к узлу данных.
 *
 * @param {string} token Ключ пути.
 * @param {!qa.db.Node} node Узел данных.
 * @return {qa.db.Node} Результат применения.
 */
qa.db.Path.prototype.__growByToken = function(token, node) {
  if (token.length === 0) {
    return node.getRoot();
  }

  if (token === '.') {
    return node;
  }

  if (token === '..') {
    return node.getParent();
  }

  return node.growChild(token);
};
