

/**
 * @param {...(string|number)} var_args Path to value.
 * @return {!async.Actor} Актор.
 */
qa.storage.setup = function(var_args) {
  var args = util.toArray(arguments);

  /**
   * @this {qa.test.IContext}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function setup(data, complete, cancel) {
    qa.storage.set(this.getStorage(), args.shift(), args, function() {
      complete(data);
    }, cancel)
  }

  return setup;
};


/**
 * @param {...(string|number)} var_args Path to value.
 * @return {!async.Actor} Актор.
 */
qa.storage.save = function(var_args) {
  var path = util.toArray(arguments);

  /**
   * @this {qa.test.IContext}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function save(data, complete, cancel) {
    qa.storage.set(this.getStorage(), data, path, function() {
      complete(data);
    }, cancel)
  }

  return save;
};



/**
 * @param {string} type Тип.
 * @param {...(string|number)} var_args Path to value.
 * @return {!async.Actor} Актор.
 */
qa.storage.loadTypeOf = function(type, var_args) {
  var args = util.toArray(arguments);

  /**
   * @this {qa.test.IContext}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function load(data, complete, cancel) {
    qa.storage.getTypeOf(args.shift(),
        this.getStorage(), args, complete, cancel);
  }

  return load;
};



/**
 * @param {!Function} type Тип.
 * @param {...(string|number)} var_args Path to value.
 * @return {!async.Actor} Актор.
 */
qa.storage.loadInstanceOf = function(type, var_args) {
  var args = util.toArray(arguments);

  /**
   * @this {qa.test.IContext}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function load(data, complete, cancel) {
    qa.storage.getInstanceOf(args.shift(),
        this.getStorage(), args, complete, cancel);
  }

  return load;
};


/**
 * @param {!util.ISafeObject} storage Хранилище данных.
 * @param {!Array.<string|number>} path Путь.
 * @param {*} value Значение.
 * @param {function()} complete Приложение.
 * @param {function(string, number=)} cancel Отмена выполнения.
 */
qa.storage.set = function(storage, value, path, complete, cancel) {
  storage.setByPath(value, path);
  complete();
};


/**
 * @param {!util.ISafeObject} storage Хранилище данных.
 * @param {!Array.<string|number>} path Путь.
 * @param {string} type Тип.
 * @param {function(*)} complete Приложение.
 * @param {function(string, number=)} cancel Отмена выполнения.
 */
qa.storage.getTypeOf = function(type, storage, path, complete, cancel) {
  var value = storage.getByPath(path);
  if (typeof value === type) {
    complete(value);
  } else {
    cancel('Type mismatch.');
  }
};


/**
 * @param {!util.ISafeObject} storage Хранилище данных.
 * @param {!Array.<string|number>} path Путь.
 * @param {!Function} type Тип.
 * @param {function(*)} complete Приложение.
 * @param {function(string, number=)} cancel Отмена выполнения.
 */
qa.storage.getInstanceOf = function(type, storage, path, complete, cancel) {
  var value = storage.getByPath(path);
  if (value instanceof type) {
    complete(value);
  } else {
    cancel('Type mismatch.');
  }
};





