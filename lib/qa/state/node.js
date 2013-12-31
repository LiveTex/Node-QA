


/**
 * Узел дерева состояния теста.
 *
 * Узел дерева теста определяется парой ключ-значение, соответсвующим
 * накопителем результатов и родительским узлом дерева.
 *
 * @constructor
 * @param {number|string} key Ключ узла.
 * @param {!*} value Данные узла.
 * @param {!qa.result.IFolder} folder Накопитель результатов теста.
 * @param {!qa.state.Node=} opt_parent Родительский узел дерева.
 */
qa.state.Node = function(key, value, folder, opt_parent) {

  /**
   * @type {number|string}
   */
  this.__key = key;

  /**
   * @type {*}
   */
  this.__value = value;

  /**
   * @type {!qa.result.IFolder}
   */
  this.__folder = folder;

  /**
   * @type {qa.state.Node}
   */
  this.__parent = opt_parent || null;
};


/**
 * Получение ключа узла.
 *
 * @return {number|string} Ключ узла.
 */
qa.state.Node.prototype.getKey = function() {
  return this.__key;
};


/**
 * Получение накопителя результатов.
 *
 * @return {!qa.result.IFolder} Соответсвующий накопитель результатов.
 */
qa.state.Node.prototype.getFolder = function() {
  return this.__folder;
};


/**
 * Получение родительский узла данных.
 *
 * @return {qa.state.Node} Родительский узел данных.
 */
qa.state.Node.prototype.getParent = function() {
  return this.__parent;
};


/**
 * Получение корневого узла данных.
 *
 * Корневым узлом считется узел, у которого не указан родительский.
 *
 * @return {!qa.state.Node} Корневой узел данных.
 */
qa.state.Node.prototype.getRoot = function() {
  return this.__parent !== null ? this.__parent.getRoot() : this;
};


/**
 * Создание и возвращение дочернего узда данных по ключу.
 *
 * В случае наличия соответсвующего поля в значении узла, создается и
 * возвращается новый узел со значением поля и переданным ключем.
 *
 * Если поле отсутствует данный метод вернет `null`.
 *
 * @param {number|string} key Ключ дочернего узла.
 * @return {qa.state.Node} Новый узел данных.
 */
qa.state.Node.prototype.getChild = function(key) {
  if (this.__value[key] !== undefined) {
    return new qa.state.Node(key, this.__value[key], this.__folder, this);
  }

  return null;
};


/**
 * Создание и возвращение дочернего узда данных по ключу.
 *
 * Метод работает аналогично `qa.state.Node#getChild` за исключениме того, что
 * если поле с заданным ключем отстутсвует метод создаст поле с пустым
 * объектом и вернет созданный узел.
 *
 * @param {(number|string)} key Ключ дочернего узла.
 * @return {!qa.state.Node} Новый узел данных.
 */
qa.state.Node.prototype.growChild = function(key) {
  if (this.__value[key] === undefined) {
    this.__value[key] = {};
  }

  return new qa.state.Node(key, this.__value[key], this.__folder, this);
};


/**
 * Создание и возвращение дочерних узлов данных.
 *
 * Для всех объявленных ключей выбранного узла методом `qa.state.Node#growChild`
 * создаются новые узлы.
 *
 * @return {!Array.<!qa.state.Node>} Массив новых узлов данных.
 */
qa.state.Node.prototype.growChildren = function() {
  var children = [];

  for (var key in this.__value) {
    children.push(this.growChild(key))
  }

  return children;
};


/**
 * Получение значения узла данных по последнему элементу пути.
 *
 * @see qa.state.PathToken
 *
 * @param {number|string} token Последний элемент пути.
 * @return {*} Соответсвующее значение.
 */
qa.state.Node.prototype.get = function(token) {
  if (token === qa.state.PathToken.CURRENT ||
      token === qa.state.PathToken.ROOT) {
    return this.__value;
  }

  if (token === qa.state.PathToken.KEY) {
    return this.__key;
  }

  if (token === qa.state.PathToken.PARENT) {
    if (this.__parent !== null) {
      return this.__parent.get(qa.state.PathToken.CURRENT);
    }

    return null;
  }

  return this.__value[token] || null;
};


/**
 * Установка значения узла данных по последнему элементу пути.
 *
 * @see qa.state.PathToken
 *
 * @param {number|string} token Последний элемент пути.
 * @param {*} value Ключ дочернего узла.
 */
qa.state.Node.prototype.set = function(token, value) {
  if (token === qa.state.PathToken.CURRENT ||
      token === qa.state.PathToken.ROOT) {
    if (this.__parent !== null) {
      this.__parent.set(this.__key, value);
    }
  } else if (token === qa.state.PathToken.PARENT) {
    if (this.__parent !== null) {
      this.__parent.set(qa.state.PathToken.CURRENT, value);
    }
  } else {
    this.__value[token] = value;
  }
};


/**
 * Удаление значения узла данных по последнему элементу пути.
 *
 * @see qa.state.PathToken
 *
 * @param {number|string} token Последний элемент пути.
 */
qa.state.Node.prototype.remove = function(token) {
  if (token === qa.state.PathToken.CURRENT ||
      token === qa.state.PathToken.ROOT) {
    if (this.__parent !== null) {
      this.__parent.remove(this.__key);
    }
  } else if (token === qa.state.PathToken.PARENT) {
    if (this.__parent !== null) {
      this.__parent.remove(qa.state.PathToken.CURRENT);
    }
  } else {
    delete this.__value[token];
  }
};
