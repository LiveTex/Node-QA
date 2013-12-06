

/**
 * @param {string|number|boolean|Object} value Data.
 * @param {...(string|number)} var_args Path to value.
 * @return {!async.Actor} Актор.
 */
qa.context.setup = function(value, var_args) {
  var args = arguments;

  /**
   * @this {qa.context.ITestContext}
   * @param {*} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function setup(data, complete, cancel) {
    this.set.apply(this, args);
    complete(data);
  }

  return setup;
};


/**
 * @param {...(string|number)} var_args Path to value.
 * @return {!async.Actor} Актор.
 */
qa.context.save = function(var_args) {
  var args = arguments;

  /**
   * @this {qa.context.ITestContext}
   * @param {string|number|boolean|Object} data Данные.
   * @param {function(*)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function save(data, complete, cancel) {
    this.set.apply(this, [data].concat(util.toArray(args)));
    complete(data);
  }

  return async.esc(save);
};


/**
 * @param {...(string|number)} var_args Path to value.
 * @return {!async.Actor} Актор.
 */
qa.context.loadString = function(var_args) {
  var args = arguments;

  /**
   * @this {qa.context.ITestContext}
   * @param {*} data Данные.
   * @param {function(string)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function load(data, complete, cancel) {
    complete(this.getString.apply(this, args));
  }

  return load;
};


/**
 * @param {...(string|number)} var_args Path to value.
 * @return {!async.Actor} Актор.
 */
qa.context.loadBoolean = function(var_args) {
  var args = arguments;

  /**
   * @this {qa.context.ITestContext}
   * @param {*} data Данные.
   * @param {function(boolean)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function load(data, complete, cancel) {
    complete(this.getBoolean.apply(this, args));
  }

  return load;
};


/**
 * @param {...(string|number)} var_args Path to value.
 * @return {!async.Actor} Актор.
 */
qa.context.loadNumber = function(var_args) {
  var args = arguments;

  /**
   * @this {qa.context.ITestContext}
   * @param {*} data Данные.
   * @param {function(number)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function load(data, complete, cancel) {
    complete(this.getNumber.apply(this, args));
  }

  return load;
};


/**
 * @param {...(string|number)} var_args Path to value.
 * @return {!async.Actor} Актор.
 */
qa.context.loadObject = function(var_args) {
  var args = arguments;

  /**
   * @this {qa.context.ITestContext}
   * @param {*} data Данные.
   * @param {function(!Object)} complete Приложение.
   * @param {function(string, number=)} cancel Отмена выполнения.
   */
  function load(data, complete, cancel) {
    complete(this.getObject.apply(this, args));
  }

  return load;
};
