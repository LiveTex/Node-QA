

/**
 * @param {...(string|number)} var_args Path to value.
 * @return {!async.Actor} Актор.
 */
qa.storage.shared.setup = function(var_args) {
  var args = util.toArray(arguments);

  /**
   * @this {qa.test.IContext}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function setup(data, complete, cancel) {
    qa.storage.set(this.getRoot().getStorage(), args.shift(), args, function() {
      complete(data);
    }, cancel)
  }

  return setup;
};


/**
 * @param {...(string|number)} var_args Path to value.
 * @return {!async.Actor} Актор.
 */
qa.storage.shared.save = function(var_args) {
  var path = util.toArray(arguments);

  /**
   * @this {qa.test.IContext}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function save(data, complete, cancel) {
    qa.storage.set(this.getRoot().getStorage(), data, path, function() {
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
qa.storage.shared.loadTypeOf = function(type, var_args) {
  var args = util.toArray(arguments);

  /**
   * @this {qa.test.IContext}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function load(data, complete, cancel) {
    qa.storage.getTypeOf(args.shift(),
        this.getRoot().getStorage(), args, complete, cancel);
  }

  return load;
};


/**
 * @param {!Function} type Тип.
 * @param {...(string|number)} var_args Path to value.
 * @return {!async.Actor} Актор.
 */
qa.storage.shared.loadInstanceOf = function(type, var_args) {
  var args = util.toArray(arguments);

  /**
   * @this {qa.test.IContext}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function load(data, complete, cancel) {
    qa.storage.getInstanceOf(args.shift(),
        this.getRoot().getStorage(), args, complete, cancel);
  }

  return load;
};




