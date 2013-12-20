

/**
 * Узел парсинга объекта данных передаваемого шаблону.
 *
 * @constructor
 * @implements {qa.ICaseFactory}
 * @param {!*} value Данные узла.
 * @param {!qa.ICase} context Родительский узел данных.
 * @param {qa.db.Node=} opt_parent Родительский узел данных.
 * @param {(number|string)=} opt_key Ключ узла данных в родительском.
 */
qa.db.Node = function(value, context, opt_parent, opt_key) {

  /**
   * @type {*}
   */
  this.__value = value;

  /**
   * @type {!qa.ICase}
   */
  this.__context = context;

  /**
   * @type {qa.db.Node}
   */
  this.__parent = opt_parent || null;

  /**
   * @type {number|string}
   */
  this.__key = opt_key === undefined ? '' : opt_key;
};


/**
 * @inheritDoc
 */
qa.db.Node.prototype.createCase = function(name) {
  if (this.__value[name] === undefined) {
    this.__value[name] = {};
  }

  return new qa.Case(this.__value[name], this.__context, this, name);
};


/**
 * Родительский узел данных.
 *
 * @return {number|string} Родительский узел данных.
 */
qa.db.Node.prototype.getKey = function() {
  return this.__key;
};


/**
 * Родительский узел данных.
 *
 * @return {qa.db.Node} Родительский узел данных.
 */
qa.db.Node.prototype.getParent = function() {
  return this.__parent;
};



/**
 * Родительский узел данных.
 *
 * @return {!qa.ICase} Родительский узел данных.
 */
qa.db.Node.prototype.getCase = function() {
  return this.__context;
};


/**
 * @return {!qa.db.Node} Корневой узел данных.
 */
qa.db.Node.prototype.getRoot = function() {
  return this.__parent !== null ? this.__parent.getRoot() : this;
};


/**
 * Создание и возвращение дочернего узда данных по ключу.
 *
 * @param {(number|string)} key Ключ дочернего узла.
 * @return {qa.db.Node} Новый узел данных.
 */
qa.db.Node.prototype.getChild = function(key) {
  if (this.__value[key] !== undefined) {
    return new qa.db.Node(this.__value[key], this.__context, this, key);
  }

  return null;
};


/**
 * Создание и возвращение дочернего узда данных по ключу.
 *
 * @param {(number|string)} key Ключ дочернего узла.
 * @return {!qa.db.Node} Новый узел данных.
 */
qa.db.Node.prototype.growChild = function(key) {
  if (this.__value[key] === undefined) {
    this.__value[key] = {};
  }

  return new qa.db.Node(this.__value[key], this.__context, this, key);
};


/**
 * Создание и возвращение дочернего узда данных по ключу.
 *
 * @return {!Array.<!qa.db.Node>} Новый узел данных.
 */
qa.db.Node.prototype.growChildren = function() {
  var children = [];

  for (var key in this.__value) {
    children.push(this.growChild(key))
  }

  return children;
};


/**
 * Получение значений узла данных.
 *
 * @param {(number|string)} key Ключ дочернего узла.
 * @return {*} Значение узла данных.
 */
qa.db.Node.prototype.get = function(key) {
  if (key === '.' || key === '') {
    return this.__value;
  }

  if (key === '$') {
    return this.__key;
  }

  if (key === '..') {
    if (this.__parent !== null) {
      return this.__parent.get('.');
    }

    return null;
  }

  return this.__value[key] || null;
};


/**
 * Создание и возвращение дочернего узда данных по ключу.
 *
 * @param {(number|string)} key Ключ дочернего узла.
 * @param {!*} value Ключ дочернего узла.
 */
qa.db.Node.prototype.set = function(key, value) {
  if (key === '.' || key === '') {
    if (this.__parent !== null) {
      this.__parent.set(this.__key, value);
    }
  } else if (key === '..') {
    if (this.__parent !== null) {
      this.__parent.set('.', value);
    }
  } else {
    this.__value[key] = value;
  }
};


/**
 * @param {(number|string)} key Ключ дочернего узла.
 */
qa.db.Node.prototype.remove = function(key) {
  if (key === '.' || key === '') {
    if (this.__parent !== null) {
      this.__parent.remove(this.__key);
    }
  } else if (key === '..') {
    if (this.__parent !== null) {
      this.__parent.remove('.');
    }
  } else {
    delete this.__value[key];
  }
};
